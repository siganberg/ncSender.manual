# Pages and dialogs

A plugin can show its own page, ask the operator questions, and open prompts
from G-code. For a small always-visible panel on the main screen, see
[Floating panels](panels.md).

| What | Made with | Good for |
|---|---|---|
| Settings or tool page | `configUi` + a `toolMenu` entry | Settings, G-code generators, wizards |
| Question with buttons | `pluginContext.askGate` | "Is the tool loaded?" |
| Custom dialog | `pluginContext.showDialog` / `showDialogAsync` | Anything `askGate` cannot express |
| Notice | `pluginContext.showNotice` | "I refused that command, here is why" |
| Prompt from G-code | manifest `messages` | Pauses inside a tool-change routine |

## The plugin page (configUi)

The page named by `configUi` opens as a dialog when the operator presses one of
the plugin's `toolMenu` buttons on the **Plugins** tab. A plugin page needs a
`toolMenu` entry; without one it cannot be opened.

```json
"configUi": "config.html",
"toolMenu": [{ "id": "open-config", "label": "My Plugin", "icon": "icon.svg" }]
```

The dialog opens on every connected screen (kiosk, browser, remote), and
closing it on one closes it on all.

### Placeholders

Before the page is shown, ncSender replaces these texts anywhere in the file:

| Placeholder | Replaced with |
|---|---|
| `__INITIAL_CONFIG__` | The plugin's saved settings as JSON (`{}` when none) |
| `__SERVER_PORT__` | ncSender's port, normally `8090` |
| `__TOOL_MENU_LABEL__` | The label of the button that was pressed |

```html
<script>
  var settings = __INITIAL_CONFIG__;
  var BASE = window.location.origin;
</script>
```

### The page is part of the app, not a frame

The page's HTML is inserted into ncSender's own window and its `<script>` tags
are run there. That has consequences:

- **Use relative or same-origin URLs.** `fetch('/api/...')` reaches ncSender.
- **Your CSS is global.** Prefix every rule with an id on your root element:
  `#myplugin-root .row { ... }`.
- **ncSender styles every `<button>` in the dialog** with its accent colour,
  padding and radius. To style your own buttons, use an id selector so your
  rule wins: `#myplugin-root button { ... }`.
- **Your script's globals are the app's globals.** Wrap everything in a
  function so names do not collide, and so opening the page twice does not
  redeclare them:

    ```html
    <div id="myplugin-root"> ... </div>
    <script>
    (function () {
      var root = document.getElementById('myplugin-root');
      // everything in here
    })();
    </script>
    ```

- **Listeners and timers outlive the dialog.** Remove what you add to
  `window`, and stop timers when your root element is gone
  (`if (!document.body.contains(root)) clearInterval(timer);`).
- ncSender's CSS variables are available: `--color-surface`,
  `--color-surface-muted`, `--color-text-primary`, `--color-text-secondary`,
  `--color-border`, `--color-accent`, `--gap-xs`, `--gap-sm`, `--gap-md`,
  `--radius-small`, `--radius-medium`. Using them makes the page follow light
  and dark themes.
- The dialog is as wide as its content (320 px minimum) and at most 85% of the
  screen height. Set a width on your root element.

### Things a page commonly does

| Task | How |
|---|---|
| Read saved settings | `__INITIAL_CONFIG__`, or `GET /api/plugins/<id>/settings` |
| Save settings | `PUT /api/plugins/<id>/settings` with the **whole** settings object. It replaces what was saved and restarts the plugin's script |
| Talk to the plugin's script | `POST /api/plugins/<id>/request` → the script's `onRequest(payload)` |
| Close the dialog | `window.postMessage({ type: 'close-plugin-dialog' }, '*')` |
| Load generated G-code into ncSender | `POST /api/gcode-files/load-temp` with `{ filename, content }` |
| Save G-code to the library | `POST /api/gcode-files/file/save` with `{ path, content }` |
| Send a command | `POST /api/send-command` with `{ command }` |
| Load another file from the plugin folder | `GET /api/plugins/<id>/icon?file=lib/helper.js` |
| Tell Pro from Community, kiosk from desktop | `GET /api/app-info` → `{ edition, kiosk }` |

All of these are described in [HTTP API](http-api.md).

```js
function save(settings) {
  return fetch('/api/plugins/com.example.myplugin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
}
```

### Messages between the page and ncSender

The page receives these with `window.addEventListener('message', ...)` while
it is open:

| `event.data.type` | Payload | When |
|---|---|---|
| `server-state-update` | `state`: the full machine and job state | When the dialog opens, then on every change |
| `cnc-data` | `data`: one line of controller output | Each line the controller sends |
| `cnc-error` | `error`: the error or alarm | Each controller error or alarm |

