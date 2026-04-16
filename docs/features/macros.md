# Macros

Macros let you save frequently-used G-code sequences as reusable buttons.

## Creating a Macro

<!-- TODO: Screenshot of macro editor panel -->
![Macro editor](../assets/images/features/macros-editor.png){ .placeholder }

1. Go to the **Macros** tab in the console panel
2. Click **+ New** to create a new macro
3. Enter a **Name** and optional **Description**
4. Write your G-code in the editor
5. Click **Save**

Each macro is assigned a unique ID in the range 9001-9999.

## Running a Macro

You can run a macro in several ways:

- Click the **Play** button next to the macro in the list
- Type `M98 P<macro_id>` in the console (e.g., `M98 P9001`)
- Assign it to a custom button or event

## Macro Editor

The macro editor provides:

- **Syntax highlighting** — G-code keywords are color-coded
- **Line numbers** — For easy reference
- **Multiple lines** — Write complex sequences with multiple commands
- **Dark/light theme** — Matches your app theme preference

## Searching Macros

<!-- TODO: Screenshot showing macro search filtering results -->
![Macro search](../assets/images/features/macros-search.png){ .placeholder }

Use the search bar to filter macros by name, description, body text, or ID number.

## Example Macros

### Go to Machine Zero
```gcode
G53 G0 Z0
G53 G0 X0 Y0
```

### Park Position
```gcode
G53 G0 Z0
G53 G0 X0 Y-1200
```

### Probe Z and Zero
```gcode
G91
G38.2 Z-50 F100
G10 L20 P0 Z0
G0 Z5
G90
```

!!! tip
    Macros support any G-code your controller understands, including firmware-specific commands like `$H` (home) or `$X` (unlock).
