# Visualizer

The 3D Visualizer is the centerpiece of ncSender, providing a real-time preview of your G-code toolpath and live machine position tracking.

## Views

ncSender offers four different viewing modes:

| View | Description | Best For |
|------|-------------|----------|
| **3D (Isometric)** | Full 3D perspective view with rotation | General use, inspecting toolpaths |
| **Top** | Orthographic top-down view (XY plane) | Verifying 2D layouts, checking positions |
| **Front** | Orthographic front view (XZ plane) | Checking depth passes, Z movements |
| **Split** | Quad-view showing Top, Front, and 3D simultaneously | Detailed inspection |

Switch views using the view preset buttons in the visualizer toolbar.

## Navigation

- **Pan** — Click and drag to move the view
- **Zoom** — Mouse wheel or trackpad pinch to zoom in/out
- **Rotate** (3D view only) — Right-click and drag to orbit

## Toolpath Rendering

When a G-code file is loaded, the visualizer renders the complete toolpath:

- **Rapid moves (G0)** — Dashed lines showing non-cutting travel
- **Feed moves (G1)** — Solid lines showing cutting paths
- **Arcs (G2/G3)** — Smooth curved paths
- **Current position** — Animated toolhead (spindle or laser) following execution progress

## Toolhead Display

The visualizer shows an animated 3D model at the current machine position:

- **Spindle mode** — Shows a rotating spindle with collet
- **Laser mode** — Shows a laser head with beam reaching the workbed (**Pro only**)

!!! tip "Spindle View"
    Toggle **Spindle View** to see the spindle rotate when the spindle is active. This helps visually confirm spindle direction (CW/CCW).

## Controls

### Auto-Fit

When enabled, the camera automatically adjusts to frame the loaded G-code toolpath. When disabled, the camera frames the full grid area.

### Reset to Original

If your G-code has been modified by a plugin (e.g., Edge Align rotation or 3DMesh Z compensation), click **Reset to Original** to revert to the unmodified source file.

## Workspace Markers

The visualizer displays workspace origin markers for G54 through G59. These show where each coordinate system's origin is positioned relative to the machine.

- Active workspace is highlighted
- Toggle visibility in the legend panel
- Markers auto-scale with zoom level

## Tool Legend

When multiple tools are used in a program, the legend panel shows:

- Tool numbers (T1, T2, etc.) with color coding
- Manual tool change indicator
- TLS (Tool Length Setter) indicator
- Click a tool to highlight its paths

## Out-of-Bounds Detection

If the loaded toolpath exceeds the machine's travel limits, ncSender displays a warning. This helps prevent crashes before running a program.

## Aux Controls

The visualizer includes toggle switches for auxiliary outputs:

- **Flood Coolant (M8)** — Toggle flood coolant on/off
- **Mist Coolant (M7)** — Toggle mist coolant on/off
- **Custom Aux Outputs** — M64/M65 digital outputs (configurable in Settings)

!!! note "Realtime Control"
    Flood and Mist toggles use grblHAL realtime commands (0xA0/0xA1) that bypass the planner buffer. This means you can toggle coolant even while a program is running.
