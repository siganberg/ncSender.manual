# ncWirelessIO

ncWirelessIO gives ncSender **four inputs**, **four switched outputs** and a
**machine-status LED strip port**, linked wirelessly through the
[Wireless USB &rarr;](wireless-usb.md). Mount it at the tool changer and wire
the sensors and the air solenoid there, instead of running cables back to the
control box. Your controller's own inputs and outputs stay free.

It is built for ncSender's [Pneumatic ATC &rarr;](../plugins/pneumatic-atc.md)
plugin: a drawbar sensor, a tool sensor and the clamp solenoid. The two spare
inputs and three spare outputs are yours for anything else.

!!! note "Coming soon"
    ncWirelessIO is in development. Pneumatic ATC support for it arrives with
    the plugin's ncWirelessIO profile.

![ncWirelessIO in its case](../assets/images/accessories/ncwirelessio-board.webp)

## Hardware

- **4 inputs**, optically isolated, for 3.3–24 V signals. NPN sensors, PNP
  sensors and plain switches all work.
- **4 switched outputs**, each set to **5, 12 or 24 V** with its own jumper.
  Short-circuit and over-temperature protected.
- **LED strip port** for a **12 V WS2811** strip. It shows machine state the
  same way the [RGB LED &rarr;](smart-rgb-led.md) does.
- **24–48 V DC** supply, reverse-polarity protected.
- **USB-C** for set-up and fast firmware updates.
- Pairs with the [Wireless USB &rarr;](wireless-usb.md), the same one the
  pendant, AutoDustBoot and RGB LED use.

!!! warning "Wireless USB is required"
    ncWirelessIO only talks to ncSender through the
    [Wireless USB &rarr;](wireless-usb.md).

## What's on the board

![The ncWirelessIO board](../assets/images/accessories/ncwirelessio-board-top.webp)

Everything is labelled on the board. Look for these labels:

| Label on the board | What it is |
|---|---|
| **PWR IN** `+` `−` | Power in, 24–48 V DC |
| **PWR OUT** `+` `−` | The same supply passed on to another device (optional) |
| **INPUT 1** … **INPUT 4** | Input terminals, 3 screws each: `G` `S` `V` |
| **INPUT SENSOR V** with `5` `12` `24` | Jumper: the voltage on every input's `V` screw |
| **FUSE** | Resettable fuse for the sensor supply |
| **INPUT COM** with `V+` `GND` | Jumper: NPN or PNP sensors |
| **OUT1** … **OUT4** with `5` `12` `24` | One jumper per output: that output's voltage |
| Output terminals `+` `−` | One 2-screw terminal per output |
| **GND** | Three spare ground screws |
| **LED STRIP** `12V` `DAT` `GND` | Plug for the LED strip |
| **USB** | USB-C |
| **BOOT** | Pairing button |

The underside repeats the terminal names (**INPUT 1** … and `V S G`), so you can
check your wiring with the board turned over.

## Power

Connect a **24–48 V DC** supply to **PWR IN**: `+` to the supply's positive,
`−` to its negative.

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 670 160" width="670" role="img" aria-label="Power supply to PWR IN; PWR OUT passes the same supply on to another device" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="20" y="40" width="150" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="95" y="70" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Power supply</text><text x="95" y="90" text-anchor="middle" font-size="11" fill="#9ca3af">24–48 V DC</text><rect x="250" y="48" width="80" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="273" cy="66" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="267" y1="66" x2="279" y2="66" stroke="currentColor" stroke-width="1.5"/><rect x="265" y="82" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="273" y="120" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">+</text><circle cx="307" cy="66" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="301" y1="66" x2="313" y2="66" stroke="currentColor" stroke-width="1.5"/><rect x="299" y="82" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="307" y="120" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">−</text><text x="290.0" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">PWR IN</text><path d="M170,58 L273,58" fill="none" stroke="#ef4444" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170,90 L215,90 L215,40 L307,40 L307,57" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="390" y="48" width="80" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="413" cy="66" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="407" y1="66" x2="419" y2="66" stroke="currentColor" stroke-width="1.5"/><rect x="405" y="82" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="413" y="120" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">+</text><circle cx="447" cy="66" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="441" y1="66" x2="453" y2="66" stroke="currentColor" stroke-width="1.5"/><rect x="439" y="82" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="447" y="120" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">−</text><text x="430.0" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">PWR OUT</text><rect x="520" y="40" width="130" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/><text x="585" y="70" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Next device</text><text x="585" y="90" text-anchor="middle" font-size="11" fill="#9ca3af">(optional)</text><path d="M413,57 L413,30 L500,30 L500,60 L520,60" fill="none" stroke="#ef4444" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M447,57 L447,38 L492,38 L492,90 L520,90" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>
<figcaption>PWR IN from the supply. PWR OUT can feed another device.</figcaption>
</figure>

