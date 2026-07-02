# Tool Management

ncSender keeps a **Tool Library** — an inventory of your cutting tools — and surfaces
the tools you use most as **tool buttons** in the visualizer, alongside the Tool Length
Setter (TLS) and Probe. When you install a tool-changer plugin, it takes over these
controls and drives tool changes for you.

## Tool Library

Open **Settings → Tool Library**. This is where you keep an inventory of your bits and
assign them to the slots (pockets) in your tool magazine.

<!-- TODO: Screenshot of Settings > Tool Library -->
![Tool Library settings](../assets/images/features/tool-library.png){ .placeholder }

Add, edit, and delete tools here. Each tool holds:

- **Tool number** — the pocket / magazine slot it's assigned to (leave unassigned to
  keep a bit in inventory without occupying a slot)
- **Name** — a description such as *1/4" Flat Endmill*
- **Type** — flat, ball, V-bit, drill, chamfer, surfacing, thread-mill, or probe
- **Diameter**
- **Tool length offset (TLO)** and its **TLS probe offsets** (X / Y / Z)
- **Notes** and **SKU** for your own reference

### Tool button controls

The Tool Library also decides what appears in the visualizer's tool area:

- **Magazine size** — how many numbered tool buttons (T1, T2, …) to show. Set it to the
  number of pockets you use; set it lower to hide unused slots.
- **Manual** — show the **Manual** tool-change button (for non-ATC workflows).
- **TLS** — show the **Tool Length Setter** button.
- **Probe** — show the **Probe** button (tool T99).

!!! note "Plugins take over these controls"
    When a **Tool Changer** category plugin is installed and enabled, these controls are
    disabled and a message shows which plugin owns them — *"Controls are disabled because
    they are currently controlled by Plugin: …"*. The plugin decides how many buttons
    appear and whether TLS / Probe are shown. Disable the plugin to hand the controls
    back to the Tool Library.

## Tool Buttons

The tool buttons live at the bottom-right of the visualizer.

<!-- TODO: Screenshot of tool buttons in the visualizer footer -->
![Tool buttons](../assets/images/features/tool-buttons.png){ .placeholder }

- **T1, T2, … TN** — one button per magazine slot. The **active tool** is highlighted, and
  any tool that appears in the loaded G-code is marked so you can see what the job needs.
- **Manual** — for manual tool-changer workflows; active when the current tool isn't one
  of the numbered slots.
- **TLS** — runs the Tool Length Setter (see below). Disabled when no tool is loaded.
- **Probe** — the probe tool (T99); active while the probe is the current tool.

Press and hold a tool button (about half a second) to trigger it. Numbered tools issue a
tool change (`M6`); the TLS button runs `$TLS`.

## Tool Changer Plugins

Tool management is extended through **Tool Changer** category plugins:

- **[Rapid Change ATC](../plugins/rapid-change-atc.md)** — automatic tool changer support
- **[Manual Tool Changer](../plugins/manual-tool-changer.md)** — guided manual tool changes with TLS

While one of these is enabled it becomes the *source* for the tool settings above — it sets
the button count and forces the appropriate TLS / Probe options on. Removing or disabling
the plugin returns control to the Tool Library.

## Tool Length Setter (TLS)

The TLS establishes a **Tool Length Reference (TLR)** so Z stays consistent across tool
changes. Pressing **TLS** (or running `$TLS`) performs the measurement:

1. Switches to the TLS probe input (if a separate probe source is configured).
2. Moves to the TLS position and probes Z to touch off the tool.
3. Sets the tool length offset for the current tool.
4. Restores the normal probe source and returns to the previous XY position.

<!-- TODO: GIF/WebP animation of TLS probing sequence -->
![TLS probing](../assets/images/features/tool-tls.webp){ .placeholder }

### The glowing TLS button

When a tool is loaded but its length hasn't been measured yet, the **TLS button pulses
with a red glow**. It's a reminder that no Tool Length Reference is set — run TLS before
you rely on Z.

<!-- TODO: Screenshot of the glowing TLS button -->
![Glowing TLS button](../assets/images/features/tool-tls-glow.png){ .placeholder }

If you try to **set Z0 without a Tool Length Reference**, ncSender interrupts with a
warning dialog — *"Tool Length Reference Not Set"* — explaining that zeroing Z without a
TLR can cause unpredictable Z offsets during tool changes. You can:

- **Run TLS** — measure now to establish the reference (recommended), or
- **Continue Anyway** — proceed and set Z0 without a TLR, or
- **Cancel**.

<!-- TODO: Screenshot of the Tool Length Reference warning dialog -->
![Tool Length Reference warning](../assets/images/features/tool-tlr-dialog.png){ .placeholder }

!!! warning "Laser mode"
    Tool buttons and the TLS glow/warning don't apply in laser mode — there's no tool
    length to reference.
