# QuickCut

G-code generator for everyday operations — shapes, surfacing and edge work —
straight from a dialog in ncSender. For the jobs where opening a CAM package to
cut one rectangle, flatten a spoilboard or true up a rough edge isn't worth the
setup.

!!! info "QuickCut replaces ToolBench"
    Surfacing, jointing and boring all moved here, and the shape operations are
    new. See [Coming from ToolBench](#coming-from-toolbench) below.

<!-- TODO: Screenshot of the QuickCut dialog with the Circle tab open -->

## Shapes

Three shape operations — **Rectangle**, **Circle** and **Polygon** — that share
the same cut types, origin picker and pattern options.

### Cut type

The setting that decides whether anything is left in the middle:

| Cut type | What it does |
|---|---|
| **Inner (perimeter)** | Cuts around the inside of the line. On a through cut this frees a slug and leaves the centre uncut — right for a hole whose waste you intend to push out. |
| **Inner (clearing)** | Clears the whole enclosed area, so a blind pocket comes out flat-bottomed with nothing standing in the middle. |
| **Outer (part)** | Cuts outside the line, parting the shape off the surrounding stock. |

If a hole comes out with a post in the middle, you asked for a perimeter cut
where you wanted a clearing one — change the cut type rather than the bit.

### Per-shape options

| Shape | Options |
|---|---|
| **Rectangle** | Width, height, optional corner radius |
| **Circle** | Diameter, cut with a helical entry and a final finish pass |
| **Polygon** | Number of sides and rotation |

### Patterns

Any shape can be repeated without generating the file again:

| Pattern | Layout |
|---|---|
| **Linear** | A grid — X × Y counts with signed distances, so the pattern can run in any direction from the origin |
| **Circular (Identical)** | Copies spaced around a radius, each one in the same orientation |
| **Circular (Path Direction)** | Copies spaced around a radius, each rotated to follow the circle |

Both the shape and the pattern have their own rotation setting.

!!! note "Origin applies to the whole program"
    The origin you pick is the origin of everything QuickCut generates,
    patterns included — not of the first shape in the pattern.

## Operations

### Planer

Surface a flat region — a workpiece or the machine's own wasteboard.

| Mode | Z-zero reference | Use case |
|---|---|---|
| **Target Depth** | Top of material | Remove a fixed depth from the surface |
| **Target Thickness** | Bottom of material (wasteboard) | Mill down to a specific finished thickness |
| **Wasteboard Surfacing** | Top of material | Surface the whole machine bed |

**Wasteboard Surfacing** reads the machine's travel limits from grblHAL
(`$130`/`$131`) and fills the work area, so there are no dimensions to enter.

Raster patterns: **Zigzag (long-X)**, **Zigzag (long-Y)**,
**Spiral (outside-in)** and **Honeycomb**.

A side-view preview shows the Z0 reference line and depth arrows before you
generate, which is the quickest way to catch a mode chosen in error — Target
Depth and Target Thickness measure from opposite faces of the material.

### Jointer

Make a straight reference edge on rough stock.

Choose the side to work (**Front**, **Back**, **Left** or **Right**), a trim
width and a number of trims. Cuts run in a single direction so climb or
conventional stays consistent across every pass rather than alternating. A
top-view preview shows the cut layout before the job runs.

### Cutter

A cold-saw-style parting cut: a single cut line at a target dimension,
compensated for the bit radius, taken in multiple Z passes to keep the load off
the bit.

## Common settings

- **Units** — metric and imperial, following ncSender's own units preference.
- **Safe Z** — uses ncSender's core Safe Z height, falling back to machine Z0
  when that is unset.
- **Direction** — Climb or Conventional.
- **Persistence** — each operation remembers its settings between sessions.

## Coming from ToolBench

QuickCut's Planer, Jointer and Cutter are the operations ToolBench provided,
rebuilt. Two things to know when moving over:

- **Boring is now Circle.** A bored hole is a Circle with **Inner (perimeter)**;
  the flat-bottomed pocket ToolBench could not produce is **Inner (clearing)**.
- **Origin covers the whole program.** In ToolBench's boring feature a *center*
  origin placed a pattern symmetrically on both sides of the origin. In QuickCut
  the origin you select applies to everything generated, pattern included.
