# CAM Integration

Any CAM or post-processing tool can send a finished program straight to
ncSender and have it load, ready to run, without saving a file and opening it
by hand. ncSender exposes a small HTTP API on the computer it runs on, and
the whole integration is a single request.

This page is written for CAM developers and for anyone scripting their own
"send to machine" step.

## What ncSender accepts

Plain-text G-code for grbl-based controllers (grblHAL, FluidNC). Any file
extension works; `.nc`, `.gcode`, `.ngc` and `.tap` are the usual ones. The
file is stored in the user's G-code library and becomes the active program
immediately, exactly as if it had been opened from the file dialog.

## The request

ncSender listens on port **8090** by default. Send the program as a
`multipart/form-data` upload:

```
POST http://<ncsender-host>:8090/api/gcode-files
Content-Type: multipart/form-data
```

| Field | Required | Meaning |
|---|---|---|
| `file` | yes | The G-code file. The filename you give is what the user sees in ncSender. |
| `folder` | no | A subfolder in the user's G-code library to store it in, for example `MillMage`. Created if needed. |

On success the response is:

```json
{ "success": true, "path": "MillMage/part-01.nc" }
```

and the program is loaded in ncSender. A file above the size limit (200 MB
by default) is refused with HTTP 413 and a JSON `error` message.

`<ncsender-host>` is `localhost` when CAM and ncSender run on the same
computer. When ncSender runs on a machine-side computer, use that computer's
hostname or IP address on the local network.

## Examples

=== "curl"

    ```bash
    curl -F "file=@part-01.nc" -F "folder=MillMage" http://localhost:8090/api/gcode-files
    ```

=== "Python"

    ```python
    import requests

    with open("part-01.nc", "rb") as f:
        r = requests.post(
            "http://localhost:8090/api/gcode-files",
            files={"file": ("part-01.nc", f)},
            data={"folder": "MillMage"},
            timeout=30,
        )
    r.raise_for_status()
    print(r.json()["path"])
    ```

=== "PowerShell"

    ```powershell
    Invoke-RestMethod -Uri "http://localhost:8090/api/gcode-files" -Method Post `
      -Form @{ file = Get-Item "part-01.nc"; folder = "MillMage" }
    ```

=== "C#"

    ```csharp
    using var http = new HttpClient();
    using var form = new MultipartFormDataContent();
    form.Add(new StreamContent(File.OpenRead("part-01.nc")), "file", "part-01.nc");
    form.Add(new StringContent("MillMage"), "folder");
    var response = await http.PostAsync("http://localhost:8090/api/gcode-files", form);
    response.EnsureSuccessStatusCode();
    ```

## What to put in a CAM "Send to ncSender" feature

Three settings cover every setup:

- **Host** — default `localhost`
- **Port** — default `8090`
- **Folder** — optional, a good default is the CAM product's name

Then a button or menu item next to the existing export that posts the file
the post-processor just wrote. Show the returned `path` or a short "Sent to
ncSender" confirmation, and surface the `error` text from a non-2xx reply.

!!! tip "Checking that ncSender is reachable"
    `GET http://<host>:8090/api/health` returns HTTP 200 when ncSender is
    running. Useful for greying out the button or giving a clear "ncSender is
    not running" message instead of a connection error.

## Notes

- The port is set in **Settings → General → Remote Control Port** on the
  ncSender computer. A CAM "Port" setting must match it. See
  [Remote Access](../settings/remote-access.md).
- Uploads work even when **Allow Remote Control** is off. Remote clients can
  always manage files.
- A sent program goes through the same plugin transforms as a file opened
  by hand.

- One request loads one program. Sending another file replaces the loaded
  program, which is the normal "post again after a change" workflow.
- ncSender never starts a job on its own. The operator still presses Cycle
  Start on the machine side, so sending a program is always safe.
- The stored copy lives in the user's G-code library under the folder you
  chose, so previously sent programs stay available in ncSender's file
  browser.
