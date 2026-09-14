# FluidNC Setup

[FluidNC](https://github.com/bdring/FluidNC) is an ESP32-based CNC controller firmware with WiFi. ncSender can connect to it and run jobs, but some ncSender features only work with grblHAL (see [Not Available on FluidNC](#not-available-on-fluidnc)).

## Connection

Set up the connection in **Settings → General → CNC Connection Setup**.

- **USB**: pick the serial port and 115200 baud.
- **WiFi**: pick **Ethernet** as the connection type and enter the board's **IP address**. Then pick a **Protocol**: **Telnet** (port 23) or **WebSocket** (port 81).

<!-- CAPTURE NEEDED: assets/images/controllers/fluidnc-connection.webp (FluidNC WebSocket connection) -->

ncSender uses the one connection you save. If the controller reboots, ncSender reconnects by itself.

## Configuration

FluidNC stores its settings in a YAML config file instead of numbered `$` settings. Edit it in **Settings → Config**:

1. Open **Settings → Config**. **Controller Config** loads from the board. Click **Refresh** to load it again.
2. Change the values you need. **Unsaved changes** shows until you save.
3. Click **Save to Controller**.
4. Restart the controller to apply the changes.

<!-- CAPTURE NEEDED: assets/images/controllers/fluidnc-config-tab.webp (FluidNC Config tab) -->

## Status Reporting

FluidNC uses the same GRBL-style status format. ncSender handles a few FluidNC differences:

- **Homing**: ncSender never shows **Homing Required** for FluidNC. Homing is up to you.
- **Work position**: FluidNC status reports leave out the work offset, so ncSender works it out itself. The DRO still shows the right work position.
- **Spindle speed**: the RPM shown is the measured speed, and it winds down smoothly after `M5`.
- **Pins**: probe and tool setter pins are read from FluidNC's own format.

## Alarms

FluidNC alarm codes use the format `N: Description` (for example `1: Hard Limit`). ncSender fetches alarm descriptions with the `$A` command.

## Firmware Information

Send `$I` to get FluidNC build information, including:

- Firmware version
- Board configuration
- WiFi status
- Axis count and configuration

## Not Available on FluidNC

- **Firmware** settings table. Use the **Config** tab instead.
- **Machine Setup Wizard**. It sets grblHAL settings only.
- **Calibration** guides. FluidNC keeps steps/mm in its config file, which the guides can't edit yet.

## Tips

!!! warning "ESP32 Reset"
    Some USB connections can reset the ESP32 when ncSender connects. ncSender handles DTR/RTS carefully to avoid this. If the board still reboots on connect, use the USB cable and port recommended for your board.
