# ToolBench

G-code generator for surfacing, jointing, boring, and wasteboard operations.

## Tools

### Planer (Surfacing)

Generate surfacing toolpaths for flattening material or wasteboards.

**Modes:**

| Mode | Z-Zero Reference | Use Case |
|------|-----------------|----------|
| **Target Depth** | Top of material | Remove a fixed depth from the surface |
| **Target Thickness** | Bottom of material (wasteboard) | Mill down to a specific thickness |
| **Wasteboard Surfacing** | Top of material | Surface the entire machine bed |

**Wasteboard Surfacing** automatically reads machine travel limits ($130/$131) and fills the entire work area. The origin picker and dimensions are disabled — the machine does all the work.

**Parameters:**

| Setting | Description |
|---------|-------------|
| **Direction** | Horizontal, Vertical, or Spiral pattern |
| **Origin** | Work zero position (5-point picker) |
| **X/Y Dimension** | Area to surface |
| **Depth of Cut** | Material removed per pass |
| **Stepover** | Percentage of bit diameter per step (10-100%) |
| **Overrun** | Extra travel beyond edges for clean cuts |
| **Bit Diameter** | Surfacing bit size |
| **Feed Rate** | Cutting speed |
| **Spindle RPM** | Spindle speed |
| **Coolant** | Mist (M7) and Flood (M8) toggles |

### Additional Tools

ToolBench also includes generators for:

- **Jointing** — Edge jointing operations
- **Boring** — Hole boring operations
