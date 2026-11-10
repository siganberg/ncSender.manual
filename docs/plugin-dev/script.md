# The script (commands.js)

The file named by the manifest's `commands` key runs inside ncSender itself, not
in a browser. It defines functions ("hooks") that ncSender calls, and it uses
the global [`pluginContext`](plugin-context.md) to talk to ncSender.

## The environment

- Plain JavaScript run as a script. Modern syntax (`let`, `const`, arrow
  functions, template strings, classes, `Promise`) works.
- **No modules.** `import`, `require`, `export function` and `export default`
  are errors. One trailing `export { a, b };` line is tolerated and removed, so
  the same file can be imported by your own tests.
- **No browser or Node globals.** There is no `console`, `setTimeout`,
  `setInterval`, `fetch`, `XMLHttpRequest`, `window`, `document`, `process` or
  `Buffer`. Use `pluginContext.log`, `pluginContext.setInterval` and
  `pluginContext.http` instead.
- The only global ncSender adds is `pluginContext`.
- Memory is limited to 50 MB per plugin. There is no time limit, so an endless
  loop freezes every plugin and every command. Keep loops bounded.

### One lock for everything

All plugins share a single lock. It is held while any hook, timer callback or
web-request callback runs, and every command sent to the machine waits for it.

- Do the work and return quickly.
- Never wait on the operator inside a hook or timer unless a command is meant
  to be held up. `showDialog` and `askGate` block until answered.
- Web requests are callback-based for this reason: the request runs outside
  the lock and only your callback takes it.

## When the script loads and restarts

| When | What happens |
|---|---|
| ncSender starts | Every enabled plugin's script is loaded |
| The plugin is enabled, installed or updated | Loaded |
| The plugin's settings are saved | **Reloaded.** All variables and timers are reset and `buildInitialConfig` runs again |
| The plugin is disabled or removed | Unloaded, timers stopped |

Loading runs the whole file top to bottom, then calls `buildInitialConfig`.
Code at the top level may use `pluginContext`, for example to start a timer.
There is no unload hook and no settings-changed hook.

If loading throws, the plugin is marked failed and Plugin Manager shows the
error with a **Retry** button. If ncSender itself crashes while loading the
same version of a plugin on two startups in a row, that version is quarantined
and skipped until it is updated or the operator presses **Retry**.

## Hooks

Write every hook as a `function` declaration:

```js
function onBeforeCommand(commands, context, settings) { ... }   // found
const onBeforeCommand = (commands) => { ... };                  // NOT found
```

### buildInitialConfig(raw) — required

Called once each time the script loads.

- `raw`: the plugin's saved settings object, `{}` when nothing was saved.
- Return value: any value. ncSender keeps it and passes it to the other hooks
  as `settings`. Use it to fill in defaults.

```js
function buildInitialConfig(raw) {
  raw = raw || {};
  return {
    pockets: Number(raw.pockets) || 6,
    safeZ: Number(raw.safeZ) || -5
  };
}
```

A script without this function does not load.

### onBeforeCommand(commands, context, settings)

Called for each command line before it is sent, from every source: a running
job, the console, buttons, macros, the pendant.

Plugins run in order of manifest `priority` (lower first). Each one receives
the array the previous one returned.

**`commands`** is an array. The first plugin receives one element:

```js
{
  command: "M6 T2",        // the line
  isOriginal: true,        // true for the line as it was received
  displayCommand: null,    // text shown in the terminal instead of command
  meta: null               // or { silent, sourceId, quiet: {...} }
}
```

**`context`**

| Member | Type | Meaning |
|---|---|---|
| `machineState.tool` | number | Tool that will be in the spindle when this line runs |
| `machineState.spindleActive` | boolean | Spindle running or spinning down |
| `machineState.toolLengthSet` | boolean | A tool length offset is active |
| `machineState.zeroSetWithoutTlr` | boolean | Z0 was set with no tool length reference |
| `machineState.zeroTool` | number | Tool that Z0 was set with |
| `machineState.mpos` | `{ x, y, z }` | Last reported machine position, `0` when unknown |
| `lineNumber` | number | Program line, `0` outside a job |
| `safeZHeight` | number | The app's safe Z setting |
| `controller.overrideControl` | boolean | The controller supports override-control codes |
| `sourceId` | string or null | Who sent the line: `"job"`, `"client"`, `"system"`, `"plugin:<id>"`, ... |
| `jobRunning` | boolean | A job is running or paused |
| `laserMode` | boolean | Laser mode is on (Pro) |
| `edition` | string | `"pro"` or `"community"` |
| `tools` | array | `{ toolNumber, toolId, offsets: { x, y, z, tlsZ } }` for each tool. `toolId` is the T number M6 uses; `toolNumber` is the slot (0 when none); `offsets.z` is the stored tool length offset |

**`settings`** is what `buildInitialConfig` returned.

**Return** an array of command objects:

| Key | Type | Meaning |
|---|---|---|
| `command` | string | Required |
| `isOriginal` | boolean | Default false. Keep it true on a line you pass through unchanged |
| `displayCommand` | string | Optional terminal text |
| `meta` | object | Optional: `{ silent, sourceId, quiet: { terminalCommand, terminalResponse, logCommand, logResponse } }` |

