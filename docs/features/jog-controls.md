# Jog Controls

Jog controls let you manually move the machine to position your workpiece, set zeros, or verify clearances.

## Jog Panel Layout

The jog panel consists of:

- **3x3 XY grid** — Directional buttons including diagonals
- **Center stop button** — Emergency jog cancel
- **Z+/Z- buttons** — Vertical movement (right side)
- **A+/A- buttons** — 4th axis rotation (if firmware supports it)
- **Step size selector** — Three categories with expandable options
- **Feed rate selector** — Per-category speed control

## Step Sizes

Steps are organized into three categories. Tap to jog, long-press (500ms) to see all options in a dropdown.

=== "Metric (mm)"

    | Category | Available Steps |
    |----------|----------------|
    | Small | 0.01, 0.05, 0.1, 0.5, 0.9 |
    | Medium | 1, 2, 5, 9 |
    | Large | 10, 50, 100, 300 |

=== "Imperial (inches)"

    | Category | Available Steps |
    |----------|----------------|
    | Small | 0.001, 0.005, 0.01, 0.05, 0.09 |
    | Medium | 0.1, 0.2, 0.5, 0.9 |
    | Large | 1, 2, 5, 10 |

## Feed Rates

Each step category has its own configurable feed rate:

- **Z-axis** automatically jogs at 50% of the XY feed rate
- **A-axis** (4th axis) jogs at 25% of the XY feed rate

## Jog Modes

### Step Jog

Tap a direction button to move a fixed distance (the selected step size). Each tap sends one discrete movement command.

### Continuous Jog

Long-press and hold a direction button to move continuously. The machine moves at the selected feed rate until you release the button. An automatic jog cancel (0x85) is sent on release.

### Diagonal Jog

The four corner buttons (↖ ↗ ↙ ↘) move both X and Y axes simultaneously.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ++arrow-left++ / ++arrow-right++ | Jog X- / X+ |
| ++arrow-up++ / ++arrow-down++ | Jog Y+ / Y- |
| ++page-up++ / ++page-down++ | Jog Z+ / Z- |

!!! tip "Quick Zero"
    Double-click an axis card in the DRO to manually type a coordinate value. Long-press an axis card to zero it at the current position.

## XY0 and Z0 Buttons

Quick-zero buttons are available below the jog panel:

- **XY0** — Zero both X and Y work coordinates (G10 L20 P0 X0 Y0)
- **Z0** — Zero Z work coordinate (G10 L20 P0 Z0)

!!! note
    When homing is disabled ($22=0), XY0 and Z0 buttons are always enabled. When homing is enabled, they require the machine to be homed first.
