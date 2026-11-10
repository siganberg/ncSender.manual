# pluginContext

`pluginContext` is the one global ncSender gives a plugin's script. Everything
here is available in ncSender Community and ncSender Pro unless marked
**Pro**.

"Blocks" means the call holds the [plugin lock](script.md#one-lock-for-everything)
until it returns, so every command to the machine waits.

## Logging

### log(...args)

Writes a line to the ncSender log (**Settings** > **Logs**) as
`[plugin:<id>] ...`. There is no `console`.

```js
pluginContext.log('pocket', pocket, 'selected');
```

## Machine and job

### getServerState()

A snapshot from the last status report:

```js
{
  senderStatus: "idle",       // ncSender's own status text
  machineStatus: "Idle",      // the controller's state
  connected: true,
  jobStatus: null,            // or "running", "paused", ...
  tool: 3,
  mpos: { x, y, z },          // machine position
  wco:  { x, y, z },          // work coordinate offset
  line: 0,                    // program line
  feedRate: 0,
  feedOverride: 100,
  rapidOverride: 100
}
```

### getProgram()

The loaded program as the job will send it, or `null` when none is loaded:

```js
{ text: "...", lineSec: [0.4, 1.2, ...], stamp: "..." }
```

`lineSec[i]` is the estimated run time in seconds of line `i + 1`. `stamp`
changes when another program is loaded. Each call reads the file again, so
cache the result and compare `stamp`.

### getFirmwareSetting(idOrKey)

The cached value of a controller `$` setting as a number, or `null` when it is
unknown or not numeric. Accepts `"$31"`, `"31"` or `31`. Does not talk to the
controller.

### sendCommand(command, displayCommand?)

Sends one line to the controller. Does not wait and returns nothing.

!!! warning
    `sendCommand` goes straight to the controller. The line does **not** pass
    through plugins' `onBeforeCommand` or ncSender's own command checks. To
    add lines to a command that is already being sent, return them from
    `onBeforeCommand` instead.

### stopJob()

Stops the running job: stops sending, feed hold, waits for motion to stop,
then soft reset.

## Tool library

### getTools()

```js
[{ id, toolId, toolNumber, name, type, diameter }]
```

`toolId` is the T number; `toolNumber` is the slot or pocket. Either can be
null. Returns an empty array on error.

### updateToolOffset(toolNumber, patch)

Stores offsets for the tool whose T number is `toolNumber`.
`patch` is `{ tlo?, x?, y?, z? }`; keys you leave out are not changed. Returns
`true` when something was stored.

### armTlsWriteback(toolNumber)

The next `[TLO:value]` the controller reports is saved as that tool's length
offset. One shot. Call it just before emitting a tool-length probe routine.

## Timers

### setInterval(fn, ms) and clearInterval(id)

A repeating timer. The period is at least 50 ms. Returns a numeric id. The
callback runs under the plugin lock, so keep it short. Timers stop when the
plugin is reloaded or unloaded.

There is no `setTimeout`. For a one-off delay, clear the interval inside its
own callback:

```js
var id = pluginContext.setInterval(function () {
  pluginContext.clearInterval(id);
  doItOnce();
}, 2000);
```

## Dialogs and prompts

See [Pages and dialogs](ui.md) for what each one looks like and how the page
side works.

| Call | Blocks | Use for |
|---|---|---|
| `showNotice(title, message, details?)` | no | Telling the operator something was refused. `details` is `{ Label: value }`, shown as a small table. Safe inside `onBeforeCommand` |
| `askGate(options)` | **yes, until answered** | A question with buttons, shown on every screen and the pendant. Returns the chosen button's `value` |
| `showDialog(title, html, options?)` | **yes, up to 10 minutes** | A custom HTML dialog. Returns what the page sent back, or `null` |
| `showDialogAsync(title, html, options, callback?)` | no | The same dialog without waiting. Returns a dialog id; `callback(response)` runs when it is answered |
| `closeDialog(dialogId)` | no | Closes a dialog opened with `showDialogAsync` on every screen |

## Private storage

### storage.get() and storage.set(value)

One JSON value kept for the plugin, separate from its settings.

- `set` does **not** restart the script (saving settings does).
- It is not readable through the web API, so it is the place for sign-in
  tokens and other secrets. Settings are readable by any browser on the
  network.
- It survives plugin updates.
- `get()` returns `null` when nothing was stored.

```js
var state = pluginContext.storage.get() || { runs: 0 };
state.runs += 1;
pluginContext.storage.set(state);
```

## Kiosk flag

### isKiosk

`true` when ncSender runs on an ncSenderOS kiosk, `false` on a desktop.

## Web requests

Needs `"network"` in the manifest's `permissions`. Requests run in the
background; your callback gets the result.

### http.request(options, callback?)

```js
pluginContext.http.request({
  url: 'https://api.example.com/items',   // absolute http or https
  method: 'POST',                         // default GET
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
  body: JSON.stringify({ name: 'x' }),    // string only
  timeoutMs: 15000                        // default 30000 (1000 to 600000)
}, function (r) {
  if (!r.ok) { pluginContext.log('failed', r.status, r.error); return; }
  var data = JSON.parse(r.body);
});
```

The callback receives:

| Member | Meaning |
|---|---|
| `ok` | `true` for a 2xx status |
| `status` | HTTP status, `0` when the request did not complete |
| `headers` | Response headers with lower-case names |
| `body` | Response text, up to 8 MB |
| `error` | `null`, `"Timed out"`, or the failure message |

The call itself returns `false` when the options are unusable (for example a
URL that is not absolute).

### http.download(options, libraryPath, callback?)

Needs `"network"` and `"files"`. Saves a response into the G-code library.

```js
pluginContext.http.download({ url: url, headers: auth }, 'Cloud/part.nc', function (r) {
  if (r.ok) pluginContext.files.changed();
});
```

The file is replaced only after the whole download arrived. `r.size` and
`r.modified` describe the saved file.

### http.upload(libraryPath, options, callback?)

Needs `"network"` and `"files"`. Sends a library file as the request body.
`method` defaults to `PUT`.

Callbacks are dropped if the plugin was reloaded while the request ran.

## G-code library files

Needs `"files"` in the manifest's `permissions`. Paths are relative to the
G-code library (what the file manager shows), with forward slashes. Paths
that leave the library are refused.

| Member | Meaning |
|---|---|
| `files.root` | Absolute path of the library folder |
| `files.list(folder?)` | Every file under the folder, recursively: `[{ path, size, modified }]`. `modified` is milliseconds since 1970. Names starting with a dot are skipped. At most 20,000 entries |
| `files.remove(path)` | Deletes one file. Returns `true` when it was removed |
| `files.changed()` | Tells open file managers to refresh. Call it after downloads or removals |

## Wireless accessories

For plugins that drive ncSender wireless accessories through the Wireless USB
dongle.

| Member | Meaning |
|---|---|
| `dongle.send(name, payload)` | Sends a message to the accessory `name` now |
| `dongle.getDevices()` | `[{ name, connected, lastSeenMs, lastMessage }]` |
| `dongle.supportsWait` | `true` when ncSender understands `(DONGLE_WAIT:...)` lines |

To act at an exact point in a program, emit a `(DONGLE:name:payload)` line from
`onBeforeCommand` instead of calling `dongle.send`.

## Floating panel (Pro)

`pluginContext.overlay` exists only in ncSender Pro. Guard for it:

```js
if (pluginContext.overlay) {
  pluginContext.overlay.set({ summary: '00:12:40' });
}
```

| Member | Meaning |
|---|---|
| `overlay.set({ summary?, opacity?, shape? })` | Chip text, see-through level (0.5 to 1), frameless outline. Only the keys given change |
| `overlay.show()` | Shows the panel, also after the operator closed it |
| `overlay.hide()` | Takes it off every screen |

See [Floating panels](panels.md).

## What is not there

- No call reads or writes ncSender's own settings.
- The script cannot save its own settings; only a page can (through the
  settings API). Use `storage` for anything the script needs to remember.
- No call reads arbitrary files from disk.
