# Troubleshooting

## Connection Issues

### Controller Not Detected

- Ensure the USB cable supports data (not charge-only)
- Check that the correct drivers are installed for your board's USB chip (CH340, CP2102, etc.)
- Try a different USB port
- On macOS, you may need to allow the serial device in System Preferences > Security

### Wrong Device Connected

ncSender automatically filters out:

- Bluetooth ports
- Debug console ports
- DJI controller ports
- ESP-NOW pendant/dongle ports

If your controller is being skipped, check **Settings > Connection** and manually select the port.

### FluidNC Boot Messages

If you see a flood of `[MSG:INFO:...]` messages when connecting to FluidNC, ensure you're running ncSender v2.0.68 or later which properly handles the boot sequence.

## Visualizer Issues

### G-Code Not Rendering

- Ensure the file is valid G-code
- Very large files (>1M lines) may take time to parse
- Check the console for parsing errors

### Toolpath Disappears After Zeroing

This was fixed in v2.0.68. Update to the latest version.

## Plugin Issues

### Tool Buttons Disappear After Installing a Plugin

This was fixed in v2.0.74. The issue was caused by the plugin installer overwriting tool-changer settings for non-tool-changer plugins. Update to the latest version.

## Performance

### Slow UI on Linux

- Ensure hardware acceleration is enabled
- For Raspberry Pi / ARM64, use the ncSenderProOS image for best performance
- On Wayland, ncSender uses native Wayland support automatically

## Getting Help

- [GitHub Issues](https://github.com/siganberg/ncSender/issues) — Report bugs
- [Discord](https://discord.gg/ncsender) — Community support