Rules:

- **To leave a line alone, `return commands;`.**
- **Returning nothing, or an empty array, drops the command.** That is how a
  plugin swallows a line on purpose.
- To replace one line with many, return many objects. Each is checked by
  ncSender's own safety rules and sent in order.
- If the hook throws, the command is refused and a running job is stopped.
- A returned Promise is waited for, but prefer plain synchronous code.

```js
function onBeforeCommand(commands, context, settings) {
  var out = [];
  for (var i = 0; i < commands.length; i++) {
    var c = commands[i];
    var m = /^\s*M6\s*T(\d+)/i.exec(c.command);
    if (!m) { out.push(c); continue; }
    var tool = Number(m[1]);
    out.push({ command: 'G53 G0 Z' + context.safeZHeight, displayCommand: 'M6 T' + tool });
    out.push({ command: 'M61 Q' + tool });
  }
  return out;
}
```

When a plugin expands `M6` or `$TLS`, ncSender wraps the result with its own
tool-change bookkeeping and raises the tool-change hooks below.

#### Special lines a plugin can emit

These are handled by ncSender and never reach the controller as written.

| Line | Meaning |
|---|---|
| `(MSG, PLUGIN_<NAME>:<CODE>)` then `M0` | Opens the prompt `<CODE>` from the manifest's `messages`. See [Pages and dialogs](ui.md#prompts-from-g-code-messages) |
| `(MSG, NCSENDER_PAUSE: Title \| Body)` then `M0` | A generic Continue / Abort prompt with plain text |
| `(GATE_ABORT_OFFERED)` ... `(GATE_ABORT)` ... `(GATE_END)` | Lines to run only when the operator presses Abort |
| `(DONGLE:<name>:<payload>)` | Send `payload` to the ncSender wireless accessory `name` when this line is reached |
| `(DONGLE_WAIT:<name>:<field>=<target>:<tolerance>:<timeoutSec>)` | Hold the program until the accessory reports that value (30 s at most) |
| `$keepout_off <line>` | Pro: run one line ignoring keepout zones. Check `context.edition === "pro"` first |

A line your plugin emits that starts with another plugin's `$NAME_...` command
is passed through the plugin chain again, so plugins can call each other's
commands.

### onGcodeProgramLoad(content, context, settings)

Needs `"onGcodeProgramLoad"` in the manifest's `events`.

Called when a program is loaded, from the file manager or from a generator
page. Not called when ncSender restores the last program at startup.

- `content`: the whole program as one string.
- `context`: `{ filename, sourcePath }` (`sourcePath` may be null).
- Return a string to replace the program. Any other return value leaves it
  unchanged.

Plugins run in the order shown in Plugin Manager (drag to reorder), each
receiving the previous one's output.

If the hook throws, the program still loads but ncSender refuses to run it
until it is loaded again with the plugin working.

```js
function onGcodeProgramLoad(content, context, settings) {
  return content.replace(/^M0?6\s*T0\b.*$/gim, '(tool 0 change removed)');
}
```

### onAfterJobEnd(settings)

Called when a job finishes, is stopped or is cancelled. Return value ignored.

### onToolChangeStart(event, settings) and onToolChangeEnd(event, settings)

Called around a tool change that a plugin expanded (`M6` or `$TLS`). A start is
always delivered before its end. Return value ignored.

| `event` member | Meaning |
|---|---|
| `kind` | `"M6"` or `"TLS"` |
| `tool`, `previousTool` | Tool numbers |
| `command` | The original line |
| `sourceId` | Who sent it |
| `jobRunning` | boolean |
| `outcome` (end only) | `"completed"` or `"aborted"` |
| `reason` (end only) | null, or `"error"`, `"alarm"`, `"stopped"`, `"disconnected"` |

### onControllerError(event, settings)

Called once for each `error:n` and `ALARM:n` from the controller. Read-only.

| `event` member | Meaning |
|---|---|
| `type` | `"error"` or `"alarm"` |
| `code` | number or null |
| `message`, `raw` | Text, or null |
| `command` | The line that caused it, when known |
| `sourceId`, `jobRunning`, `line`, `file` | Where it happened |
| `timestamp` | ISO 8601 string |

### onRequest(payload)

Called when a page posts to `/api/plugins/<id>/request`. This is how a
plugin's page or floating panel talks to its script.

- `payload`: the JSON the page sent.
- Return any JSON-serialisable value; it becomes the response.
- Must be synchronous. A Promise is not waited for.
- If it throws, the page gets HTTP 400 with `{ "error": "<message>" }`.

```js
var count = 0;

function onRequest(payload) {
  if (payload && payload.action === 'add') count += 1;
  return { count: count };
}
```

For slow work, start it in `onRequest`, return at once, and let the page poll
for the result.

## Testing the script outside ncSender

Because the script has no imports, it runs under Node with a fake
`pluginContext`. End the file with one line:

```js
export { buildInitialConfig, onBeforeCommand };
```

ncSender removes that line; your test strips it too (or loads the file as an
ES module) and calls the functions directly.
