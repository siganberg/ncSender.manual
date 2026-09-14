# Keepout Zone

!!! info "Pro Feature"
    Keepout Zone is available in **ncSender Pro** only.

A keepout zone is a rectangle on your table that the spindle should never enter. ncSender draws it in the visualizer and keeps jogs and moves out of it.

!!! warning "Experimental"
    Keepout Zone is experimental. It does not replace an E-stop. Please report anything unexpected.

## What It's For

- Clamps and hold-downs that stay in the same place
- A tool change rack (ATC) or tool setter
- Fixtures and jigs bolted to the table

## Set It Up

Your machine must be connected so ncSender can read its travel limits.

1. Open **Settings → Advanced** and scroll to **Keepout Zone**.
2. Turn on **Enable Keepout Zone**.
3. Under **Origin**, enter the X and Y of one corner in machine coordinates. The corner matches your **Machine Home Location**, for example **Origin (Top-Left Corner)**.
4. Under **Size**, enter the width (**W**) and height (**H**).
5. Check the preview. It saves by itself.

<!-- CAPTURE NEEDED: assets/images/features/keepout-settings.webp (Keepout Zone settings) -->

!!! tip "Finding the corner"
    Jog the spindle to the corner of the area you want to protect and read the machine position from the DRO.

ncSender checks the zone against your machine's travel limits. If part of it is off the table, you'll see a message such as "Right edge X (…) exceeds machine limit (…)". If the limits show **Not loaded (connect & read firmware)**, connect the machine first.

<!-- CAPTURE NEEDED: assets/images/features/keepout-validation.webp (Keepout Zone validation message) -->

The zone shows in the visualizer, labelled **KEEPOUT**. The label pulses when you load a program and after you change a work offset.

<!-- CAPTURE NEEDED: assets/images/features/keepout-visualizer.webp (Keepout Zone in the visualizer) -->

## When You Jog

- Jogs stop at the edge of the zone. This includes the jog buttons, the keyboard, gamepads and the pendant.
- A jog that is already at the edge does nothing.
- The terminal shows where the jog was stopped, for example `(keepout: 250,300 → 180,300)`.

<!-- CAPTURE NEEDED: assets/images/features/keepout-jog-clamp.webp (Jog stopping at the keepout edge) -->

## When You Send a Move

For G0, G1, G2 and G3 moves from the console or a macro:

- A move that only crosses the zone is routed around it.
- A move that ends inside the zone is refused. ncSender shows **Movement Blocked** with the reason.

## When You Run a Job

- The move from where the spindle is to the program's first position goes around the zone and stays within machine travel.
- If that first position is inside the zone, ncSender stops before sending it and shows **Program Halted**. Move the machine clear, or fix the program's start position, then run it again.
- The visualizer warns you before you start if the program's own toolpath crosses the zone.

<!-- CAPTURE NEEDED: assets/images/features/keepout-job-detour.webp (Job approach going around the zone) -->

<!-- CAPTURE NEEDED: assets/images/features/keepout-job-halt.webp (Program Halted message) -->

## Homing With a Keepout Zone

XY homing takes the shortest path to the switches and can pass through the zone. With the zone on, pressing **Home** shows **Homing with Keepout Zone enabled** on every screen and on the pendant.

1. Make sure the path to the switches is clear.
2. Click **Continue**, or **Cancel** to stop.
3. Stay ready to press the E-stop.

Homing only Z does not ask. The same check runs in the [Calibration](calibration.md) Travel Limits guide.

<!-- CAPTURE NEEDED: assets/images/features/keepout-homing-gate.webp (Keepout homing warning) -->

## Limits and Known Gaps

- Keepout Zone is experimental. Always watch the first moves after setting it up.
- The zone is a flat rectangle in X and Y. Z is not checked, so the spindle can't pass over it even when high.
- Homing is not blocked, only warned about.
- Arcs are checked from start to end. Watch arcs that pass close to the zone.
- [Trace](trace.md) moves follow the same rules.

!!! note "For plugin authors"
    Starting a command with `$keepout_off` skips the keepout check for that one command. It is meant for plugins that must reach inside the zone, such as an ATC rack.
