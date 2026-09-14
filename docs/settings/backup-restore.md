# Backup & Restore

Save your ncSender setup to one file, and restore it on the same or a new computer. Open **Settings → Backup**.

## Make a Backup

1. Open **Settings → Backup**.
2. Tick any extras you want (see below).
3. Click **Download Backup**. On a kiosk, click **Save Backup** and pick an external drive.

<!-- CAPTURE NEEDED: assets/images/settings/backup-tab.webp (Backup tab) -->

You get one `.ncsbackup` file. Make one before a big upgrade or moving to a new computer.

## What's in It

Every backup includes:

- App settings
- Tool library
- Macros
- Installed plugin list
- Plugin configuration

Optional extras:

| Option | Notes |
|---|---|
| **Include installed plugin code** | Not needed usually. Plugins can be reinstalled from the catalog. |
| **Include command history** | History usually stays with the machine. |
| **Include G-code files** | Your file library can be many GBs. |

## Restore

1. Open **Settings → Backup** on the computer you want to restore to.
2. Click **Choose Backup File…**. On a kiosk, click **Choose Backup from USB…** and pick the file from the drive.
3. Click **Restore**.
4. In **Restore backup?**, confirm. Matching settings on this computer are replaced. This can't be undone from inside ncSender.

<!-- CAPTURE NEEDED: assets/images/settings/backup-restore-confirm.webp (Restore backup confirmation) -->

<!-- CAPTURE NEEDED: assets/images/settings/backup-usb-picker.webp (Choosing a backup from USB) -->

## After Restoring

**Restore complete** lists what was restored.

<!-- CAPTURE NEEDED: assets/images/settings/backup-restore-complete.webp (Restore complete) -->

Some restored settings only take effect after you restart ncSender. Restart it to be sure.

## Firmware Settings Are Separate

Backups don't include your controller's firmware settings. They live on the controller, not in ncSender. Use **Export** in [Firmware Settings](firmware.md#import-and-export-settings) to keep a copy.
