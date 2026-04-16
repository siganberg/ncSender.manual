# Laser Mode

!!! info "Pro Feature"
    Laser mode is available in **ncSender Pro** only.

Laser mode transforms the visualizer and controls for laser engraving and cutting workflows.

## Enabling Laser Mode

<!-- TODO: Screenshot of laser settings dialog -->
![Laser settings](../assets/images/features/laser-settings.png){ .placeholder }

1. Open **Laser Settings** from the visualizer toolbar
2. Select the spindle used for your laser under **Spindle use for Laser**
3. Enable **Mode of operation ($32)** to set the controller to laser mode
4. Click **Save**
5. Toggle **Laser Mode** in the visualizer controls

!!! warning
    Laser mode requires unloading any active tool first. If a tool is loaded, you'll be prompted to unload it before switching to laser mode.

## Laser Settings

| Setting | Description |
|---------|-------------|
| **Spindle use for Laser** | Which spindle output drives the laser module |
| **Mode of operation ($32)** | Firmware laser mode — consecutive G1/G2/G3 commands won't halt when power changes |
| **Z-Offset Laser (mm)** | Visual height of the laser head above the workbed in the visualizer (default: 30mm). Does not affect machine position or G-code. |

## Visualizer Changes

<!-- TODO: Screenshot of laser mode with beam, power bar, and burn effect -->
![Laser mode visualization](../assets/images/features/laser-visualization.png){ .placeholder }

When laser mode is active:

- **Laser head model** replaces the spindle model
- **Beam visualization** shows a laser beam from the head to the workbed surface
- **Burn effect** animates where the laser contacts the workpiece
- **Power bar** displays current laser power as a color-coded bar (0-100%)
- **Rapids hidden** — G0 moves are not displayed (laser doesn't fire during rapids)

<!-- TODO: GIF/WebP animation of laser running a job with beam and burn effect -->
![Laser animation](../assets/images/features/laser-running.webp){ .placeholder }

## Z-Offset

The Z-Offset setting controls the visual height of the laser head above the grid. This creates a visible beam between the nozzle and the workpiece surface for a realistic visualization.

- Default: 30mm
- Range: 0-100mm
- Purely visual — does not affect any machine commands

## Power Tracking

The power bar shows the current S-value (laser power) as a percentage of maximum:

- Segments fill from left to right as power increases
- Color transitions from dim to bright
- Shows 0% during G0 rapid moves (laser off)
