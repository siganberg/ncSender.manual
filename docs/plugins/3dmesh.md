# 3DMesh

Surface mesh probing with Z compensation for milling curved or uneven materials using flat (2D) G-code programs.

## How It Works

3DMesh probes a grid of points across your workpiece surface to create a height map. It then adjusts the Z-coordinates in your G-code to follow the surface contour, compensating for material curvature or mounting inconsistencies.

## Usage

1. Load your G-code program
2. Open **3DMesh** from the Tools menu
3. Configure the probe grid (rows, columns, or auto-detect from G-code bounds)
4. Set probe parameters (feed rate, clearance, max plunge depth)
5. Click **Start Probing** — the machine probes each grid point
6. Review the 3D mesh visualization
7. Click **Apply Z Compensation** to adjust the loaded program

## Grid Modes

- **Auto** — Automatically calculates grid dimensions from the loaded G-code bounds
- **Manual** — Specify rows, columns, and dimensions manually

## 3D Visualization

After probing, the plugin displays an interactive 3D view of the measured surface:

- Isometric projection with drag rotation
- XYZ axes and floor/side grids
- Color-coded height values
- Mesh data table with X, Y, Z coordinates

## Mesh Library

Save and manage multiple mesh profiles:

- Auto-save after probing
- Rename saved meshes
- Load a previous mesh without re-probing
- Each mesh stores grid parameters and all measured points

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Grid Mode** | Auto (from G-code) or Manual | Auto |
| **Rows / Columns** | Number of probe points per axis | 3 x 5 |
| **Probe Feed Rate** | Speed for Z probing | 100 mm/min |
| **Travel Feed Rate** | Speed for XY travel between points | 2000 mm/min |
| **Clearance Height** | Safe Z height between probes | 5 mm |
| **Max Plunge** | Maximum Z probe depth | 20 mm |

## Z Compensation

The compensation uses bilinear interpolation between grid points:

- Long moves are subdivided to follow the surface accurately
- G0 rapid moves maintain safe Z heights
- The original file is preserved for "Reset to Original"

!!! warning "Double Compensation"
    3DMesh detects if a file has already been compensated and prevents applying compensation twice.
