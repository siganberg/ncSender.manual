# Software Updates

ncSender checks for new releases and shows an **Update** pill in the header
when one is available. Click it — or open **Settings → Software Update** —
to see what's new, read the release notes, and install.

## Checking for updates

The dialog shows three things: the version you're running, the newest
release on your channel, and when it was published. **Check Again** asks
GitHub for the latest release straight away.

**Version History** lists every release on your channel. The newest is
selected by default, but you can pick any version — the main button installs
whichever one is selected, so this is also how you roll back.

## Channels

| Channel | What you get |
|---|---|
| **Stable** | Tested releases. The default. |
| **Development** | Beta builds, published ahead of stable for early feedback. Expect rough edges. |

Switch channels from the link under the dialog title. Switching to
Development shows the beta releases; switching back hides them again.

## Installing in-app

!!! info "Pro Feature"
    Installing an update **from inside the app** is available in **ncSender
    Pro**. The Community edition still checks for updates and shows the
    release notes, but you download and install the new version yourself.

Click **Download Update**. ncSender downloads the release for your platform,
then installs it and restarts itself. What you see during the restart depends
on the platform:

=== "Windows"

    The app closes and a small **"Updating ncSender"** window stays on screen
    while the installer replaces the files — typically 15–25 seconds. The app
    reopens by itself when it's done. No prompts, no elevation: ncSender
    installs per-user, so it never asks for administrator rights.

=== "macOS"

    The app quits, the new version is copied into place, and the app reopens
    — usually within a few seconds.

    You do **not** need to run `xattr -c` after an in-app update. That command
    is only needed on a fresh install because the browser marks downloaded
    apps as quarantined. Updates are downloaded by ncSender itself, so nothing
    marks them, and the new version launches straight away.

=== "Linux"

    The `.deb` package is installed with `dpkg` and the app relaunches.
    On a Debian-based system that isn't running as root, you may be prompted
    for your password.

    On the **Raspberry Pi 5 / ncSender OS image**, the whole system reboots
    after an update rather than just relaunching the app — the boot logo
    covers the gap.

## Where the files come from

Releases are published on GitHub. The updater downloads only the asset for
your platform and architecture — it never fetches other builds — and the
download goes into your temporary folder, which is cleaned up once the
update has installed.

## If an update fails

An interrupted or failed update leaves your current version untouched: on
Windows and macOS the new files are only swapped in once they're complete,
and on Linux `dpkg` won't replace a working package with a broken one. Just
run the update again.

- **Windows** — if you see *"cannot access the file because it is being used
  by another process"*, another program (usually antivirus) is still scanning
  the downloaded installer. Wait a few seconds and click Download Update again.
- **macOS** — the update log is at `$TMPDIR/ncsender-update.log` if you need
  to see what happened.
- **Upgrading from 0.3.x** — the updater does not cross that boundary; see
  the [FAQ](../faq.md#upgrading-from-03x-to-20x).