- Wired backwards, the board stays off and nothing is damaged. Swap the wires.
- **PWR OUT** passes your supply straight on, exactly as it is wired, so you
  can power another accessory (an RGB LED or AutoDustBoot controller) without
  a second run back to the supply. It is not fused or protected by
  ncWirelessIO, so check the polarity before you connect the next device.
- With a **24 V** supply, outputs set to `24` get slightly less than 24 V. Use
  a 36 V or 48 V supply if a 24 V load needs a full 24 V.
- USB-C alone powers the brain of the board, enough to set it up and update it.
  Inputs, outputs and the LED strip need **PWR IN**.

## Inputs

Each input has a 3-screw terminal:

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 180 125" width="180" role="img" aria-label="Input terminal pins: G ground, S signal, V sensor supply" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="30" y="20" width="114" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="53" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="47" y1="38" x2="59" y2="38" stroke="currentColor" stroke-width="1.5"/><rect x="45" y="54" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="53" y="92" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">G</text><circle cx="87" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="81" y1="38" x2="93" y2="38" stroke="currentColor" stroke-width="1.5"/><rect x="79" y="54" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="87" y="92" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">S</text><circle cx="121" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="115" y1="38" x2="127" y2="38" stroke="currentColor" stroke-width="1.5"/><rect x="113" y="54" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="121" y="92" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">V</text><text x="87.0" y="114" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">INPUT 1 … INPUT 4</text></svg>
<figcaption>Every input terminal is the same.</figcaption>
</figure>

| Screw | Name | Wire it to |
|---|---|---|
| `G` | Ground | The sensor's ground or `0 V` wire |
| `S` | Signal | The sensor's output wire, or one side of a switch |
| `V` | Sensor supply | The sensor's power wire, or the other side of a switch |

Each input has a **blue light** near its terminal. It is on while the input
is active, so you can check a sensor without opening ncSender.

### Sensor supply jumper (INPUT SENSOR V)

The `V` screw on all four inputs carries the same voltage. Choose it with the
**INPUT SENSOR V** jumper: put the shunt between the centre pin and the pin
printed `5`, `12` or `24`.

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 560 150" width="560" role="img" aria-label="Voltage selector: the shunt joins the centre pin to the pin printed 5, 12 or 24" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><text x="77" y="22" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">5 V</text><rect x="47" y="33" width="26" height="60" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="51" y="37" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="60" cy="46" r="3.5" fill="currentColor"/><rect x="51" y="71" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="60" cy="80" r="3.5" fill="currentColor"/><rect x="51" y="105" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="60" cy="114" r="3.5" fill="currentColor"/><rect x="85" y="71" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="94" cy="80" r="3.5" fill="currentColor"/><rect x="85" y="37" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="94" cy="46" r="3.5" fill="currentColor"/><rect x="85" y="105" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="94" cy="114" r="3.5" fill="currentColor"/><text x="36" y="51" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">5</text><text x="34" y="119" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">12</text><text x="126" y="85" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">24</text><text x="267" y="22" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">12 V</text><rect x="237" y="67" width="26" height="60" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="241" y="37" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="250" cy="46" r="3.5" fill="currentColor"/><rect x="241" y="71" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="250" cy="80" r="3.5" fill="currentColor"/><rect x="241" y="105" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="250" cy="114" r="3.5" fill="currentColor"/><rect x="275" y="71" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="284" cy="80" r="3.5" fill="currentColor"/><rect x="275" y="37" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="284" cy="46" r="3.5" fill="currentColor"/><rect x="275" y="105" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="284" cy="114" r="3.5" fill="currentColor"/><text x="226" y="51" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">5</text><text x="224" y="119" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">12</text><text x="316" y="85" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">24</text><text x="457" y="22" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">24 V</text><rect x="427" y="67" width="60" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="431" y="37" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="440" cy="46" r="3.5" fill="currentColor"/><rect x="431" y="71" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="440" cy="80" r="3.5" fill="currentColor"/><rect x="431" y="105" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="440" cy="114" r="3.5" fill="currentColor"/><rect x="465" y="71" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="474" cy="80" r="3.5" fill="currentColor"/><rect x="465" y="37" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="474" cy="46" r="3.5" fill="currentColor"/><rect x="465" y="105" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="474" cy="114" r="3.5" fill="currentColor"/><text x="416" y="51" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">5</text><text x="414" y="119" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">12</text><text x="506" y="85" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">24</text></svg>
<figcaption>Follow the numbers printed beside the pins.</figcaption>
</figure>

