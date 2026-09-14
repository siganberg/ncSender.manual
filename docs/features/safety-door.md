# Safety Door

ncSender lets you jog slowly with the safety door open, and blocks commands that aren't safe with the door open.

The safety door checks run when the controller reports the door pin or a Door state. The toolbar shows **Door Open** and the **Door** pin light turns on.

## Controlled Jogging

You can jog slowly with the door open, for setup and inspection:

- Jogs are slowed to 1000 mm/min. This limit is fixed.
- G1, G2 and G3 moves are also slowed to 1000 mm/min.
- Plain `G0` rapid moves are blocked.
- Every command goes through these checks, from the screen, the pendant, macros and the console.

<!-- CAPTURE NEEDED: assets/images/features/safety-door-jog.webp (Jogging with the door open) -->

## Blocked Commands

With the door open, ncSender refuses:

- **G0 rapid moves**: the terminal shows "G0 rapid not allowed in Door state".
- **Spindle start (M3/M4)**: the terminal shows "Spindle start not allowed in Door state".
- **Trace**: the **Trace** button is greyed out.

<!-- CAPTURE NEEDED: assets/images/features/safety-door-blocked.webp (Spindle start blocked) -->

- **Tool change (M6)** that doesn't come from a running job, for example from a macro or a tool button. **Pro only.**

## Terminal Feedback

When ncSender slows a command, the terminal shows the old and new feed rate:

```
$J=G91 X10 F1000 (F5000 -> F1000, Door safety)
```

## Automatic Spindle Stop

**Pro only.** If you open the door while the spindle is running and no job is running, ncSender sends `M5` to stop the spindle. The terminal shows `M5 (safety door — spindle stop)`.

This only happens when the grblHAL setting `$61` has **Ignore when idle** turned on. Without it, the controller handles the door itself.

<!-- CAPTURE NEEDED: assets/images/features/safety-door-spindle-stop.webp (Spindle stopped by the door) -->

## When the Door Closes

When you close the door, a Door state becomes Hold. Press **Resume** (Cycle Start) to continue the job.

## Door Alarms

- **Safety door open**: close the door, then press **Unlock**.
- **Door opened during homing**: close the door, unlock, then home again.

<!-- CAPTURE NEEDED: assets/images/features/safety-door-alarm.webp (Safety door alarm) -->

See [Alarms](../settings/alarms.md) for all alarms.

## Configuration

`$61` controls how grblHAL handles the door. It has several options. **Ignore when idle** lets you open the door while the machine is idle without a hold. Set it in **Settings → Firmware**. See [Firmware Settings](../settings/firmware.md).

The slow jog and blocked commands work whatever `$61` is set to.

!!! tip "Park on Pause"
    **Settings → General → Park on Pause** lifts and parks the spindle when a job pauses. It needs the grblHAL parking settings to be set up first.
