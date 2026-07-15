# VFD Setup (RS485 / ModBus) for grblHAL

Getting a VFD talking to grblHAL over RS485 is the single most common
"why won't my spindle start?" problem people hit. It's not an ncSender
issue — ncSender just relays whatever the controller says — but if the
handshake between grblHAL and the VFD isn't right, nothing will work.

This page collects the grblHAL settings that matter and the matching VFD
parameters for the four VFDs most people run into on hobby / small-shop
CNC routers.

!!! warning "Verify against your VFD manual"
    VFD parameter numbers (`PD…`, `P0…`, `H00.…` etc.) **vary by brand,
    revision, and even year of manufacture** — the same "H100 Zhong Hua
    Jiang" from two different sellers can ship with different code tables.
    The values below match the most common builds, but always cross-check
    the manual that came with your VFD before writing settings. If a
    parameter is locked, look for a "parameter lock" or "advanced menu"
    code in the manual.

## The grblHAL settings you'll touch

ncSender surfaces all of these in the **Settings** panel — you can search
by number. Setting numbers that only appear when a ModBus VFD plugin is
compiled into your grblHAL build:

| Setting | Name | Notes |
|--------:|------|-------|
| `$395` | **Default spindle** at startup | Selects which spindle driver is active on boot (PWM, PWM2, Huanyang v1, Huanyang P2A, Durapulse GS20, Yalang YS620, MODVFD, H-100, Nowforever). Requires a hard reset after changing. |
| `$360` | **ModBus address** for the single VFD spindle | Default `1`. Must match the address configured on the VFD side. |
| `$340` | **Spindle at-speed tolerance** (%) | Default `0` (disabled). If `>0`, grblHAL raises **ALARM 14** if the spindle doesn't reach the commanded RPM within `±$340%` inside a 4-second window. `10` is a sensible starting value once the VFD is proven. |
| `$461` | **RPM ↔ Hz relationship** | Default `60` (60 RPM per Hz — a 2-pole motor). Set to `30` for a 4-pole motor. Used by drivers that compute frequency from RPM (GS20, YL-620 and similar). |
| `$462`–`$471` | **MODVFD register overrides** | Only relevant when `$395 = MODVFD`. Lets you point the generic ModBus driver at any VFD's registers (run/stop, set-frequency, read-frequency, CW/CCW/stop command words, and RPM ratios). Defaults match the most common register layout. |
| `$476`–`$479` | **ModBus address** for spindles 0–3 | Only used when you have multiple VFD spindles on the bus. For a single-spindle machine, ignore these and use `$360`. |

!!! tip "Baud rate"
    Baud rate is exposed as a setting on most grblHAL builds — search
    "modbus" in the Settings panel and you'll see it (numbering varies
    by driver; commonly `$374` or nearby). The default is usually
    `19200 8N1`. **Whatever you set here must match the VFD side.**
    9600 is bulletproof; 19200 and 38400 also work fine on short runs.

## Per-VFD picks

### Huanyang v1 (HY-series — the yellow-face model)

Pick this if your VFD's front panel says "Huanyang" and uses `PD…` parameter
codes (e.g. `PD001`).

| grblHAL setting | Value |
|--:|--|
| `$395` | `Huanyang v1` |
| `$360` | `1` |
| `$340` | `10` (once the spindle is proven) |
| Baud | `9600` (matches PD164=2 below) |

**Typical VFD parameters** — always verify against your PD-code manual:

| VFD parameter | Value | Meaning |
|--:|--|--|
| `PD001` | `2` | Run command source = RS485 |
| `PD002` | `2` | Frequency source = RS485 |
| `PD163` | `1` | ModBus address = 1 (matches `$360`) |
| `PD164` | `2` | Baud = 9600 (`1`=4800, `2`=9600, `3`=19200) |
| `PD165` | `3` | 8N1 RTU |

### Huanyang P2A (newer, black-face model)

Newer Huanyang. Uses `P…` codes instead of `PD…`. Parameter numbers are
different — check the manual.

| grblHAL setting | Value |
|--:|--|
| `$395` | `Huanyang P2A` |
| `$360` | `1` |
| `$340` | `10` |
| Baud | Match VFD side (typically 9600 or 19200) |

**On the VFD side:** enable RS485 control (usually in the `P00.xx` group),
set the ModBus address to `1`, and set the baud to match. Exact code
numbers vary by firmware revision — refer to your manual.

### H100 (Zhong Hua Jiang / HuaJiang and rebrands)

Pick this if your VFD shows "H100-1.5C2-1B" or similar and uses `H00.…`
parameter codes. Common with 1.5 kW / 2.2 kW air-cooled spindle kits.

| grblHAL setting | Value |
|--:|--|
| `$395` | `H-100` |
| `$360` | `1` |
| `$340` | `10` |
| Baud | `9600 8N1` |

