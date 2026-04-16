# Tool Management

## Tool Slots

<!-- TODO: Screenshot of tool slots carousel in visualizer -->
![Tool slots](../assets/images/features/tool-slots.png){ .placeholder }

Configure the number of tool slots (magazine size) in the Tools tab. Each slot represents a position in your tool changer or manual tool change workflow.

## Tool Buttons

Tool buttons (T1, T2, etc.) appear in the visualizer when a tool changer plugin is installed:

- Click a tool button to initiate a tool change
- Active tool is highlighted
- Manual tool change button for non-ATC workflows
- TLS (Tool Length Setter) button for touch-off

<!-- TODO: Screenshot of tool buttons in the visualizer footer -->
![Tool buttons](../assets/images/features/tool-buttons.png){ .placeholder }

## Tool Changer Plugins

Tool management is extended through plugins:

- **[Rapid Change ATC](../plugins/rapid-change-atc.md)** — Automatic tool changer support
- **[Manual Tool Changer](../plugins/manual-tool-changer.md)** — Manual tool change workflow with TLS

## Tool Length Setter (TLS)

When configured, the TLS button triggers an automatic tool length measurement:

1. Machine moves to the TLS position
2. Probes Z to measure tool length
3. Sets the tool length offset automatically

<!-- TODO: GIF/WebP animation of TLS probing sequence -->
![TLS probing](../assets/images/features/tool-tls.webp){ .placeholder }

!!! note
    Tool settings are managed by the active tool changer plugin. Installing a non-tool-changer plugin will not affect your tool configuration.
