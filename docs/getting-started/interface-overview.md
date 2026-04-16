# Interface Overview

ncSender's interface is organized into several key areas.

## Main Layout

<!-- TODO: Annotated screenshot of full interface with labeled areas -->
![Interface overview](../assets/images/getting-started/interface-overview.png){ .placeholder }

The interface consists of:

1. **Status Bar** — Connection status, machine state, and quick actions
2. **DRO (Digital Readout)** — Live X, Y, Z (and A) coordinates with long-press to zero
3. **3D Visualizer** — Real-time G-code preview with toolpath rendering
4. **Console Panel** — Tabbed panel with Console, Macros, Tools, Events, and G-code preview
5. **Jog Controls** — Step/continuous jogging with keyboard shortcuts
6. **Control Bar** — Start, Pause, Stop, and program controls

## DRO (Digital Readout)

<!-- TODO: Close-up screenshot of DRO cards showing X, Y, Z values -->
![DRO cards](../assets/images/getting-started/dro-cards.png){ .placeholder }

The DRO displays both work and machine coordinates for each axis.

- **Long-press** an axis card to zero it at the current position
- **Double-click** to manually enter a coordinate value
- **XY link** button zeros both X and Y simultaneously

<!-- TODO: GIF/WebP animation of long-press zeroing an axis -->
![Zero axis animation](../assets/images/getting-started/zero-axis.webp){ .placeholder }

## Visualizer

<!-- TODO: Screenshot of visualizer with loaded toolpath -->
![Visualizer with toolpath](../assets/images/getting-started/visualizer-toolpath.png){ .placeholder }

The 3D visualizer shows:

- Loaded G-code toolpath
- Current machine position with animated toolhead
- Work coordinate system marker (G54, G55, etc.)
- Workspace boundaries

## Console Panel Tabs

<!-- TODO: Screenshot showing console panel with tabs -->
![Console panel](../assets/images/getting-started/console-panel.png){ .placeholder }

| Tab | Description |
|-----|-------------|
| **Console** | Command input and response history |
| **Macros** | Custom macro buttons |
| **Tools** | Plugin tool menu items |
| **Events** | Program Start/End event G-code |
| **G-Code** | Preview of loaded program |
