# Rapid Change ATC

!!! info "Pro Feature"
    Automatic tool changer plugins require **ncSender Pro**.

Automatic tool changer support for the Rapid Change ATC system.

## Features

- Automatic tool change sequences (load, unload, probe)
- Configurable pocket positions and tool setter location
- Pre/post tool change G-code events
- Probe integration for tool length measurement
- Support for multiple collet sizes (ER20, etc.)

## Configuration

Configure pocket positions, spindle speeds, plunge depths, and safety heights through the plugin settings dialog.

## Tool Change Sequence

1. Retract to safe Z
2. Move to current tool pocket
3. Execute unload sequence (counter-rotation + retract)
4. Move to new tool pocket
5. Execute load sequence (rotation + plunge)
6. Move to tool length setter
7. Probe tool length
8. Resume program
