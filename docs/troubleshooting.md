# Troubleshooting

## Connection Issues

### Controller Not Detected

- Ensure the USB cable supports data (not charge-only)
- Check that the correct drivers are installed for your board's USB chip (CH340, CP2102, etc.)
- Try a different USB port
- On macOS, you may need to allow the serial device in System Preferences > Security
- On Windows with an SLB-EXT, choose the **STM32** entry in the port list
- If the port appears but connecting does nothing, power-cycle the controller,
  reseat the cable, and connect again — a controller left in a bad state
  answers nothing until it is reset

### Wrong Device Connected

ncSender automatically filters out:

- Bluetooth ports
- Debug console ports
- DJI controller ports
- ESP-NOW pendant/dongle ports

If your controller is being skipped, check **Settings > Connection** and manually select the port.

### FluidNC Boot Messages

If you see a flood of `[MSG:INFO:...]` messages when connecting to FluidNC, ensure you're running ncSender v2.0.68 or later which properly handles the boot sequence.

## Probing and Tool Setting

### Probe or Tool Setter Shows No Signal

The probe has continuity and its own LED lights when touched, but ncSender's
probe/pin indicators never change.

- **Invert the input.** Many controllers wire probe and tool setter active-low.
  Invert the probe / TLS input in settings, then **reboot the controller** — the
  change is read at start-up. When an input is inverted correctly the pin
  indicator sits green while nothing is touching it.
- **Check the controller's own probe settings**, `$6` (invert probe pin) and
  `$10` (status report mask). These are firmware settings and ncSender only
  reads them.
- **After swapping a controller, re-apply your probe and VFD settings.** A
  replacement board comes with defaults, and a probe that worked last week
  stops being seen with no visible change on the machine.

### Probe or TLS Indicators Flicker While the Spindle Runs

Indicators flash only when the spindle is running, jobs stall part-way through
with the router still turning, or the connection drops mid-cut.

This is electrical noise, not a software fault. The probe input is high
impedance and the spindle and VFD are the loudest things on the machine.

- **Check what the probe wire is touching.** A probe body or wire grounded to
  the machine frame turns the whole frame into part of the probe circuit. One
  machine's stalls stopped entirely once the touch probe was isolated from the
  chassis.
- **Fit ferrite chokes** on the spindle and VFD cabling.
- **Move the control computer away** from the VFD and the spindle cable.
- **Prefer Ethernet over USB.** USB is markedly more susceptible; several
  machines that drop USB the moment the spindle spins up run without fault over
  Ethernet.

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

### The Display Falls Behind, Then Catches Up in Bursts

The DRO and visualizer lag several seconds behind the machine, queue up what
they missed, then catch up — while the job itself cuts correctly.

- **Check the temperature first.** A fanless mini PC or single-board computer
  that is thermally throttling behaves exactly like this, and the symptom
  follows the ambient temperature of the shop. Adding even a small fan has
  resolved it.
- **Compare against a second view.** Open ncSender from a phone or laptop
  against the same machine. If the remote view keeps up and only the local
  display lags, the problem is local rendering, not the connection or the
  controller.
- **Check GPU acceleration on non-standard hardware.** The prebuilt OS images
  are built and tested for the Raspberry Pi 5 and gControl. On other mini PCs
  the GPU may not be driven, leaving the rendering to the CPU.

## Getting Help

- [GitHub Issues](https://github.com/siganberg/ncSender/issues) — Report bugs
- [Discord](https://discord.gg/3U5Jx2q2wZ) — Community support
