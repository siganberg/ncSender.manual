# Plugins

ncSender supports a plugin system that extends functionality with custom tools, workflows, and integrations.

## Installing Plugins

1. Go to **Settings > Plugins**
2. Browse available plugins in the plugin store
3. Click **Install** on the plugin you want
4. The plugin appears in the toolbar under **Tools**

## Available Plugins

| Plugin | Category | Description |
|--------|----------|-------------|
| [Edge Align](edge-align.md) | G-code Generator | Material alignment by edge probing with rotation compensation |
| [3DMesh](3dmesh.md) | G-code Generator | Surface mesh probing with Z compensation |
| [ToolBench](toolbench.md) | G-code Generator | Surfacing, jointing, boring, and wasteboard operations |
| [Rapid Change ATC](rapid-change-atc.md) | Tool Changer | Automatic tool changer support |
| [Manual Tool Changer](manual-tool-changer.md) | Tool Changer | Manual tool change workflow with TLS |
| [Replicator](replicator.md) | G-code Generator | Replicate G-code in grid patterns |
| [BoxJoints](boxjoints.md) | G-code Generator | Box joint (finger joint) generation |

## Plugin Categories

### Tool Changers

Only one tool changer plugin can be active at a time. Installing a new tool changer automatically disables the previous one.

### G-code Generators

Generate G-code programs directly from parameter inputs. These plugins create temporary files that can be run immediately or saved.

### Utilities

General-purpose tools that extend ncSender's capabilities.

## Managing Plugins

- **Enable/Disable** — Toggle plugins on or off without uninstalling
- **Update** — Plugins can be updated through the plugin store
- **Uninstall** — Remove plugins you no longer need
- **Priority** — Drag to reorder plugin priority in the tools menu

## Developing Plugins

Plugins use a V2 format with:

- `manifest.json` — Plugin metadata and configuration
- `config.html` — Client-side UI (rendered in a dialog)
- `index.js` — Thin wrapper for loading the UI

Plugins communicate with ncSender via HTTP API (`fetch()`) for settings, commands, and server state.
