# FluidNC Setup

[FluidNC](https://github.com/bdring/FluidNC) is a WiFi-enabled CNC controller firmware based on ESP32 that ncSender fully supports.

## Connection

- **USB** — Serial connection at 115200 baud
- **WiFi** — Connect via the FluidNC WiFi interface

!!! note "Boot Sequence"
    FluidNC sends boot messages (`[MSG:INFO:...]`) during startup. ncSender suppresses these from the terminal to keep the display clean.

## Configuration

FluidNC uses YAML-based configuration files instead of numbered `$` settings. Configuration is managed through FluidNC's web interface or config file.

### Common Settings

ncSender reads FluidNC settings for:

- Axis configuration (travel limits, homing direction)
- Spindle configuration
- Probe and tool setter pin assignments
- Kinematics type

## Status Reporting

FluidNC uses the same GRBL-compatible status format. ncSender handles FluidNC-specific behaviors:

- **Homing detection** — FluidNC detects homing via Home→Idle state transition (different from grblHAL's cycle counter)
- **Pin normalization** — FluidNC uses native `Pn:P`/`Pn:T` format for probe/TLS pins

## Alarms

FluidNC alarm codes use the format `N: Description` (e.g., `1: Hard Limit`). ncSender fetches alarm descriptions via the `$A` command.

## Firmware Information

Use `$I` to get FluidNC build information, including:

- Firmware version
- Board configuration
- WiFi status
- Axis count and configuration

## Tips

!!! tip "WiFi vs USB"
    When both WiFi and USB are available, ncSender prefers WiFi (WebSocket) for communication. USB is used as a fallback.

!!! warning "ESP32 Reset"
    Some USB interfaces can trigger an ESP32 reset when connecting. ncSender handles DTR/RTS carefully to avoid this, but if you experience unexpected reboots on connect, check your USB cable and port.
