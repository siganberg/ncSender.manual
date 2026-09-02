# Frequently Asked Questions

The questions that come up most often in support, grouped by where they bite.
Every answer here comes from a problem someone actually hit and confirmed fixed.

If your machine is new to ncSender, read **[Firmware and controller](#firmware-and-controller)**
first — most "ncSender doesn't work with my machine" reports turn out to be one
of the first two entries.

## Firmware and controller

### Probing or the tool setter fails with "Missing the expected G-code word value"

**Symptom.** `$tls`, a probe cycle, or a tool change stops part-way through and
the console fills with errors while echoing back the macro's own lines:

```
G65 P5 Q1 (switch to TLS probe source)
[Error 2] Missing the expected G-code word value or numeric value format is not valid.
#<return_units> = [20 + #<_metric>]
[Error 2] Missing the expected G-code word value or numeric value format is not valid.
```

Some firmware words it differently — an expected G-code command "is not
numeric", or `[Error 1] G-code words consist of a letter and a value` — and the
button for the operation stays outlined in red.

**Cause.** ncSender's probing and tool-setting routines are grblHAL macros that
use **expressions**: named parameters like `#<_metric>` and arithmetic in square
brackets. That is RS274/NGC expression syntax, and grblHAL understands it only
when the firmware was *compiled* with expression support. Without it the
controller sees a malformed word and rejects the line. The commands are correct;
the firmware cannot parse them.

**Fix.** Flash a grblHAL build that includes expressions:

- In the [grblHAL web builder](https://svn.io-engineering.com:8443/), open the
  **Advanced features** tab and tick **RS274 NGC expression support**.
- Or use a vendor firmware that already includes it.

Confirm with `$i`. Expression support appears as `EXPR` in the `NEWOPT` list:

```
[VER:1.1f.20260212:]
[OPT:VNMPZHS,128,1024,4,32]
[NEWOPT:ENUMS,RT+,HOME,ES,REBOOT,EXPR,TC,SED,RTC,ETH,YM,TMC=15,SD]
[FIRMWARE:grblHAL]
```

No `EXPR`, no probing macros — regardless of how recent the build is. This
catches people who built their own firmware and never ticked the box, and people
running a stock vendor build that predates it.

!!! warning "ncSender expects grblHAL, not classic GRBL"
    Classic GRBL has no expression support at all and is not tested. If `$i`
    reports plain `Grbl` rather than `[FIRMWARE:grblHAL]`, no firmware *option*
    will fix this — the controller needs grblHAL.

### The Home button is greyed out

**Symptom.** ncSender connects and jogging works, but the Home button is
disabled — even though the machine homes fine from its own controls or from
`$H` typed into the console.

**Cause.** Either homing is not enabled in the firmware, or ncSender never
received the firmware settings and so does not know that it is.

**Fix.**

1. Check `$22` has homing enabled (bit 1). See
   [grblHAL settings](controllers/grblhal.md).
2. If `$22` is correct, go to **Settings → Firmware → Reload**. ncSender reads
   `$22` from the controller once on connect; if that request timed out, the
   button stays disabled until the settings are re-read. This is the usual
   answer on a fresh install that "worked yesterday".

### The firmware settings page is blank

**Symptom.** **Settings → Firmware** shows nothing, or setting numbers with no
descriptions, while the machine stays connected and otherwise works.

**Cause.** ncSender caches what the controller reported into a `firmware.json`
so it does not re-parse it on every connect. If that cache is written while the
settings request is incomplete, the page keeps showing the empty copy.

**Fix.**

1. Click **Reload** on the firmware page — this re-fetches everything from the
   controller. It is display-only; nothing is written to the machine.
2. If it is still blank, quit ncSender, delete `firmware.json` from ncSender's
   application-data folder (or the whole `grblHAL` folder inside it), and start
   ncSender again.
3. Power-cycle the controller and reconnect.

### The toolpath sits outside the machine after homing

**Symptom.** After homing, the spindle is drawn outside the work envelope, a
loaded job appears out of bounds, or the machine looks mirrored along Y. The
same file and machine looked fine in another sender.

**Cause.** Two settings have to agree:

- **`$22` on the controller**, which is a bitmask rather than a simple on/off.
  Enabling homing is only bit 1. Bit 8 — *set machine origin to 0* — is what
  leaves the machine at a known zero after homing. Without it the machine homes
  but never establishes the origin the visualizer draws against.
- **Settings → General → machine home location**, which tells the visualizer
  *which corner* that origin is in.

ncSender draws a bounded envelope, so a mismatch shows up immediately. A sender
with an unbounded visualizer will not show it, which is why a machine that
looked correct elsewhere looks wrong here.

**Fix.**

1. Set **Settings → General → machine home location** to the corner the machine
   actually homes to.
2. Make sure `$22` includes the *set machine origin to 0* bit. A machine
   reporting `$22=3` shows this fault; `$22=75` resolves it.
3. Re-home and reload the file.

### Commands keep failing even when they're valid

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

## Connection and performance

### The controller is found but nothing responds

**Symptom.** The port is listed and ncSender says it is connected, but `$H` or
`$i` produce nothing and the spinner never stops.

**Fix, in order:**

- **Power-cycle the controller** and reconnect. A controller left in an error
  state accepts a connection and answers nothing.
- **On Windows with an SLB-EXT**, pick the **STM32** entry in the port list.
- **Reseat the cable** — including the tool setter and probe leads. An
  intermittent connection on one of those has been the cause more than once.
- **Try Ethernet** if the board has it. See the EMI entry below.

### The probe and tool setter indicators flicker while the spindle runs

**Symptom.** The indicators flash only while the spindle is running, jobs stall
part-way through with the router still turning, or the connection drops
mid-cut. Laser jobs on the same machine run without trouble.

**Cause.** Electrical noise, not software. The probe input is high impedance and
the spindle and VFD are the loudest things on the machine.

**Fix.**

- **Check what the probe wire touches.** A probe body or wire grounded to the
  machine frame makes the frame part of the probe circuit. One machine's stalls
  stopped entirely once the touch probe was isolated from the chassis.
- **Ground the dust collection**, and bond it to the same ground as everything
  else — a ground loop through a hose is a common cause of disconnects.
- **Fit ferrite chokes** on the spindle and VFD cabling.
- **Move the control computer away** from the VFD and spindle cable.
- **Prefer Ethernet over USB.** Several machines that drop USB the moment the
  spindle spins up run faultlessly over Ethernet.

### The display falls behind, then catches up in bursts

**Symptom.** The DRO and visualizer lag seconds behind the machine, queue up
what they missed, then catch up. The job itself cuts correctly.

**Fix.**

- **Check the temperature first.** A fanless mini PC or single-board computer
  that is thermally throttling behaves exactly like this, and the symptom
  follows the temperature of the shop. Adding even a small fan has resolved it.
- **Compare against a second view.** Open ncSender from a phone or laptop
  against the same machine. If the remote view keeps up and only the local
  display lags, the problem is local rendering rather than the connection.
- **Check GPU acceleration on non-standard hardware.** The prebuilt OS images
  are built and tested for the Raspberry Pi 5 and gControl; on other mini PCs
  the GPU may not be driven, leaving rendering to the CPU.

## Probing and tool setting

### The probe or tool setter shows no signal

**Symptom.** The probe has continuity and its own LED lights when touched, but
ncSender's probe and pin indicators never change.

**Fix.**

- **Invert the input**, then **reboot the controller** — the change is read at
  start-up. When an input is inverted correctly its pin indicator sits green
  while nothing is touching it.
- **Check the controller's own settings**, `$6` (invert probe pin) and `$10`
  (status report mask). ncSender only reports these; it does not set them.
- **After swapping a controller, re-apply your probe and VFD settings.** A
  replacement board arrives with defaults, and a probe that worked last week
  stops being seen with nothing visibly changed on the machine.

### The tool setter only touches once

**Symptom.** Material probing bounces twice, but the tool setter appears to
touch once and stop.

**Cause and answer.** It is two moves, and this is correct. The tool setter is
spring-loaded, so ncSender probes *toward* it and then moves slowly *away*
until contact is lost. That is faster and more repeatable than bouncing.
Material probing keeps the two-bounce style because not every workpiece is
sprung — bare aluminium has no give.

### Running a pen, drag knife or other tool with no length

**Symptom.** A pen plotter or drag knife has nothing for the tool length setter
to touch off, but the tool-change flow still wants to probe it.

**Fix.** Use tool zero. `M6 T0` unloads whatever tool is loaded and runs no
tool-length cycle:

1. Send `M6 T0` to unload any tool currently loaded.
2. Fit the pen or knife by hand.
3. Generate the program **with no tool changes in it at all**.
4. Load and run it.

If your CAM insists on emitting a tool change, `M6 T0` is safe to leave in the
file: with no tool loaded it continues into the program without probing.

### What order should I home, probe and change tools in?

Home, measure the tool setter, probe the workpiece, load the first tool — which
measures its length as part of the change — then start the job. Measuring the
tool setter with the first tool before you probe the workpiece is not necessary.

## Tool changers

### "Manual" still goes to the tool changer, or a big tool won't load

**Symptom.** Pressing **Manual** moves to the changer anyway, or a surfacing
bit too large for the magazine is treated as an automatic change.

**Cause.** **Virtual Magazine Size** in the plugin settings decides this. Any
tool number **inside** that range is an automatic change through the magazine;
anything **outside** it is a manual change and never goes near the changer.

**Fix.** Set Virtual Magazine Size to the number of slots you actually have —
eight is common with a Solo — and give oversized tools a number above it. A
2.5" surfacing bit numbered T12 with a magazine size of 8 is then handled as a
manual change automatically.

!!! note
    This is also why a magazine size of `1` behaves oddly: with one slot, a
    long press on Slot 1 is interpreted as *unload*, not *load*.

### The first press of MANUAL only unloads the tool

**Symptom.** Long-pressing **Manual** moves to the change position, asks you to
remove the tool, and then returns to where it started without asking for a new
one. Pressing again does the full sequence.

**Cause.** A highlighted slot button means *this is the tool currently loaded*,
and a long press on a highlighted button means **unload**. The first press did
exactly what you asked.

**Fix.** On first use, tell the controller what is actually in the spindle —
neither ncSender nor the plugin can know:

```
M61 Q0     ; nothing is loaded
M61 Q3     ; tool 3 is loaded
```

Once the controller's idea matches reality, the buttons behave predictably.

### Tool changes need a tool length setter

The Manual ToolChanger plugin requires a TLS — measuring the new tool is part of
the routine, not an optional step. Without it, Z zero moves every time you
change a bit. If you would rather handle changes entirely by hand, don't install
or enable a tool-changer plugin at all; ncSender then forwards `M6` straight to
the controller and your own `TC.macro` runs.

### The spindle plunges before it is up to speed

**Symptom.** The spindle plunges into the collet nut while still ramping, the
nut is not threaded properly, or the load is loud and rough.

**Cause and fix.** Two separate settings, and they must agree:

- **`$31` (minimum spindle speed).** If `$31` is higher than the load/unload
  speed, the spindle runs at `$31` instead. One machine with `$31=6000` ramped
  to 6000 rpm and plunged, damaging the spindle socket. Around **1000** is a
  typical value for tool changes.
- **Spindle At-Speed** in the plugin's Advanced tab. When on, the controller
  waits for the VFD to report it has reached speed before moving — which needs
  firmware that supports it, and a VFD that reports it. If tool changes fail
  right after a `G65 P6`, that call is what this option emits: either update the
  firmware or turn the option off.

Also check the VFD's own minimum, which overrides anything the controller asks
for — see below.

## Spindle and VFD

### The spindle won't run slow enough for tool changes

**Symptom.** The tool changer commands 1500 rpm but the spindle runs far
faster — 6000, or 7500 — and tool loads fail or sound wrong.

**Cause.** The VFD has its own minimum-speed limit and it wins over anything
grblHAL asks for.

**Fix.** Lower the minimum in the VFD itself:

- **Huanyang:** `PD011` sets the minimum frequency. One user set it to `016`
  (just under 1000 rpm).
- **Sienci 2.2 kW (black controller):** the parameters are locked until you set
  `F000 = 0`; then lower the minimum frequency (around `F011`).

Then re-check `$31` on the controller, as above.

### `M3 S24000` only reaches a lower RPM

**Symptom.** You command 24000 rpm, the VFD shows 400 Hz, but the spindle tops
out lower — 19200, say — and the VFD's own display never shows the number you
asked for.

**Cause.** The VFD's rated-motor-speed parameter, not ncSender or grblHAL. The
controller is asking for the right frequency; the VFD is scaling it to a motor
it thinks is slower.

**Fix.** On a Huanyang, set `PD144` to the motor's rated speed at 50 Hz — `3000`
for a 24000 rpm spindle. The commanded RPM then matches what the spindle does.

## Laser

### LightBurn output is mirrored on the machine

**Symptom.** The design looks right in LightBurn but comes out flipped 180° on
the workpiece, and you have been mirroring files by hand to compensate.

**Fix.** In LightBurn's device settings, turn **off** the **"CNC Machine"**
toggle. That option is for inverse-origin machines that home at the right rear;
with it on, LightBurn flips the job for a machine that does not need it.

### Laser power is much lower than commanded

**Symptom.** LightBurn is set to 100% but the laser controller reports far less
— 36%, say — and engraving is weak at any speed.

**Cause.** LightBurn's **S-value max** and the controller's maximum spindle
speed (`$30`) are different numbers, so a given S value means different things
at each end.

**Fix.** Make them match. Both `255` or both `1000` — 1000 gives finer power
resolution, which matters on higher-powered lasers.

## Plugins and generated G-code

### Cutting a circle, hole or pocket without opening CAM

**Use QuickCut.** Its **Circle** and **Rectangle** operations generate the
G-code from a dialog, and which mode you pick decides whether material in the
middle is removed:

- **Inner (perimeter)** — cuts around the inside of the line. On a through cut
  this frees a slug and leaves the centre uncut, which is what you want for a
  hole whose waste you intend to push out.
- **Inner (clearing)** — clears the whole area, so a blind pocket comes out
  flat-bottomed with nothing standing in the middle.
- **Outer** — cuts outside the line, for parting a disc or a rectangle off the
  stock.

Circles are cut with a helical entry and a final finish pass.

So if a hole comes out with a post in the middle, you asked for a perimeter cut
where you wanted a clearing one — switch the mode rather than changing the bit.

!!! note "QuickCut replaces the old ToolBench bore operation"
    Older videos and forum posts point at ToolBench for circular cuts. QuickCut
    is the current answer; ToolBench remains for surfacing and jointing.

### A plugin's settings dialog has no visible Save or Close button

At some window heights the dialog's buttons sit off the bottom of the screen —
1920×1080 at 100% is a common case. Press **Ctrl+-** to zoom out, or **F11** for
full screen, and they reappear.

## Files, settings and updates

### Backup and Restore doesn't include my firmware settings

Backup and Restore covers **ncSender's own** settings and plugins. Firmware
settings live on the controller, not in ncSender, and have their own
**Import** and **Export** buttons on the firmware page. Moving ncSender to a
different computer does not move — or lose — anything on the controller; the
new machine reads the settings back from it on connect.

### Importing a Vectric tool library

Vectric exports `.vtdb`, and importing that format is a **Pro** feature. The
Community edition's tool library import expects JSON.

When exporting JSON from Fusion 360, select the tools themselves — shift-click
the first and last in the list — rather than highlighting the library folder.
Exporting the folder produces a file the importer will not read.

### Upgrading from 0.3.x to 2.0.x

The [in-app updater](getting-started/software-updates.md) does not cross that
boundary; download and install 2.x manually. On Linux, remove the old version and its configuration first — leftover
0.3.x config has caused connections that appear to succeed and then do nothing.
