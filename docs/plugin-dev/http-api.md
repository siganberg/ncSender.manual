# HTTP API

ncSender serves an HTTP API on its own port (normally `8090`). A plugin's page
or floating panel calls it with `fetch`. Paths below are relative to
ncSender's address; from a plugin page use them as they are
(`fetch('/api/...')`).

Requests and responses are JSON with camelCase names unless noted.

## Your plugin

`<id>` is the plugin id from the manifest.

| Method and path | Body | Response |
|---|---|---|
| GET `/api/plugins/<id>/settings` | | The saved settings object, `{}` when none |
| PUT `/api/plugins/<id>/settings` | The whole settings object | `{ "success": true }`. Replaces what was saved and restarts the plugin's script |
| POST `/api/plugins/<id>/request` | Any JSON | Whatever the script's `onRequest(payload)` returned. 404 when the script is not running or has no `onRequest`; 400 with `{ "error" }` when it threw |
| GET `/api/plugins/<id>/icon` | | The manifest icon |
| GET `/api/plugins/<id>/icon?file=<path>` | | Any file inside the plugin folder. `.svg` and `.png` get an image type; everything else is served as a download, so fetch scripts as text and run them yourself |

!!! note "Settings are not private"
    Any browser that can reach ncSender can read a plugin's settings. Keep
    passwords and tokens in [`pluginContext.storage`](plugin-context.md#private-storage),
    which is not served.

## App information

| Method and path | Response |
|---|---|
| GET `/api/app-info` | `{ "edition": "pro" \| "community", "kiosk": true \| false }` |
| GET `/api/server-state` | The full machine and job state (the same object a page receives as `server-state-update`) |
| GET `/api/settings` | All app settings |
| GET `/api/settings/<name>` | `{ "key", "value" }` for one setting |
| GET `/api/firmware` | The controller's cached `$` settings |

## Sending commands

### POST /api/send-command

```json
{ "command": "G0 X10", "meta": { "sourceId": "plugin:com.example.myplugin" } }
```

The command goes through every plugin's `onBeforeCommand` and ncSender's own
checks, exactly like a line typed in the console.

| Request key | Meaning |
|---|---|
| `command` | Required. `0x18`-style text sends that single byte (real-time commands) |
| `meta.silent` | Do not show it in the terminal |
| `meta.quiet` | `{ terminalCommand, terminalResponse, logCommand, logResponse }` booleans to keep parts of it out of the terminal or log. The controller's reply still reaches your page as `cnc-data` |

Response (HTTP 200):

| Shape | Meaning |
|---|---|
| `{ "status": "success", "id", "command" }` | Sent and acknowledged |
| `{ "status": "error", "errorMessage" }` | The controller answered with an error |
| `{ "status": "skipped", "reason" }` | ncSender refused to send it |

## G-code files

| Method and path | Body | Response |
|---|---|---|
| POST `/api/gcode-files/load-temp` | `{ "filename", "content" }` | `{ "success": true }`. Loads G-code your page generated as the current program, without saving it to the library |
| POST `/api/gcode-files/file/save` | `{ "path", "content" }` | `{ "success": true }`. Saves into the library |
| POST `/api/gcode-files/load` | `{ "path" }` | `{ "success": true }`. Loads a library file as the current program |
| GET `/api/gcode-files` | | The library as a tree |
| GET `/api/gcode-files/file?path=<path>` | | `{ "content" }` |
| GET `/api/gcode-files/current/download` | | The loaded program as text, after plugins changed it |

Loading a program runs every plugin's `onGcodeProgramLoad`.

## Tools

| Method and path | Response |
|---|---|
| GET `/api/tools` | The tool library |
| GET `/api/tools/active` | The tools as tool changes use them |

## Keepout zones a plugin owns

A plugin can keep one keepout zone of its own, for example around a tool rack.

| Method and path | Body | Response |
|---|---|---|
| PUT `/api/keepout/managed/<id>` | `{ "minX", "minY", "maxX", "maxY", "name"?, "enabled"? }` | The zone. Creates or updates it |
| DELETE `/api/keepout/managed/<id>` | | Removes it |

## Wireless accessories

| Method and path | Body | Response |
|---|---|---|
| GET `/api/dongle/devices` | | The accessories the dongle knows |
| POST `/api/dongle/devices/<name>/send` | `{ "payload" }` | `{ "success": true }` |

## Floating panels (Pro)

| Method and path | Response |
|---|---|
| GET `/api/plugins/<id>/overlay-ui` | The panel page, with `__PLUGIN_ID__` and `__SERVER_PORT__` filled in. ncSender loads this itself; listed for completeness |

## Calling from outside ncSender

The same API is reachable from other programs on the network at
`http://<ncsender-address>:8090`. It has no sign-in, so treat it like the
machine itself: only on a network you trust.
