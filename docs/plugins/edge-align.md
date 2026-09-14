# Edge Align

Edge Align measures how crooked your stock sits on the table, then turns your
program to match. Use it when the stock isn't square to the machine.

Edge Align is for **ncSender Pro**. You need a touch probe.

## Before you start

1. Install Edge Align from **Settings** > **Plugins** > **Install Plugin**.
2. Connect your probe and home the machine.
3. Load your program.
4. Set work zero (X0 Y0). The program turns around work zero.

## Measure the edge

<!-- CAPTURE NEEDED: assets/images/plugins/edge-align-probe.webp (Edge Align, Probe section) -->

1. Open the **Plugins** tab in the console area and press **Edge Align**.
2. Jog the probe close to the edge you want to measure.
3. Under **Edge Selection**, pick **Left**, **Right**, **Front** or **Back**.
4. Check the summary: selected edge, distances and speeds.
5. Press **Probe**.

The probe touches the edge at two points. Press **Stop** at any time to halt.

<!-- CAPTURE NEEDED: assets/images/plugins/edge-align-probing.webp (Probing an edge) -->

## Apply the rotation

<!-- CAPTURE NEEDED: assets/images/plugins/edge-align-results.webp (Probe Results) -->

**Probe Results** shows both touch points and the **Rotation Angle**.

Press **Apply Rotation**. Edge Align makes a turned copy of your program and
loads it. Your original file is kept. To go back, use **Reset to Original** in
the visualizer.

<!-- CAPTURE NEEDED: assets/images/plugins/edge-align-applied.webp (Rotated program) -->

The last result is kept when you close Edge Align, so you can apply it again
without probing again. Press **Clear Results** to start fresh.

If the probe triggers an alarm, press **Unlock**.

!!! tip "Check your measurement"
    On a square piece, every edge should give the same angle. Probe a second
    edge to confirm.

## Settings

<!-- CAPTURE NEEDED: assets/images/plugins/edge-align-settings.webp (Edge Align, Settings section) -->

| Setting | What it does | Default |
|---|---|---|
| **Measurement Distance** | How far apart the two touch points are. Longer gives a more accurate angle. | 50 mm |
| **Max Probe Distance** | How far the probe moves toward the edge before giving up | 20 mm |
| **Retract Clearance** | How far the probe backs off after each touch | 5 mm |
| **Probe Feed Rate** | How fast the probe moves toward the edge | 100 mm/min |
| **Travel Feed Rate** | How fast it moves between the two points. This move stops if the probe touches something. | 2000 mm/min |

## Troubleshooting

- **The probe doesn't find the edge.** Jog closer, or raise
  **Max Probe Distance**.
- **The rotated program is in the wrong place.** Set work zero before you press
  **Apply Rotation**, then apply again from the original.
