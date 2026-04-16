# Console & Terminal

The console panel provides direct access to your CNC controller with command input, response logging, and quick controls.

## Terminal

The terminal tab shows a real-time log of all communication with the controller:

- **Commands** — Shown with a `>` prefix
- **Responses** — Color-coded by status (success/error/pending)
- **Timestamps** — Each entry is timestamped

### Sending Commands

Type G-code or controller commands in the input field and press ++enter++ to send. Use ++arrow-up++ and ++arrow-down++ to navigate command history.

### Auto-Scroll

Toggle auto-scroll to keep the latest messages visible. Disable it to read through history without interruption.

### Detach Terminal

Click the detach button to open the terminal in a larger modal window for better visibility.

## Quick Controls

The console provides one-click buttons for common operations:

| Button | Command | Description |
|--------|---------|-------------|
| **Home** | `$H` | Run homing cycle |
| **Unlock** | `$X` | Clear alarm and unlock |
| **Reset** | `Ctrl+X` | Soft reset (emergency) |
| **Status** | `0x87` | Request full status report |
| **Help** | `$help` | Show controller help |
| **Info** | `$I` | Controller build info |
| **Settings** | `$$` | List all GRBL settings |
| **State** | `$G` | Show G-code modal state |
| **Clear** | — | Clear terminal history |

### Spindle Controls

Quick spindle controls with RPM input:

- **M3** — Spindle clockwise
- **M4** — Spindle counter-clockwise
- **M5** — Spindle stop

## G-Code Preview

The G-Code tab shows the loaded program with:

- **Syntax highlighting** — Color-coded G-code
- **Line numbers** — For reference
- **Find & Replace** — Search with regex, case-sensitive, and whole-word options
- **Current line tracking** — Highlights the line being executed during a job

## Events Tab

See [Program Events](program-events.md) for details on the Program Start and Program End event system.
