# Frequently Asked Questions

Answers to the questions that come up most often in support.

## Commands keep failing even when they're valid

**Symptom.** After a G-code error, the controller starts rejecting subsequent commands — either with the same error, or a generic "Unknown error" — even though those commands are correctly formatted and worked moments earlier.

**Common example.** You send a series of `M64` / `M65` (auxiliary output) commands. One fails. The next ones also fail, even though they're identical in shape to ones that just succeeded.

**Cause.** This is grblHAL behavior, not an ncSender bug. When grblHAL hits certain errors during a command stream, it can leave its parser and motion planner momentarily out of sync while it makes sure the machine is in a well-defined state. Until that state clears, subsequent commands that would normally succeed keep getting rejected — even benign ones like auxiliary output toggles. It's a safety-first choice by grblHAL: rather than accept commands into an ambiguous state, the controller stops accepting them at all.

**Fix.** Send a **single jog command** to nudge the controller back into a normal ready state:

```
$J=G21 G91 X1 F3000
```

That's a 1 mm relative jog on X at 3000 mm/min — small, fast, and predictable. Once it completes, subsequent commands are accepted normally.

If a 1 mm move isn't safe on your setup (near a fixture, small workspace), use a smaller step:

```
$J=G21 G91 X0.1 F1000
```

The specific movement doesn't matter — the point is to get one jog through the controller so it reinitialises its state.

**If the jog also fails,** the controller is likely in an **alarm** state (a stronger stop than an error state). Check the machine status in ncSender's status panel; you may need to send `$X` to unlock, then investigate what triggered the alarm.

## Probing or the tool setter fails with "Missing the expected G-code word value"

**Symptom.** `$tls`, a probe cycle, or a tool change stops part-way through and
the console fills with errors while echoing back the macro's own lines:

```
G65 P5 Q1 (switch to TLS probe source)
[Error 2] Missing the expected G-code word value or numeric value format is not valid.
#<return_units> = [20 + #<_metric>]
[Error 2] Missing the expected G-code word value or numeric value format is not valid.
```

Some controllers word it differently — an expected G-code command "is not
numeric" — and the button for the operation stays outlined in red.

**Cause.** ncSender's probing and tool-setting routines are grblHAL macros that
use **expressions**: named parameters like `#<_metric>` and arithmetic in
square brackets. That is RS274/NGC expression syntax, and grblHAL understands it
only when the firmware was *compiled* with expression support. Without it the
controller sees a malformed word and rejects the line. The commands are correct;
the firmware cannot parse them.

**Fix.** Flash a grblHAL build that includes expressions:

- In the [grblHAL web builder](https://svn.io-engineering.com:8443/), open the
  **Advanced features** tab and tick **RS274 NGC expression support**.
- Or use a vendor firmware that already includes it — Sienci's AltMill / SLB
  builds do.

Confirm it took by sending `$i`. Expression support shows up as `EXPR` in the
`NEWOPT` list:

```
[VER:1.1f.20260212:]
[OPT:VNMPZHS,128,1024,4,32]
[NEWOPT:ENUMS,RT+,HOME,ES,REBOOT,EXPR,TC,SED,RTC,ETH,YM,TMC=15,SD]
[FIRMWARE:grblHAL]
```

!!! warning "ncSender expects grblHAL, not classic GRBL"
    Classic GRBL has no expression support at all, and ncSender is not tested
    against it. If `$i` reports plain `Grbl` rather than `[FIRMWARE:grblHAL]`,
    no firmware option will fix this — the controller needs grblHAL.

## The toolpath sits outside the machine after homing

**Symptom.** After homing, the spindle is drawn outside the work envelope in the
visualizer, a loaded job appears out of bounds, or the machine looks mirrored
along Y. The same file and the same machine looked fine in another sender.

**Cause.** Two settings have to agree:

- **`$22` in the controller**, which is a bitmask, not a simple on/off. Enabling
  homing is only bit 1. Bit 8 — *set machine origin to 0* — is what leaves the
  machine at a known zero after a homing cycle. Without it the controller homes
  but never establishes the origin the visualizer is drawing against.
- **Settings → General → machine home location** in ncSender, which tells the
  visualizer *which corner* that origin is in.

ncSender draws a bounded envelope, so a mismatch is visible immediately. A
sender with an unbounded visualizer will not show it, which is why a machine
that looked correct elsewhere can look wrong here.

**Fix.**

1. Set **Settings → General → machine home location** to the corner the machine
   actually homes to — Front-Right, Back-Left, and so on.
2. Check `$22` includes the *set machine origin to 0* bit. A machine reporting
   `$22=3` (homing enabled, single-axis commands) shows this fault; `$22=75`
   adds origin-zeroing and lock override and resolves it. See
   [grblHAL settings](controllers/grblhal.md).
3. Re-home and reload the file.

## The Home button is greyed out

**Symptom.** ncSender connects, jogging works, but the Home button is disabled —
even though the machine can be homed from its own controls.

**Cause.** Homing is not enabled in the firmware. ncSender takes `$22` as the
statement of whether the machine can home, and will not offer a homing cycle to
a controller that says it cannot.

**Fix.** Enable homing on the controller (`$22`, bit 1), then reconnect. If `$i`
reports classic GRBL rather than grblHAL, see the expression note above — that
machine needs a firmware change, not a setting change.

## Boring leaves a post in the middle of the hole

**Symptom.** ToolBench's bore operation cuts a clean circle at the diameter you
asked for, but the middle of the hole is left standing.

**Cause.** That is what boring is. The operation is a **helical cut around the
circumference** — it is meant to cut a through hole or free a disc, leaving a
slug. It is not a pocketing routine and does not clear material.

**Fix.** Depends what you actually want:

- **A through hole, or a disc** — this is correct. The slug drops out.
- **A blind, flat-bottomed hole** — use a bit at least **half the hole
  diameter**, so the helix overlaps at the centre and no post is left.
- **A true pocket** — use your CAM software. ncSender does not generate
  clearing toolpaths.

## Running a pen, drag knife or other tool with no length

**Symptom.** A pen plotter, drag knife or similar has nothing for the tool
length setter to touch off, but the tool-change flow still wants to probe it.

**Fix.** Use tool zero. `M6 T0` unloads whatever tool is loaded and runs no
tool-length cycle:

1. Send `M6 T0` to unload any tool that is currently loaded.
2. Fit the pen or knife by hand.
3. Generate the program **with no tool changes in it at all**.
4. Load and run it.

If your CAM insists on emitting a tool change, `M6 T0` is safe to leave in the
file: with no tool loaded it simply continues into the program without probing.