**On the VFD side:** enable RS485 control mode and set the ModBus address
to `1`. Baud usually defaults to 9600 — check the H00.xx group. If the
motor doesn't spin at all, first make sure the VFD works in local (panel)
mode with the correct max-frequency and pole-count for your spindle
before troubleshooting RS485.

### PwnCNC (MODVFD)

PwnCNC ships a VFD pre-configured for RS485 control. In grblHAL you drive
it via the generic MODVFD spindle driver, but **PwnCNC uses a different
register map than grblHAL's MODVFD defaults** — you have to write the
per-VFD `$462`–`$471` values explicitly. Skipping this step is the most
common "spindle spins but ncSender shows wrong RPM / won't stop" complaint.

| grblHAL setting | Value | Notes |
|--:|--|--|
| `$395` | `MODVFD` | Numeric value depends on which spindle drivers your grblHAL build has compiled in — pick MODVFD in the ncSender Settings picker; the number underneath will be whatever's correct for that build. |
| `$476` | `1` | ModBus address for spindle 0 (newer multi-spindle builds use `$476` instead of `$360`). Match the address on the VFD. |
| `$374` | `3` | ModBus baud rate — `3` = 19200 on PwnCNC's shipped VFD. |
| `$375` | `50` | ModBus rx timeout (ms). |
| `$340` | `0.0` | PwnCNC ships with **at-speed disabled**. Raise later once the setup is proven — the safe default is `10` (percent). |

**PwnCNC register map** — set these exactly, not the grblHAL defaults:

| Setting | Purpose | PwnCNC value | grblHAL default (wrong for PwnCNC) |
|--:|--|--:|--:|
| `$462` | Run/stop register | `40960` | `8192` |
| `$463` | Set-frequency register | `40961` | `8193` |
| `$464` | Get-frequency register | `36864` | `8451` |
| `$465` | CW command word | `1` | `18` |
| `$466` | CCW command word | `2` | `34` |
| `$467` | Stop command word | `6` | `1` |
| `$468` | RPM multiplier (write) | `25.0` | `50` |
| `$469` | RPM divider (write) | `60.0` | `60` |
| `$470` | RPM multiplier (read) | `60.0` | `60` |
| `$471` | RPM divider (read) | `10.0` | `100` |

!!! tip "Where these came from"
    Cross-referenced against a working PwnCNC-on-AltMill grbl dump —
    [`siganberg/cnc-stuff` → `AltMill/stable/firmware-settings-…-PwnCNC-VFD.grbl`](https://github.com/siganberg/cnc-stuff/blob/main/AltMill/stable/firmware-settings-2025-12-04.-PwnCNC-VFD.grbl).
    If your grblHAL build ships a different `$471` default, the RPM
    displayed in ncSender will be off by 10× — that's the tell.

## Wiring cheat-sheet

- **Two signal wires** — `A+` and `B-`. Some VFDs label them `485+` /
  `485-` or `RS+` / `RS-`; they're the same thing. Keep the pair
  consistent end to end.
- **Common ground** — tie the RS485 GND on the controller side to the
  VFD's RS485 GND (not the spindle motor ground). Missing this reference
  causes intermittent packets and phantom ALARM 14s.
- **Twisted-pair, shielded** — RS485 is a differential bus; a twisted
  pair rejects noise. Bond the shield to ground on **one end only**
  (usually the controller end).
- **Termination** — a `120 Ω` resistor across A/B at the far end of the
  bus. Most VFDs have this built in, enabled via a DIP switch or jumper
  — check the VFD manual before adding one externally.
- **Cable routing** — keep RS485 physically separated from the spindle
  power cable. Even a foot of parallel run inside a cable chain can
  induce enough noise to break communication when the spindle ramps.

## Verifying it works

1. Set `$395` to the correct driver and **hard-reset the controller**.
2. Send `M3 S1000` from the ncSender console. The VFD should show the
   set frequency ramp up and the spindle should start.
3. If the spindle starts but ncSender's spindle indicator doesn't update
   (or you see `ALARM 14`): the write worked but the *read* isn't — check
   the ModBus address (`$360`) and baud match on both sides.
4. If nothing happens: check wiring (A/B not swapped, ground bonded)
   before assuming settings are wrong. RS485 has no error message for
   "no reply" — it just goes quiet.
5. Once stable, raise `$340` from `0` to `10` to enable at-speed
   monitoring. Program events like G-code tool changes rely on this to
   wait for the spindle to actually be at RPM before continuing.

## Where to go deeper

- **grblHAL VFD plugin source and per-driver docs** —
  [`grblHAL/Plugins_spindle`](https://github.com/grblHAL/Plugins_spindle).
- **PrintNC's VFD control wiki** —
  [wiki.printnc.info/en/grbl/vfd-control](https://wiki.printnc.info/en/grbl/vfd-control).
- **grblHAL extended-settings reference** —
  [Additional or extended settings](https://github.com/grblHAL/core/wiki/Additional-or-extended-settings).
