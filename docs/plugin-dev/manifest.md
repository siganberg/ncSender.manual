# manifest.json

Every plugin has a `manifest.json` at the top of its folder. Keys are
case-sensitive and written in camelCase. Unknown keys are ignored. Comments and
trailing commas are not allowed.

## Example

```json
{
  "id": "com.example.myplugin",
  "name": "My Plugin",
  "version": "1.2.0",
  "author": "You",
  "description": "One or two sentences shown in Plugin Manager.",
  "category": "utility",
  "icon": "icon.svg",
  "repository": "https://github.com/you/ncsender-plugin-myplugin",
  "minAppVersion": "2.0.225",
  "platforms": { "v2": "2.0.225", "pro-v2": "2.0.316" },
  "commands": "commands.js",
  "configUi": "config.html",
  "events": ["onBeforeCommand", "onGcodeProgramLoad"],
  "permissions": ["network", "files"],
  "priority": 60,
  "toolMenu": [
    { "id": "open-config", "label": "My Plugin", "icon": "icon.svg" }
  ]
}
```

## Fields

| Key | Type | What it does |
|---|---|---|
| `id` | string | Required. The folder name, the settings folder name and the id in every API path. Use reverse-domain style: `com.yourname.pluginname`. The part after the last `.` is the name used in `(MSG, PLUGIN_<NAME>:<CODE>)` prompts. |
| `name` | string | Display name. |
| `version` | string | Dotted numbers, for example `1.2.0`. Compared with your release tag to offer updates. |
| `author` | string | Display. |
| `description` | string | Display. |
| `category` | string | `utility`, `gcode-generator` or `tool-changer`. Other values are shown as written. See [Tool changers](#tool-changers). |
| `icon` | string | `.svg` or `.png` file in the plugin folder. |
| `repository` | string | `https://github.com/owner/repo`. Needed for update checks and for the registry. |
| `minAppVersion` | string | Oldest ncSender version the plugin installs on. Checked at install only. |
| `platforms` | object | See [platforms](#platforms). |
| `commands` | string | The script file, normally `commands.js`. |
| `configUi` | string | The page opened from the Plugins tab, normally `config.html`. |
| `events` | string array | See [events](#events). |
| `permissions` | string array | See [permissions](#permissions). |
| `priority` | number | Run order for `onBeforeCommand` and the job, tool-change and error hooks. Lower runs first. |
| `toolMenu` | array | Buttons on the **Plugins** tab. See [toolMenu](#toolmenu). |
| `messages` | object | Prompts your G-code can open. See [Pages and dialogs](ui.md#prompts-from-g-code-messages). |
| `overlay` | object | Pro only. A floating panel. See [Floating panels](panels.md). |

## platforms

```json
"platforms": { "v2": "2.0.225", "pro-v2": "2.0.316" }
```

- `pro-v2` is **required**. A plugin without it is not listed, in Community as
  well as Pro.
- `v2` is the oldest ncSender Community version the plugin works on.
- `pro-v2` is the oldest ncSender Pro version it works on.
- Values must be strings.

The app compares these with its own version in the plugin browser and disables
**Install** when the app is too old.

## events

`events` controls whether your script is loaded.

`commands.js` is loaded only when `commands` is set **and** `events` contains at
least one of these exact strings:

| Value | Meaning |
|---|---|
| `onBeforeCommand` | The plugin changes commands. It also becomes a plugin that must be running: if it is enabled but failed to load, ncSender refuses to start jobs and tool changes until it is fixed. |
| `onGcodeProgramLoad` | Required for `onGcodeProgramLoad` to be called. Also makes the plugin one that must be running. |
| `onAfterJobEnd` | Loads the script. |
| `onToolChangeStart` | Loads the script. |
| `onToolChangeEnd` | Loads the script. |
| `onControllerError` | Loads the script. |
| `background` | Loads the script. Use it when the plugin only needs timers or `onRequest`. |

Except for `onGcodeProgramLoad`, the hooks are called on every loaded plugin
that defines the function, whether or not the value is listed. List the ones
you use anyway: it documents the plugin and gives `onBeforeCommand` plugins
the must-be-running protection.

A plugin with no `events` is a page-only plugin: its `configUi` page works and
its script never runs.

## permissions

| Value | Adds |
|---|---|
| `network` | `pluginContext.http.request` |
| `files` | `pluginContext.files` |
| `network` and `files` | also `pluginContext.http.download` and `pluginContext.http.upload` |

Without the permission the object is simply missing from `pluginContext`.

## toolMenu

Each entry is a button on the **Plugins** tab in the console area.

```json
"toolMenu": [
  { "id": "open-config", "label": "My Plugin", "icon": "icon.svg" }
]
```

| Key | Meaning |
|---|---|
| `id` | A name for the entry. `show-overlay` is special (Pro): it brings the plugin's floating panel back. |
| `label` | The button text. Must be unique within the plugin. |
| `icon` | A file in the plugin folder, or inline SVG markup starting with `<`. A gear is shown when empty. |

- Pressing a button opens the plugin's `configUi` page as a dialog. There is no
  way to run script code directly from a button; put the action in the page.
- With several entries, the page can tell which one was pressed from the
  `__TOOL_MENU_LABEL__` placeholder.
- The Plugins tab is locked while the machine is not idle.
- Each entry is also offered as an action in **Settings** > **Controls**, so the
  operator can bind it to a key or gamepad button.

## Tool changers

`tool-changer` is an exclusive category: enabling one tool-changer plugin
disables the others, and a new one installs disabled when another is enabled.

ncSender also reads a tool changer's saved settings to configure its own tool
features. The setting names below are **reserved**. Do not use them in a
plugin that is not a tool changer:

| Setting | Effect |
|---|---|
| `pockets` or `slots` (number) | Number of tools shown in ncSender |
| `numberOfTools`, `autoSwap` | Manual tool change: tool count is used only when `autoSwap` is true |
| `toolSensor` (string containing `TLS` or `Probe`), or `tlsMode` | Tool length sensor available |
| `probe: { enabled, toolNumber }`, `addProbe` | A probe is one of the tools |

Two more settings are read for [prompts from G-code](ui.md#prompts-from-g-code-messages):
`abortEventGcode` and `dialogBehavior`.
