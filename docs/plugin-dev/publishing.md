# Testing and publishing

## Test on your own machine

1. Zip the plugin folder (`manifest.json` at the top of the zip, or one folder
   deep).
2. In ncSender open **Settings** > **Plugin Manager** > **Install from a ZIP
   file** and pick the zip.
3. Enable the plugin if it is not already on.

Installing again over an existing plugin replaces its folder and keeps its
settings and its on/off state.

For quick edits you can also change the files directly in the installed
folder (see [the plugin folder](index.md#the-plugin-folder)):

- Page changes (`config.html`, `overlay.html`) show the next time the page is
  opened.
- Script changes need the script to restart: switch the plugin off and on in
  Plugin Manager.
- A plugin folder you copy in by hand, rather than install, shows up in
  Plugin Manager switched off. Switch it on there to load its script.

### When it does not work

| What you see | Likely cause |
|---|---|
| The plugin is not in Plugin Manager | `platforms` has no `"pro-v2"` key, or `manifest.json` is not valid JSON |
| "needs ncSender x.y.z or newer" at install | `minAppVersion` is higher than the app |
| The plugin shows a failed state | The script threw while loading. The message is shown; the most common cause is a missing `buildInitialConfig` |
| A hook is never called | It is not a `function` declaration, or `events` has no value that loads the script |
| Commands disappear | `onBeforeCommand` did not return the array |
| `pluginContext.http` is undefined | `"network"` is missing from `permissions` |
| Page requests answer 404 on `/request` | The script is not running, or has no `onRequest` |
| My buttons look wrong in the dialog | ncSender's button style won; use an id selector ([details](ui.md#the-page-is-part-of-the-app-not-a-frame)) |
| Jobs refuse to start, naming the plugin | The plugin lists `onBeforeCommand` or `onGcodeProgramLoad` but failed to load |

`pluginContext.log(...)` lines and load errors are in **Settings** > **Logs**.

## Release it on GitHub

ncSender installs and updates plugins from GitHub releases.

1. Put the plugin in a public GitHub repository and set `repository` in the
   manifest to its URL.
2. For each version: set `version` in the manifest, then publish a GitHub
   release whose tag is that version (`1.2.0` or `v1.2.0`).
3. Attach a `.zip` of the plugin to the release. The first `.zip` asset is the
   one ncSender downloads.

ncSender offers an update when the newest release tag is higher than the
installed `version`. Pre-releases are offered only to users on the beta
update channel.

An update replaces the plugin folder. Nothing your plugin wrote inside its own
folder survives; settings and `pluginContext.storage` do.

## List it in the plugin browser

The **Browse** tab of Plugin Manager shows the plugins in the public registry:
[siganberg/ncSender.plugins-registry](https://github.com/siganberg/ncSender.plugins-registry).
To add yours, open a pull request that adds an entry to `plugins.json`:

```json
{
  "id": "com.example.myplugin",
  "name": "My Plugin",
  "description": "What it does, in a sentence or two.",
  "author": "You",
  "category": "utility",
  "version": "1.2.0",
  "repository": "https://github.com/you/ncsender-plugin-myplugin",
  "iconUrl": "https://raw.githubusercontent.com/you/ncsender-plugin-myplugin/main/icon.png",
  "platforms": { "v2": "2.0.225", "pro-v2": "2.0.316" }
}
```

| Key | Meaning |
|---|---|
| `id` | Must match the manifest |
| `name` | Ending it with `(Beta)` marks the entry as beta |
| `category` | `utility`, `gcode-generator` or `tool-changer` |
| `version` | The newest released version |
| `repository` | Where **Install** gets the latest release from |
| `platforms` | `pro-v2` is required for the entry to be listed. Each value is the oldest app version that can install it; add `v2` for Community |

Update `version` in the registry when you release, so the browser shows the
right number.

## Version support

| Feature | Community | Pro |
|---|---|---|
| Hooks, dialogs, prompts, timers, tool library, `sendCommand` | yes | yes |
| `pluginContext.http`, `files`, `storage`, `isKiosk`, `onRequest` | 2.0.225 | 2.0.316 |
| Floating panels (`overlay`) | no | 2.0.317 |

Set `minAppVersion` and `platforms` to the oldest version that has everything
your plugin uses. To support older apps as well, check before you call:

```js
if (pluginContext.http) { /* web requests available */ }
if (pluginContext.overlay) { /* Pro with floating panels */ }
```
