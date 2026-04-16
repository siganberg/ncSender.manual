# Safety Door Intelligence

!!! info "Pro Feature"
    Safety Door Intelligence is available in **ncSender Pro** only.

Enhanced safety door handling for professional CNC machines with `$61` (Ignore when idle) support.

## Features

### Automatic Spindle Stop

When the safety door opens while the spindle is running manually (no active job), ncSender automatically sends M5 to stop the spindle immediately. This prevents the spindle from running unattended with an open door.

### Controlled Jogging

Allows slow jogging while the door is open for setup and inspection:

- Feed rate automatically limited to safe speeds (1000 mm/min)
- Rapid moves are blocked
- Both UI and pendant jog commands are routed through the safety processor

### Safety Command Processor

All jog commands are processed through a safety layer that:

- Limits feed rates when the door is open
- Blocks unsafe rapid moves
- Annotates terminal output so operators can see when limits are applied

### Terminal Feedback

Door-limited commands are annotated in the terminal with clear messages showing when and why speed limits are applied.

## Configuration

Safety door behavior is controlled by the firmware setting `$61`:

- `$61=0` — Door always triggers hold (default GRBL behavior)
- `$61=1` — Door ignored when idle (ncSender adds intelligent handling)
