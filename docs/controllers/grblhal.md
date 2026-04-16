# grblHAL Setup

[grblHAL](https://github.com/grblHAL) is a high-performance CNC controller firmware that ncSender fully supports.

## Connection

- **USB** — Standard serial connection at 115200 baud
- **Ethernet** — TCP or WebSocket connection (if your board supports networking)

grblHAL boards typically use DTR for USB CDC communication. ncSender handles this automatically.

## Firmware Settings

Access firmware settings through the console:

- `$$` — List all settings
- `$<number>=<value>` — Set a specific value (e.g., `$110=5000`)
- `$help` — Show available commands

### Key Settings

| Setting | Description | Example |
|---------|-------------|---------|
| `$22` | Homing enable | 1 (enabled) |
| `$32` | Laser mode | 1 (laser), 0 (normal) |
| `$110-$112` | Max feed rate (X/Y/Z) | 5000 mm/min |
| `$120-$122` | Acceleration (X/Y/Z) | 500 mm/sec^2 |
| `$130-$132` | Max travel (X/Y/Z) | 1200 mm |

## Status Reporting

ncSender polls grblHAL for status at the configured polling interval (default 100ms). The status report includes:

- Machine and work positions
- Machine state (Idle, Run, Hold, Alarm, etc.)
- Feed rate and spindle speed
- Pin states (probe, limits, door)
- Overrides (feed, rapid, spindle)
- Work Coordinate Offset (WCO)

## Alarms

grblHAL alarm codes are automatically fetched and displayed with descriptions. Use `$X` to clear alarms, or the **Unlock** button in the toolbar.

## Probing

grblHAL supports:

- `G38.2` — Probe toward target, error if no contact
- `G38.3` — Probe toward target, no error
- `G38.4` — Probe away from target, error if no contact break
- `G38.5` — Probe away from target, no error

## Realtime Commands

ncSender uses grblHAL's realtime commands for instant response:

| Byte | Command |
|------|---------|
| `!` | Feed hold |
| `~` | Cycle start / Resume |
| `?` | Status query |
| `0x18` | Soft reset |
| `0x85` | Jog cancel |
| `0x87` | Full status report |
| `0xA0` | Toggle flood coolant |
| `0xA1` | Toggle mist coolant |

These bypass the planner buffer and execute immediately.
