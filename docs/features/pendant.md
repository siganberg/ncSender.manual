# Pendant

The ncSender Wireless Pendant is a handheld controller for your CNC machine. It
gives you a live position readout and hands-on control of jogging, zeroing,
homing, and running jobs — right at the machine, without reaching for the
keyboard.

It connects to ncSender wirelessly through a small USB dongle, so you can walk
around the machine while you work.

## Hardware

<!-- TODO: Photo of pendant and dongle hardware -->
![Pendant and dongle](../assets/images/features/pendant-hardware.png){ .placeholder }

- **Pendant** — a battery-powered handheld with a touch display, a jog knob
  (rotary encoder), three soft buttons, and a power button.
- **Dongle** — a small USB stick that plugs into the computer running ncSender
  and links to the pendant wirelessly.

## Getting connected

1. Plug the dongle into the computer running ncSender.
2. Power on the pendant (hold the power button).
3. The pendant and dongle pair automatically and the status bar shows the
   connection icon.

Once connected, the pendant mirrors your machine state in real time and any
button you press acts on the machine immediately.

!!! tip "First-time pairing"
    If the pendant and dongle have never been paired, open the **Setup** screen
    on the pendant and choose **ESP-NOW → Scan** to pair them. After the first
    pairing the connection is remembered and reconnects on its own.

![Pendant ESP-NOW pairing screen](../assets/images/features/pendant-pairing-screen.png)

The pairing screen shows whether the pendant is currently paired. Press
**Scan** to search for a dongle; press **&lt;Back** to return to Setup.

## The Jog screen

This is the pendant's home screen — your live readout and jogging controls.

![Pendant jog screen](../assets/images/features/pendant-jog-screen.png)

**Status bar (top)** shows, left to right: the active workspace (e.g. `G54`),
the machine status (`IDLE`, `RUN`, `HOLD`, `ALARM`, …), the connection icon,
and the battery level.

**Position readout** lists each axis (X, Y, Z) with its work position in large
type and the machine position in smaller type underneath. The highlighted axis
is the one the jog knob will move; the small number next to each axis label
(e.g. `1.00`) is the current jog step size.

**Turn the jog knob** to move the selected axis. The step size sets how far each
click travels; turning faster moves faster.

**Buttons:**

- **HOME** — run the homing cycle.
- **XY0 / X0 / Y0 / Z0** — zero the work position for those axes at the current
  location.

**Footer** — the three soft buttons below the screen. On the Jog screen they
select the axis / step and switch between screens (**Prev / Step-Zero / Next**).

## The Job screen

When you start a program, the pendant automatically switches to the Job screen
so the controls you need while cutting are front and center.

![Pendant job screen](../assets/images/features/pendant-job-screen.png)

- **Feedrate / Spindle** (top) — the live feed rate and spindle speed the
  machine is actually running.
- **Feed Override / Spindle Override** — turn the jog knob to trim feed rate or
  spindle speed on the fly. Select which slider to adjust with the footer
  buttons; each shows the current override percentage.
- **Cycle** — start / resume the program.
- **Pause** — feed-hold the running program.
- **Stop** — stop the program.

When the job finishes or you stop it, the pendant returns to the Jog screen
automatically.

## The Info screen

The Info screen shows the pendant's current connection type, firmware version,
and device name. It's the quickest way to check which firmware you're running —
useful before and after a firmware update. Press **Setup** here to open the
Setup screen.

![Pendant info screen](../assets/images/features/pendant-info-screen.png)

## The Setup screen

The Setup screen holds the pendant's own preferences.

![Pendant setup screen](../assets/images/features/pendant-setup-screen.png)

- **Show G-Code** — when on, jog and command output from the pendant is echoed
  in ncSender's console. Off keeps the console quiet.
- **Accuracy Mode** — chooses how the jog knob behaves. On gives precise,
  step-locked movement; off gives quicker continuous jogging.
- **Idle Shutdown** — how long the pendant waits, with no activity, before it
  powers itself off to save battery. Choose from **5 to 30 minutes**. Turn the
  jog knob (or tap the row) to change the value.
- **ESP-NOW** — pair or unpair with a dongle.

!!! note "Idle shutdown only runs on battery"
    While the pendant is plugged into USB (or charging), it stays on
    indefinitely. The idle timer only starts once it's running on battery, and
    any touch, button, or knob movement resets it.

## Managing the pendant from ncSender

Open the **Pendant** dialog in ncSender to manage the connection and firmware.

![ncSender pendant dialog](../assets/images/features/pendant-ncsender-dialog.png)

- **Connection** — shows how the pendant is connected (USB or the ESP-NOW
  dongle), the port, and its current firmware version.
- **Firmware Update** — ncSender checks for new pendant firmware and shows when
  an update is available. Press **Update Now** to flash it over the existing
  connection — no cables or tools required. **Flash from file** lets you install
  a specific firmware `.bin` instead.