Pick the voltage your sensors are rated for. Most inductive proximity sensors
take 12–24 V. The sensor supply is protected by a resettable fuse (**FUSE**). It
cuts out on a short and comes back once the short is removed.

### NPN or PNP (INPUT COM)

The **INPUT COM** jumper sets the sensor type for all four inputs:

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 600 140" width="600" role="img" aria-label="INPUT COM jumper: V+ side for NPN sensors, GND side for PNP sensors and switches" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><text x="142" y="34" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Shunt on V+ and COM</text> <rect x="81" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="90" cy="60" r="3.5" fill="currentColor"/><text x="90" y="88" text-anchor="middle" font-size="12" fill="currentColor">V+</text><rect x="133" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="142" cy="60" r="3.5" fill="currentColor"/><text x="142" y="88" text-anchor="middle" font-size="12" fill="currentColor">COM</text><rect x="185" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="194" cy="60" r="3.5" fill="currentColor"/><text x="194" y="88" text-anchor="middle" font-size="12" fill="currentColor">GND</text><rect x="77" y="47" width="78" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="81" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="90" cy="60" r="3.5" fill="currentColor"/><rect x="133" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="142" cy="60" r="3.5" fill="currentColor"/><rect x="185" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="194" cy="60" r="3.5" fill="currentColor"/><text x="142" y="118" text-anchor="middle" font-size="12" fill="#9ca3af">NPN sensors (they switch to ground)</text><text x="432" y="34" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Shunt on COM and GND</text> <rect x="371" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="380" cy="60" r="3.5" fill="currentColor"/><text x="380" y="88" text-anchor="middle" font-size="12" fill="currentColor">V+</text><rect x="423" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="432" cy="60" r="3.5" fill="currentColor"/><text x="432" y="88" text-anchor="middle" font-size="12" fill="currentColor">COM</text><rect x="475" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="484" cy="60" r="3.5" fill="currentColor"/><text x="484" y="88" text-anchor="middle" font-size="12" fill="currentColor">GND</text><rect x="419" y="47" width="78" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="371" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="380" cy="60" r="3.5" fill="currentColor"/><rect x="423" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="432" cy="60" r="3.5" fill="currentColor"/><rect x="475" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="484" cy="60" r="3.5" fill="currentColor"/><text x="432" y="118" text-anchor="middle" font-size="12" fill="#9ca3af">PNP sensors and plain switches</text></svg>
<figcaption>One setting for all four inputs.</figcaption>
</figure>

| Shunt position | Use it for |
|---|---|
| **V+** and **COM** | **NPN** sensors (they switch their output to ground) |
| **COM** and **GND** | **PNP** sensors (they switch their output to the supply), and plain switches |

Mixing types? Use the setting that suits most of them. A plain switch works on
either setting if you wire it between `S` and the right screw: `S`–`V` with
**COM** on **GND**, or `S`–`G` with **COM** on **V+**.

### Sample wiring

