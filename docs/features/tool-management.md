# Tool Management

## Tool Slots

Configure the number of tool slots (magazine size) in the Tools tab. Each slot represents a position in your tool changer or manual tool change workflow.

## Tool Buttons

Tool buttons (T1, T2, etc.) appear in the visualizer when a tool changer plugin is installed:

- Click a tool button to initiate a tool change
- Active tool is highlighted
- Manual tool change button for non-ATC workflows
- TLS (Tool Length Setter) button for touch-off

## Tool Changer Plugins

Tool management is extended through plugins:

- **[Rapid Change ATC](../plugins/rapid-change-atc.md)** — Automatic tool changer support
- **[Manual Tool Changer](../plugins/manual-tool-changer.md)** — Manual tool change workflow with TLS

## Tool Length Setter (TLS)

When configured, the TLS button triggers an automatic tool length measurement:

1. Machine moves to the TLS position
2. Probes Z to measure tool length
3. Sets the tool length offset automatically

!!! note
    Tool settings are managed by the active tool changer plugin. Installing a non-tool-changer plugin will not affect your tool configuration.
