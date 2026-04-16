# Trace

!!! info "Pro Feature"
    Trace is available in **ncSender Pro** only.

Trace your toolpath bounding box directly on the material or workpiece to verify the job fits before cutting.

<!-- TODO: GIF/WebP animation of trace running (machine tracing bounding box) -->
![Trace animation](../assets/images/features/trace.webp){ .placeholder }

## How It Works

Trace moves the machine along the bounding rectangle of the loaded G-code program at a safe Z height. This lets you visually confirm:

- The program fits within the workpiece
- The origin is positioned correctly
- No clamps or fixtures are in the way

## Usage

1. Load a G-code program
2. Set your work zero (X0, Y0)
3. Click the **Trace** button in the toolbar
4. The machine traces the program's XY bounding box
5. Verify the path is within your material

!!! tip
    Trace uses rapid moves (G0) at a safe height, so it completes quickly without cutting.