=== "NPN sensor"

    <figure class="wio-fig" markdown>
    <svg class="wio-svg" viewBox="0 0 460 290" width="460" role="img" aria-label="NPN sensor wiring" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="20" y="20" width="150" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="95" y="50" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">NPN sensor</text><text x="95" y="70" text-anchor="middle" font-size="11" fill="#9ca3af">3-wire, e.g. inductive prox</text><rect x="290" y="130" width="114" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="313" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="307" y1="148" x2="319" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="305" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="313" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">G</text><circle cx="347" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="341" y1="148" x2="353" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="339" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="347" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">S</text><circle cx="381" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="375" y1="148" x2="387" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="373" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="381" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">V</text><text x="347.0" y="224" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">INPUT 1</text><path d="M170,38 L250,38 L250,100 L381,100 L381,139" fill="none" stroke="#a16207" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170,55 L235,55 L235,112 L347,112 L347,139" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170,72 L220,72 L220,124 L313,124 L313,139" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="196" y="33" text-anchor="middle" font-size="11" fill="#a16207">brown</text><text x="196" y="51" text-anchor="middle" font-size="11" fill="#6b7280">black</text><text x="196" y="68" text-anchor="middle" font-size="11" fill="#3b82f6">blue</text><text x="92" y="146" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">INPUT COM</text><rect x="27" y="157" width="78" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="31" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="170" r="3.5" fill="currentColor"/><text x="40" y="198" text-anchor="middle" font-size="12" fill="currentColor">V+</text><rect x="83" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="92" cy="170" r="3.5" fill="currentColor"/><text x="92" y="198" text-anchor="middle" font-size="12" fill="currentColor">COM</text><rect x="135" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="144" cy="170" r="3.5" fill="currentColor"/><text x="144" y="198" text-anchor="middle" font-size="12" fill="currentColor">GND</text><text x="230" y="280" text-anchor="middle" font-size="12" fill="#9ca3af">Sensor supply jumper set to the sensor's voltage (often 24 V or 12 V).</text></svg>
    </figure>

    - **INPUT COM** on **V+** and **COM**.
    - **INPUT SENSOR V** on the sensor's voltage.
    - Brown to `V`, black to `S`, blue to `G` (standard sensor colours; check
      your sensor's label).

=== "PNP sensor"

    <figure class="wio-fig" markdown>
    <svg class="wio-svg" viewBox="0 0 460 290" width="460" role="img" aria-label="PNP sensor wiring" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="20" y="20" width="150" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="95" y="50" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">PNP sensor</text><text x="95" y="70" text-anchor="middle" font-size="11" fill="#9ca3af">3-wire, e.g. inductive prox</text><rect x="290" y="130" width="114" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="313" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="307" y1="148" x2="319" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="305" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="313" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">G</text><circle cx="347" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="341" y1="148" x2="353" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="339" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="347" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">S</text><circle cx="381" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="375" y1="148" x2="387" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="373" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="381" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">V</text><text x="347.0" y="224" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">INPUT 1</text><path d="M170,38 L250,38 L250,100 L381,100 L381,139" fill="none" stroke="#a16207" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170,55 L235,55 L235,112 L347,112 L347,139" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170,72 L220,72 L220,124 L313,124 L313,139" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="196" y="33" text-anchor="middle" font-size="11" fill="#a16207">brown</text><text x="196" y="51" text-anchor="middle" font-size="11" fill="#6b7280">black</text><text x="196" y="68" text-anchor="middle" font-size="11" fill="#3b82f6">blue</text><text x="92" y="146" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">INPUT COM</text><rect x="79" y="157" width="78" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="31" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="170" r="3.5" fill="currentColor"/><text x="40" y="198" text-anchor="middle" font-size="12" fill="currentColor">V+</text><rect x="83" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="92" cy="170" r="3.5" fill="currentColor"/><text x="92" y="198" text-anchor="middle" font-size="12" fill="currentColor">COM</text><rect x="135" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="144" cy="170" r="3.5" fill="currentColor"/><text x="144" y="198" text-anchor="middle" font-size="12" fill="currentColor">GND</text><text x="230" y="280" text-anchor="middle" font-size="12" fill="#9ca3af">Same wire colours as NPN; only the COM jumper changes.</text></svg>
    </figure>

    - **INPUT COM** on **COM** and **GND**.
    - **INPUT SENSOR V** on the sensor's voltage.
    - Brown to `V`, black to `S`, blue to `G`.

=== "Switch"

    <figure class="wio-fig" markdown>
    <svg class="wio-svg" viewBox="0 0 460 290" width="460" role="img" aria-label="Plain switch wiring: between V and S, COM jumper on GND" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="20" y="30" width="150" height="70" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="95" y="58" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Switch</text><text x="95" y="78" text-anchor="middle" font-size="11" fill="#9ca3af">limit, reed, pressure</text><rect x="290" y="130" width="114" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="313" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="307" y1="148" x2="319" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="305" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="313" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">G</text><circle cx="347" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="341" y1="148" x2="353" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="339" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="347" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">S</text><circle cx="381" cy="148" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="375" y1="148" x2="387" y2="148" stroke="currentColor" stroke-width="1.5"/><rect x="373" y="164" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="381" y="202" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">V</text><text x="347.0" y="224" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">INPUT 2</text><path d="M170,50 L250,50 L250,100 L381,100 L381,139" fill="none" stroke="#ef4444" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170,80 L235,80 L235,112 L347,112 L347,139" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="92" y="146" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">INPUT COM</text><rect x="79" y="157" width="78" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="31" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="170" r="3.5" fill="currentColor"/><text x="40" y="198" text-anchor="middle" font-size="12" fill="currentColor">V+</text><rect x="83" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="92" cy="170" r="3.5" fill="currentColor"/><text x="92" y="198" text-anchor="middle" font-size="12" fill="currentColor">COM</text><rect x="135" y="161" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="144" cy="170" r="3.5" fill="currentColor"/><text x="144" y="198" text-anchor="middle" font-size="12" fill="currentColor">GND</text><text x="230" y="280" text-anchor="middle" font-size="12" fill="#9ca3af">G is not used. Any sensor-supply setting works; 5 V is gentlest.</text></svg>
    </figure>

    For limit switches, reed switches, pressure switches and similar dry
    contacts.

    - **INPUT COM** on **COM** and **GND**.
    - One switch wire to `V`, the other to `S`. `G` stays empty.
    - Any **INPUT SENSOR V** setting works. `5` is gentlest on the contacts.

## Outputs

Each output has a 2-screw terminal and its own voltage jumper.

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 170 125" width="170" role="img" aria-label="Output terminal: + always-on supply, − switched to ground when the output is on" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="40" y="20" width="80" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="63" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="57" y1="38" x2="69" y2="38" stroke="currentColor" stroke-width="1.5"/><rect x="55" y="54" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="63" y="92" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">+</text><circle cx="97" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="91" y1="38" x2="103" y2="38" stroke="currentColor" stroke-width="1.5"/><rect x="89" y="54" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="97" y="92" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">−</text><text x="80.0" y="114" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">OUT1 … OUT4</text></svg>
<figcaption>Every output terminal is the same.</figcaption>
</figure>

| Screw | What it does |
|---|---|
| `+` | The voltage set by that output's jumper. Always on |
| `−` | Connected to ground while the output is on |

Connect the load between `+` and `−`. When ncSender turns the output on, the
load runs. Each output has a **blue light**, between its jumper and its terminal, that is on while the output is on.

### Output voltage jumpers (OUT1 … OUT4)

Each output has its own jumper, printed **OUT1** to **OUT4**, with the same
`5` / `12` / `24` choice as the sensor supply. Put the shunt between the centre
pin and the voltage your load needs. Each output can use a different voltage.

!!! warning "Set the jumper before you connect the load"
    A 12 V solenoid on an output set to `24` runs hot and can burn out.

### Sample wiring: air solenoid

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 510 212" width="510" role="img" aria-label="24 V solenoid on OUT1 with the OUT1 jumper on 24" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><text x="57" y="36" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">OUT1 jumper</text><rect x="27" y="81" width="60" height="26" rx="5" fill="#f97316" fill-opacity="0.35" stroke="#f97316" stroke-width="2"/><rect x="31" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="60" r="3.5" fill="currentColor"/><rect x="31" y="85" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="94" r="3.5" fill="currentColor"/><rect x="31" y="119" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="128" r="3.5" fill="currentColor"/><rect x="65" y="85" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="74" cy="94" r="3.5" fill="currentColor"/><rect x="65" y="51" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="74" cy="60" r="3.5" fill="currentColor"/><rect x="65" y="119" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="74" cy="128" r="3.5" fill="currentColor"/><text x="16" y="65" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">5</text><text x="14" y="133" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">12</text><text x="106" y="99" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">24</text><rect x="180" y="70" width="80" height="54" rx="4" fill="#16a34a" fill-opacity="0.18" stroke="#16a34a" stroke-width="1.5"/><circle cx="203" cy="88" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="197" y1="88" x2="209" y2="88" stroke="currentColor" stroke-width="1.5"/><rect x="195" y="104" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="203" y="142" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">+</text><circle cx="237" cy="88" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="231" y1="88" x2="243" y2="88" stroke="currentColor" stroke-width="1.5"/><rect x="229" y="104" width="16" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="237" y="142" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">−</text><text x="220.0" y="164" text-anchor="middle" font-size="12" font-weight="600" fill="#16a34a">OUT1</text><rect x="330" y="40" width="160" height="110" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="410" y="80" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">24 V solenoid</text><text x="410" y="100" text-anchor="middle" font-size="11" fill="#9ca3af">valve coil</text><text x="410" y="118" text-anchor="middle" font-size="11" fill="#9ca3af">(either wire to either pin)</text><path d="M203,79 L203,60 L300,60 L300,70 L330,70" fill="none" stroke="#ef4444" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M237,79 L237,50 L316,50 L316,125 L330,125" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="250" y="200" text-anchor="middle" font-size="12" fill="#9ca3af">Jumper on 24 → OUT1 + carries 24 V. The coil runs when OUT1 turns on.</text></svg>
<figcaption>A 24 V solenoid valve on OUT1.</figcaption>
</figure>

1. Set the **OUT1** jumper to `24` (or to your valve's voltage).
2. Connect the valve's two wires to OUT1 `+` and `−`. Either way round.
3. Turn OUT1 on from ncSender to check the valve clicks.

Solenoids, relays and other coils are safe to connect directly. The board
already has the protection diode a coil needs.

### What an output can drive

- Up to about **0.8 A** per output.
- Solenoid valves, relay coils, small fans, pumps, indicator lamps.
- If an output is shorted it switches off and recovers on its own once the
  short is removed.
- Bigger loads (spindle contactors, vacuum motors): drive a relay or contactor
  from the output, not the load itself.

### Fail-safe

An output can be set to **switch off on its own if the link to ncSender is
lost**, for example if the PC sleeps or the Wireless USB is unplugged. Use it
for anything that should not stay on unattended.

## LED strip

Plug a **12 V WS2811** strip into **LED STRIP**:

<figure class="wio-fig" markdown>
<svg class="wio-svg" viewBox="0 0 540 135" width="540" role="img" aria-label="LED STRIP port: 12V to strip +12V, DAT to DIN, GND to GND" xmlns="http://www.w3.org/2000/svg" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"><rect x="20" y="40" width="110" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="75" y="30" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">LED STRIP</text><rect x="108" y="55" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3"/><text x="96" y="66" text-anchor="end" font-size="12" font-weight="600" fill="currentColor">12V</text><rect x="108" y="77" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3"/><text x="96" y="88" text-anchor="end" font-size="12" font-weight="600" fill="currentColor">DAT</text><rect x="108" y="99" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3"/><text x="96" y="110" text-anchor="end" font-size="12" font-weight="600" fill="currentColor">GND</text><path d="M122,62 L300,62" fill="none" stroke="#ef4444" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="320" y="66" text-anchor="start" font-size="12" font-weight="600" fill="currentColor">+12V</text><path d="M122,84 L300,84" fill="none" stroke="#16a34a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="320" y="88" text-anchor="start" font-size="12" font-weight="600" fill="currentColor">DIN</text><path d="M122,106 L300,106" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="320" y="110" text-anchor="start" font-size="12" font-weight="600" fill="currentColor">GND</text><rect x="360" y="50" width="160" height="58" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/><text x="440" y="75" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">12 V WS2811 strip</text><text x="440" y="94" text-anchor="middle" font-size="11" fill="#9ca3af">input end (arrow away)</text></svg>
<figcaption>Connect the strip's input end (the end its arrows point away from).</figcaption>
</figure>

The strip works exactly like the [RGB LED &rarr;](smart-rgb-led.md): white at
idle, green while running, red on an alarm, a light show when a job finishes,
and so on. Set it up with the **RGB LED** plugin, the same way. The strip's
power comes from the board through a resettable fuse.

No strip? The **status light** on the board shows the same colours.

## Input and output mapping

| On the board | In ncSender | Light on the board |
|---|---|---|
| INPUT 1 | Input 1 | Blue, near INPUT 1 |
| INPUT 2 | Input 2 | Blue, near INPUT 2 |
| INPUT 3 | Input 3 | Blue, near INPUT 3 |
| INPUT 4 | Input 4 | Blue, near INPUT 4 |
| OUT1 | Output 1 | Blue, near OUT1 |
| OUT2 | Output 2 | Blue, near OUT2 |
| OUT3 | Output 3 | Blue, near OUT3 |
| OUT4 | Output 4 | Blue, near OUT4 |

For a pneumatic tool changer:

| Device | Connect to | Settings |
|---|---|---|
| Drawbar sensor | **INPUT 1** | **INPUT COM** to match the sensor (NPN or PNP) |
| Tool sensor | **INPUT 2** | Same |
| Clamp / unclamp solenoid | **OUT1** | **OUT1** jumper on the valve's voltage |
| Air pressure switch (optional) | **INPUT 3** | Wire as a switch |
| Taper blow valve (optional) | **OUT2** | **OUT2** jumper on the valve's voltage |

## Status light

The status light on the board shows the same thing the LED strip does.

| Status light | Meaning |
|---|---|
| Yellow, breathing | Not paired yet, or pairing |
| Amber, blinking | Needs activating (see [Activating &rarr;](wireless-usb.md#activating)) |
| White | Idle, or connected but ncSender is not sending a machine state |
| Green | Running or jogging |
| Amber | Hold |
| Red | Alarm |
| Orange | Door open |
| Teal | Probing |
| Blue | Homing |
| Magenta | Tool change |
| Changing colours, then green breathing | A job just finished |
| Blue, pulsing | Firmware update in progress. Don't power off |

## Getting connected

1. Plug the Wireless USB into the computer running ncSender.
2. Power ncWirelessIO from **PWR IN**.
3. In ncSender, open **Accessories** (the pendant icon in the toolbar) and
   click **Pair Device**. You have **60 seconds**.
4. On the board, hold **BOOT** for **3 seconds**. The status light breathes
   yellow while it looks for the Wireless USB.
    - If **BOOT** is hard to reach, switch the power off and on **three times
      quickly** instead.
5. Select **ncWirelessIO** in Accessories. It shows **Connected**.
6. If it shows **!**, click **Activate**. See
   [Wireless USB &rarr;](wireless-usb.md#activating).

## Firmware updates

1. Open **Accessories** and select **ncWirelessIO**.
2. Click **Update to v…** in the Firmware card.
3. Keep the board powered until it finishes. The status light pulses blue.

With the board plugged into the ncSender computer by USB-C, the update goes
over the cable and takes about 20 seconds. Without the cable it goes wirelessly
and takes over a minute. If an update is interrupted, the current
firmware keeps working. Just start again.

## Troubleshooting

- **An input never turns on.** Check its blue light while you trigger the
  sensor. If the light stays off: check the **INPUT COM** jumper matches the
  sensor (NPN or PNP), check **INPUT SENSOR V** is on the sensor's voltage, and
  check `G`, `S`, `V` are not swapped.
- **An input is always on.** The **INPUT COM** jumper is probably on the wrong
  side for the sensor type.
- **All sensors stopped at once.** The sensor supply fuse has tripped, usually
  a shorted sensor cable. Fix the short; it recovers by itself.
- **An output's light comes on but the load doesn't run.** Check the output's
  jumper is fitted, and that **PWR IN** has power. USB-C alone does not power
  the outputs.
- **A load runs weakly.** Check the output's jumper voltage, and with a 24 V
  supply see [Power](#power).
- **Status light blinks amber.** The board needs activating. See
  [Activating &rarr;](wireless-usb.md#activating).
- **Status light breathes yellow.** It is not paired. See
  [Getting connected](#getting-connected).

## Specifications

| | |
|---|---|
| Supply | 24–48 V DC, reverse-polarity protected |
| Inputs | 4, optically isolated, 3.3–24 V, NPN, PNP or switch |
| Sensor supply | 5, 12 or 24 V by jumper, resettable fuse |
| Outputs | 4 switched, 5, 12 or 24 V per output by jumper, about 0.8 A each, short-circuit protected |
| LED strip | 12 V WS2811, fused |
| Connection | Wireless, through the ncSender Wireless USB |
| USB | USB-C, for set-up and updates |
| Size | 70 × 68 mm |
