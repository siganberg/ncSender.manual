# Troubleshooting

## Connection Issues

### Status Shows Setup Required

No connection has been saved yet. Run the wizard from **Settings → General →
Run setup wizard**, or open **Settings → General → CNC Connection Setup**,
choose the connection and click **Save & connect**. See
[First Connection](getting-started/first-connection.md).

<!-- CAPTURE NEEDED: assets/images/getting-started/troubleshooting-setup-required.webp (Setup Required status) -->

### Controller Not Detected

- Ensure the USB cable supports data (not charge-only)
- Check that the correct drivers are installed for your board's USB chip (CH340, CP2102, etc.)
- Try a different USB port
- Pick the port by name: **Settings → General → CNC Connection Setup → Serial port**

### Wrong Device Connected, or Board Skipped

**Auto-detect** only tries ports that look like a CNC controller. It skips:

- Bluetooth ports
- Debug console ports
- DJI controller ports
- ncSender Accessories (pendant, Wireless USB)
- Ports whose USB chip does not look like a CNC board

If your controller is skipped, open **Settings → General → CNC Connection
Setup** and pick its port by name under **Serial port**.

### Alarm on Connect, or Unlock Keeps Retrying

The controller is in an alarm and refuses to unlock while the cause is still
active. See the FAQ:

- [My machine shows an alarm right after power-on](faq.md#my-machine-shows-an-alarm-right-after-power-on)
- [Unlock does nothing](faq.md#unlock-does-nothing)

## Visualizer Issues

### G-Code Not Rendering

- Ensure the file is valid G-code
- Very large files (>1M lines) may take time to parse
- Check the **Terminal** for parsing errors

## Accessories

Pendant or Wireless USB not found, not activated, or needs a firmware update:
open **Accessories** from the toolbar. See
[Wireless USB](accessories/wireless-usb.md) and
[Pendant](accessories/pendant.md).

## Updates

An update did not install, or Windows blocked the installer: see
[If an Update Fails](getting-started/software-updates.md#if-an-update-fails).
Many older problems are already fixed, so update to the latest version first.

## Performance

### Slow UI on Linux

- See [The display falls behind, then catches up in bursts](faq.md#the-display-falls-behind-then-catches-up-in-bursts)
- For Raspberry Pi 5, use the ncSender OS image (Pro) for best performance
- On Wayland, ncSender uses native Wayland support automatically

## Getting Help

- [GitHub Issues](https://github.com/siganberg/ncSender/issues): report Community edition bugs
- [Discord](https://discord.gg/3U5Jx2q2wZ): support for both editions
- Pro users: [support@franciscreation.com](mailto:support@franciscreation.com)
