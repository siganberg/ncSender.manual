# Multi-Workspace

!!! info "Pro Feature"
    Multi-Workspace is available in **ncSender Pro** only.

Load a program that uses several workspaces (G54–G59) and ncSender shows each one where it will cut. Use it to check batch and fixture jobs before you run them.

<video autoplay loop muted playsinline preload="metadata" aria-label="Multi-workspace" poster="../assets/images/features/multi-workspace-poster.jpg">
  <source src="../assets/images/features/multi-workspace.mp4" type="video/mp4">
</video>

## How It Works

Your program switches workspaces itself, with `G54`, `G55` and so on. ncSender reads which workspaces the program uses and then:

- Draws each part of the toolpath at that workspace's offset.
- Puts an origin marker on each workspace the program uses.

If the program has no workspace words, only the active workspace is drawn.

## Use Cases

- **Batch production**: cut the same part at several spots on the table.
- **Tiling**: split a large job into sections that fit the machine's travel.
- **Fixtures**: keep fixed workpiece positions for repeat setups.

## Set Up Each Workspace

1. Pick a workspace in the toolbar **Workspace:** selector, for example G54.
2. Jog to that part's origin. See [Jog Controls](jog-controls.md).
3. Zero the axes with the axis cards. See [DRO](dro.md).
4. Repeat for each workspace your program uses.
5. Load the program and check the markers and toolpaths in the visualizer.

## Workspace Visualization

- Click **Workspaces** in the legend to hide or show the origin markers.
- The markers update after you zero an axis and after a tool change.
- The **Toolpath exceeds machine boundaries** warning checks every workspace in the program.
- [Trace](trace.md) outlines all workspaces in the program together.

<video autoplay loop muted playsinline preload="metadata" aria-label="Multi-workspace animation" poster="../assets/images/features/multi-workspace-running-poster.jpg">
  <source src="../assets/images/features/multi-workspace-running.mp4" type="video/mp4">
</video>
