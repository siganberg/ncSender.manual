# Edge Align

Material alignment by edge probing — measure the rotation angle of your workpiece and apply XY compensation to your G-code.

<!-- TODO: Screenshot of Edge Align dialog -->
![Edge Align dialog](../assets/images/plugins/edge-align-dialog.png){ .placeholder }

## How It Works

Edge Align probes two points along a material edge to determine how much the workpiece is rotated on the table. It then rotates your G-code program to compensate, ensuring accurate cuts even when the material isn't perfectly aligned.

## Usage

1. Load your G-code program
2. Open **Edge Align** from the Tools menu
3. Click the edge to probe on the visual diagram (Left, Right, Front, or Back)
4. Configure measurement distance and probe settings
5. Position the probe near the edge using the built-in jog controls
6. Click **Probe** — the plugin probes two points automatically
7. Review the detected rotation angle
8. Click **Apply Rotation** to compensate the loaded G-code

## Edge Selection

<!-- TODO: Screenshot of the interactive edge selection visual -->
![Edge selection](../assets/images/plugins/edge-align-selection.png){ .placeholder }

Click directly on the visual diagram to select which edge to probe. The numbered dots (1 and 2) show the probe sequence and where to position the probe.

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Measurement Distance** | Distance between probe points along the edge | 50 mm |
| **Max Probe Distance** | Maximum travel toward the edge per probe | 20 mm |
| **Probe Feed Rate** | Speed when probing toward the edge | 100 mm/min |
| **Travel Feed Rate** | Speed when moving between probe points | 2000 mm/min |
| **Retract Clearance** | Distance to retract after each probe | 5 mm |

## Probe Sequence

<!-- TODO: GIF/WebP animation of the probing sequence -->
![Probing sequence](../assets/images/plugins/edge-align-probing.webp){ .placeholder }

1. Probe toward the edge at current position (**Point 1**)
2. Retract by the clearance distance
3. Travel along the edge using G38.3 (safe probe-away move)
4. Probe toward the edge again (**Point 2**)
5. Calculate the rotation angle

## Results

<!-- TODO: Screenshot of probe results showing angle -->
![Probe results](../assets/images/plugins/edge-align-results.png){ .placeholder }

After probing, the results panel shows:

- Point 1 and Point 2 coordinates
- Calculated rotation angle

## Applying Rotation

The rotation is applied using a 2D rotation matrix around the work origin (0,0):

- Both X and Y coordinates are rotated
- Arc offsets (I, J) in G2/G3 commands are also rotated
- The original file is preserved — use "Reset to Original" in the visualizer to revert

## Re-Applying Without Re-Probing

The last measured angle is saved automatically. When you reopen Edge Align, the previous results are shown and you can apply rotation again without re-probing.

!!! tip "Consistency Check"
    For a rectangular workpiece, probing any edge should give the same angle (assuming the sides are perpendicular). This is a good way to verify your measurement.
