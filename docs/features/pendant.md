# Pendant

The ncSender pendant is a wireless handheld controller for your CNC machine, connected via ESP-NOW wireless protocol through a USB dongle.

## Hardware

<!-- TODO: Photo of pendant and dongle hardware -->
![Pendant and dongle](../assets/images/features/pendant-hardware.png){ .placeholder }

- **Pendant** — ESP32-based handheld with LCD display, jog wheel, and buttons
- **Dongle** — ESP32-S3 USB stick (LilyGO T-Dongle-S3) that plugs into the host computer

## Features

- Real-time DRO (position display)
- Jog wheel for precise positioning
- Feed rate and spindle override
- Start/Pause/Stop job controls
- Tool change confirmation
- Zero X, Y, Z axes
- Home machine

## Connection

<!-- TODO: GIF/WebP animation showing pendant powering on and connecting -->
![Pendant connection](../assets/images/features/pendant-connecting.webp){ .placeholder }

The pendant connects wirelessly via ESP-NOW protocol:

1. Plug the USB dongle into the host computer
2. Power on the pendant
3. The pendant and dongle pair automatically
4. ncSender detects the dongle and begins communication

!!! tip "WiFi Channel Sync"
    The pendant automatically discovers and syncs the WiFi channel with the dongle on first connection. Subsequent boots use the stored channel for instant connection.

## Pendant Display

<!-- TODO: Screenshot/photo of pendant LCD showing DRO, status, overrides -->
![Pendant display](../assets/images/features/pendant-display.png){ .placeholder }

The pendant LCD shows:

- Machine status (Idle, Run, Hold, Alarm)
- X, Y, Z coordinates (work position)
- Active workspace (G54-G59)
- Feed rate and spindle overrides
- Job progress during program execution

## Communication Protocol

The pendant uses a compact DRO format for efficient data transfer over ESP-NOW's 250-byte packet limit:

- **Full DRO** (`$!` prefix) — All machine state fields
- **Delta DRO** (`$` prefix) — Only changed fields

The host pushes DRO updates every second, ensuring the pendant always shows current state.
