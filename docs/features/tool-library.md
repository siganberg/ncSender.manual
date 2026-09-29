# Tool Library

ncSender keeps a **Tool Library** of your cutting tools: their sizes, names and
stored lengths, and which magazine slot each one sits in. The tools in your magazine
show as slot buttons in the visualizer (see [Tool Changer](tool-changer.md#tool-buttons)).

Open **Settings → Tool Library** to keep a list of your bits and assign them to the
slots (pockets) in your tool magazine. The bottom of the tab shows how many tools
are in the library. How many slots you have, and which tool buttons show, are set on
the [Tool Changer](tool-changer.md#setup) tab.

![Tool Library settings](../assets/images/features/tool-library.webp)

![Edit Tool dialog](../assets/images/features/tool-edit-dialog.webp)

Add, edit and delete tools here. Each tool has:

- **Tool ID**: the tool's own number. Each tool needs a different ID.
- **Assigned To Slot**: the magazine slot it sits in. See
  [Assigning a tool to a magazine slot](#assigning-a-tool-to-a-magazine-slot).
- **Tool Name / Description**: for example *1/4" Flat Endmill*.
- **Tool Type**: Flat End Mill, Ball End Mill, V-Bit, Drill, Chamfer, Surfacing or
  Thread Mill.
- **Diameter**
- **TLO**: the stored tool length offset.
- **TLS X Offset**, **TLS Y Offset** and **TLS Z Offset**: move where this tool is
  measured. Use them for a tool that sits off spindle center, such as a laser, or to
  start the measurement higher or lower for a long or short tool. Hover over each
  field for details.
- **Notes** and **SKU / Part Number** for your own use.

## Import / Export

Use **Import** and **Export** to back up your library or move it to another machine.

- **Export** saves the library to a `.json` file.
- **Import** loads a saved `.json` file. If a tool ID in the file already exists,
  ncSender lists them and asks before replacing.

**Pro:** **Import** also accepts **Vectric tool databases (`.vtdb`)** from VCarve,
Aspire and Cut2D.

## Assigning a tool to a magazine slot

A tool only takes a magazine slot once you assign it. There are two ways:

- **In Add Tool or Edit Tool**: set **Assigned To Slot** to a slot. Leave it on
  **None (Not in magazine)** to keep the bit in the library without a slot.
- **In the tool table**: click the tool's slot badge (**Slot#** or **No Slot**), then
  pick a slot.

<video autoplay loop muted playsinline preload="metadata" aria-label="Assigning a slot" poster="../../assets/images/features/tool-assign-slot-poster.jpg">
  <source src="../../assets/images/features/tool-assign-slot.mp4" type="video/mp4">
</video>


You can only pick Slot1 up to the **Magazine Size**. Set it on the
[Tool Changer](tool-changer.md#setup) tab.

!!! tip "Slots swap automatically"
    If another tool already sits in the slot you pick, the two tools swap. The list
    shows "(Swap with …)" next to that slot.


Assigned tools show a **Slot#** badge in the table. The slot strip is a map of the
magazine: click a slot to jump to its tool.

## How a tool number finds its tool

A tool's **TLO** and **TLS X/Y/Z Offsets** belong to the **tool**, not to the slot it
sits in. Move a tool to another slot and its offsets go with it.

When a file or a button asks for a tool, for example `M6 T4`, ncSender looks up the
number in this order:

1. **Slot.** If a tool is assigned to that slot, that tool is used.
2. **Tool ID.** If no tool is in that slot, the tool with that Tool ID is used.
3. **No match.** No stored offsets are applied.

| You run | Tool Library | Tool used |
|---------|--------------|-----------|
| `M6 T4` | Tool ID 68 is in Slot 4 | Tool ID 68, with its offsets |
| `M6 T87` | Tool ID 87 is in no slot | Tool ID 87, with its offsets |
| `M6 T4` | Slot 4 is empty, Tool ID 4 is in no slot | Tool ID 4, with its offsets |
| `M6 T99` | Nothing matches 99 | No stored offsets |

So a tool doesn't need a slot to use its offsets. Keeping bits out of the magazine is
fine. Give a tool a slot only if you want its slot button.

!!! warning "The slot wins"
    If a slot number and a Tool ID are the same number, the slot is used. With a
    tool in Slot 4, `M6 T4` always gets that tool, never the tool whose Tool ID is 4.
    Give tools you keep outside the magazine Tool IDs higher than your
    **Magazine Size** to avoid this.

The tool-changer plugins follow the same rule, and so does the TLO saved after a TLS
measurement.

## Probe slot

When **Probe** is on, the library adds a **Probe (T99)** slot. The number is your
probe tool number, 99 by default. Assign your probe to it in **Assigned To Slot** or
in the slot picker. It shows as a dashed **PROBE** box in the slot strip.

The probe can then store a TLO like any other tool. The Probe slot stays assigned
when you shrink the magazine.
