# 3DMesh

3DMesh probes the surface of your stock at many points, then adjusts your
program's depths so the cut follows the surface. Use it to engrave or carve on
a warped board, a curved guitar top or a spoilboard that isn't flat.

3DMesh is for **ncSender Pro**. You need a touch probe.

## Before you start

1. Install 3DMesh from **Settings** > **Plugins** > **Install Plugin**.
2. Connect your probe and home the machine.
3. Load your program.
4. Set work zero.

## Probe the surface

<!-- CAPTURE NEEDED: assets/images/plugins/3dmesh-probe.webp (3DMesh, Probe tab) -->

1. Open the **Plugins** tab in the console area and press **3DMesh**.
2. On the **Probe** tab, set **Grid Mode**:
    - **Auto from G-code**: covers the area of the loaded program.
    - **Manual**: enter **Size X** and **Size Y** yourself.
3. Set **Columns (X)** and **Rows (Y)**, the number of points in each
   direction. More points follow the surface more closely but take longer.
4. Check the probe settings (below).
5. Jog the probe to the starting corner, above the stock.
6. Press **Start Probing**.

The machine probes each point in turn. Press **Stop** to halt.

<!-- CAPTURE NEEDED: assets/images/plugins/3dmesh-probing.webp (Probing the grid) -->

!!! note
    Between points the machine moves with the probe active, so it stops if the
    probe touches something on the way.

Press **Save Settings** to keep your grid and probe settings for next time.

## Apply to your program

<!-- CAPTURE NEEDED: assets/images/plugins/3dmesh-apply.webp (Applying the mesh) -->

Press **Apply**. The adjusted program loads. Your original file is kept. To go
back, use **Reset to Original** in the visualizer.

## Mesh Data

<!-- CAPTURE NEEDED: assets/images/plugins/3dmesh-mesh-data.webp (3DMesh, Mesh Data tab) -->

The **Mesh Data** tab shows the measured surface. Drag to rotate the 3D view.

- **Current Mesh**: the points just measured. Type a name and press **Rename**
  to keep it under that name.
- **Saved Meshes**: meshes are saved after probing. Pick one to use it again
  without probing, for example when you cut a second part on the same fixture.

## Settings

| Setting | What it does | Default |
|---|---|---|
| **Grid Mode** | **Manual** or **Auto from G-code** | |
| **Columns (X)** / **Rows (Y)** | Number of points in each direction | 5 × 5 |
| **Size X** / **Size Y** | Size of the area to probe (Manual only) | 100 mm |
| **Probe Feed Rate** | How fast the probe moves down | 100 mm/min |
| **Travel Feed Rate** | How fast it moves between points | 2000 mm/min |
| **Clearance Height** | How high it lifts between points | 5 mm |
| **Max Plunge** | How far down it searches before giving up | 20 mm |

## Troubleshooting

- **A point isn't found.** The surface is lower than **Max Plunge** reaches.
  Raise Max Plunge or start closer to the stock.
- **Probing hits a clamp.** Raise **Clearance Height**, or make the grid smaller
  so it stays inside the stock.