The page can send these with `window.postMessage(message, '*')`:

| `type` | Payload | Effect |
|---|---|---|
| `close-plugin-dialog` | `data` (optional, any JSON) | Closes the dialog. For a dialog opened by `showDialog`, `data` is what the script receives |
| `send-command` | `command`, `displayCommand` (optional) | Sends a command, through the same checks as the console |

## Questions with buttons: askGate

```js
var answer = pluginContext.askGate({
  title: 'Load tool 3',
  message: 'Put <b>T3</b> in the spindle, then continue.',
  messageHtml: true,
  variant: 'warning',
  buttons: [
    { value: 'abort', label: 'Abort', style: 'danger' },
    { value: 'ok', label: 'Continue', style: 'primary', isDefault: true }
  ]
});
if (answer !== 'ok') { /* stop */ }
```

The prompt appears on every screen and on the pendant. The call **blocks until
someone answers**; there is no timeout. Use it where a command is meant to be
held up, such as inside `onBeforeCommand` during a tool change. Do not call it
from a timer.

| Option | Type | Meaning |
|---|---|---|
| `title` | string | Required |
| `message` | string | Body text |
| `messageHtml` | boolean | Treat `message` as HTML |
| `variant` | string | `info` (default), `success`, `warning`, `danger` |
| `icon` | string | `hand`, `home`, `warning`, `info`, `success` |
| `buttons` | array | `{ value, label, style?, isDefault?, requiresStepsComplete? }`. `style` is `primary`, `danger` or `secondary`. Without `buttons` there is one OK button returning `"ok"` |
| `steps` | array | `{ value, label, commands: [..] }`. Buttons that send commands without closing the prompt |
| `stepConfig` | object | `{ holdMs, countdownSec, chainSteps }` for step buttons (defaults 1000, 5, false) |
| `persist` | boolean | Keep the prompt across an ncSender restart |
| `key` | string | Callers using the same key share one prompt |

Returns the chosen button's `value`, or `null` if the options were unusable.

## Custom dialogs: showDialog and showDialogAsync

```js
var id = pluginContext.showDialogAsync(
  'Pick a pocket',
  '<div id="pp-root">...<script>/* page code */<\/script></div>',
  { closable: true },
  function (response) {
    if (response) pluginContext.log('picked', response.pocket);
  }
);
```

- The HTML is shown exactly like a plugin page: same rules, same messages.
  Placeholders are **not** replaced.
- The page answers with
  `window.postMessage({ type: 'close-plugin-dialog', data: { pocket: 2 } }, '*')`.
- The response is `null` when the dialog was closed with its X, Escape or a
  click outside.
- `options.closable: false` removes those ways of closing it.
- `showDialog(title, html, options)` is the blocking form: it returns the
  response and holds every command until then (10 minutes at most).
- One dialog is shown at a time. Opening another replaces the first.

## Notices: showNotice

```js
pluginContext.showNotice(
  'Drawbar blocked',
  'The spindle is still turning.',
  { Spindle: '12000 rpm', Command: 'M64 P2' }
);
```

A popup the operator dismisses. It never blocks, so it is safe anywhere. Text
is shown as plain text.

## Prompts from G-code (messages)

A routine your plugin emits can pause and show a prompt without any script
running at that moment. Define the prompts in the manifest:

```json
"messages": {
  "LOAD": {
    "title": "Load tool",
    "message": "Put {toolNumber} in the spindle and tighten the collet.",
    "continueLabel": "Continue"
  }
}
```

and emit, from `onBeforeCommand`:

```
(MSG, PLUGIN_MYPLUGIN:LOAD_3)
M0
```

- `MYPLUGIN` is the last part of the plugin id (`com.example.myplugin`), in
  any case.
- `LOAD_3` looks up `LOAD_3`, then `LOAD` with `3` as the tool number.
  `{toolNumber}` in the message becomes **T3** and the tool's name.
- The prompt has **Abort** and the Continue button. Continue resumes the
  program. Abort resets the controller, then runs the lines in the plugin's
  saved setting `abortEventGcode` (one command per line), if any.

| Key | Meaning |
|---|---|
| `title` | Prompt title |
| `message` | Body, HTML allowed |
| `continueLabel` | Text of the Continue button. An empty string removes it, leaving only Abort |
| `buttons` | `[{ label, gcode: [..] }]`: step buttons the operator must press, in order, before Continue is enabled |

To run clean-up lines only when the operator aborts:

```
(GATE_ABORT_OFFERED)
(MSG, PLUGIN_MYPLUGIN:CLAMP_FAILED)
M0
(GATE_ABORT)
M5
G53 G0 Z0
(GATE_END)
```

The lines between `(GATE_ABORT)` and `(GATE_END)` run on Abort only.
