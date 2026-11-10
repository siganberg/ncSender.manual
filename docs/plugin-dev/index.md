# Plugin Development

This section is the reference for writing your own ncSender plugin. It covers
the plugin folder, `manifest.json`, the script that runs inside ncSender, the
pages a plugin can show, and how to publish.

!!! tip "Building with an AI assistant"
    These pages are written to be read by an assistant such as Claude. Give it
    the links below and ask it to read all of them before it writes any code:

    - `https://docs.ncsender.xyz/plugin-dev/`
    - `https://docs.ncsender.xyz/plugin-dev/manifest/`
    - `https://docs.ncsender.xyz/plugin-dev/script/`
    - `https://docs.ncsender.xyz/plugin-dev/plugin-context/`
    - `https://docs.ncsender.xyz/plugin-dev/ui/`
    - `https://docs.ncsender.xyz/plugin-dev/panels/`
    - `https://docs.ncsender.xyz/plugin-dev/http-api/`
    - `https://docs.ncsender.xyz/plugin-dev/publishing/`

    The [rules that catch most first plugins](#rules-that-catch-most-first-plugins)
    at the end of this page are the ones to follow exactly.

## What a plugin can do

| You want to | Use | Page |
|---|---|---|
| Change or expand commands before they reach the controller (tool changes, custom `$` commands) | `onBeforeCommand` | [Script](script.md) |
| Rewrite a G-code program when it is loaded | `onGcodeProgramLoad` | [Script](script.md) |
| React to job end, tool changes, errors and alarms | `onAfterJobEnd`, `onToolChangeStart`, `onToolChangeEnd`, `onControllerError` | [Script](script.md) |
| Run something in the background on a timer | `pluginContext.setInterval` | [pluginContext](plugin-context.md) |
| Read machine state, send commands, read the tool library | `pluginContext` | [pluginContext](plugin-context.md) |
| Call a web service, sync files into the G-code library | `pluginContext.http`, `pluginContext.files` | [pluginContext](plugin-context.md) |
| Show a settings page or a G-code generator | `configUi` page opened from the **Plugins** tab | [Pages and dialogs](ui.md) |
| Ask the operator something during a job | `askGate`, `showDialog`, manifest `messages` | [Pages and dialogs](ui.md) |
| Show a small floating panel on the main screen (Pro) | manifest `overlay` | [Floating panels](panels.md) |

## The plugin folder

A plugin is a folder named after its id:

```
com.example.myplugin/
  manifest.json     required: what the plugin is and what it uses
  commands.js       optional: the script that runs inside ncSender
  config.html       optional: the page opened from the Plugins tab
  overlay.html      optional (Pro): the floating panel page
  icon.svg          optional: .svg or .png
```

ncSender only reads the files the manifest names. `index.js` and the manifest's
`entry` field are not used.

Installed plugins live in the `plugins` folder of ncSender's data folder:

| System | Data folder |
|---|---|
| Windows | `%APPDATA%\ncSender` |
| macOS | `~/Library/Application Support/ncSender` |
| Linux and ncSenderOS | `~/.config/ncSender` |

ncSender Community and ncSender Pro share this folder.

## A complete small plugin

This plugin adds a `$HELLO` command. Type it in the console and the plugin
replaces it with a harmless comment line before it reaches the controller.

`manifest.json`

```json
{
  "id": "com.example.hello",
  "name": "Hello",
  "version": "0.1.0",
  "author": "You",
  "description": "Adds a $HELLO command.",
  "category": "utility",
  "commands": "commands.js",
  "events": ["onBeforeCommand"],
  "platforms": { "v2": "2.0.225", "pro-v2": "2.0.316" }
}
```

`commands.js`

```js
// Required in every commands.js. Receives the saved settings.
function buildInitialConfig(raw) { return raw || {}; }

// Called for every command line. Always return the array.
function onBeforeCommand(commands, context, settings) {
  var first = commands[0];
  if (first && first.isOriginal && first.command.trim().toUpperCase() === '$HELLO') {
    return [{ command: '(Hello from my plugin)', displayCommand: '$HELLO' }];
  }
  return commands;
}
```

To try it, zip the folder and install it from **Settings** > **Plugin Manager**
> **Install from a ZIP file**. See [Publishing](publishing.md) for testing and releases.

## Rules that catch most first plugins

1. **`buildInitialConfig` is required** in every `commands.js`, even if it only
   returns its argument. Without it the plugin fails to load.
2. **Write hooks as `function name() {}` declarations.** A hook written as
   `const onBeforeCommand = () => ...` is not found.
3. **`onBeforeCommand` must return the array.** Returning nothing drops the
   command. To leave a line alone, `return commands;`.
4. **The manifest needs `"pro-v2"` under `platforms`** or the plugin is not
   listed, in Community as well as Pro. Add `"v2"` too for Community.
5. **`events` decides whether `commands.js` loads at all.** With an empty
   `events` list the script never runs. Use `"background"` for a plugin that
   only needs timers or `onRequest`.
6. **The script is not a browser and not Node.** There is no `console`,
   `setTimeout`, `fetch`, `require` or `import`. Use `pluginContext.log`,
   `pluginContext.setInterval` and `pluginContext.http`.
7. **Never wait inside the script.** All plugins share one lock, and every
   command to the machine waits for it. `showDialog` and `askGate` hold it
   until the operator answers. From a timer use `showDialogAsync` or
   `showNotice`.
8. **Saving settings restarts the script.** Variables and timers reset. Keep
   state that must survive in `pluginContext.storage`.
9. **Manifest keys are case-sensitive**: `configUi`, not `configUI`.
10. **A settings page is opened from a `toolMenu` entry.** Without one the page
    cannot be reached.
