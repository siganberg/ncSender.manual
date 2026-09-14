# DRO (Digital Readout)

The DRO shows where the machine is. Each axis card shows the position in the
active work coordinate system (the large number, for example G54) and the machine
position (the small number underneath).

You also use the DRO to set your work zeros. There is no dialog or menu: you press
the axis cards themselves.

## Setting work zeros (long-press)

![DRO long-press to zero](../assets/images/features/dro-long-press.webp)

**Press and hold** an axis card for about **¾ of a second** to zero that axis
where the machine is now. A bar fills across the card while you hold. The zero is
set when the bar is full. Setting a zero does not move the machine.

- **Hold the X card** to set **X0**.
- **Hold the Y card** to set **Y0**.
- **Hold the Z card** to set **Z0**.
- **Hold the XY pill** (between the X and Y cards) to set **X0 and Y0 together**.
  The bar fills across both cards.

Let go before the bar is full to cancel, so a stray tap won't reset your zeros.

!!! note "Z zero with a Tool Length Setter"
    If TLS is on but you haven't measured the tool yet, holding the Z card opens
    **Tool Length Reference Not Set** instead of zeroing. Choose **Run TLS**,
    **Zero Z Anyway** or **Cancel**. See
    [Tool Management](tool-management.md#the-glowing-tls-button).

<!-- CAPTURE NEEDED: assets/images/features/dro-tlr-warning.webp (Tool Length Reference Not Set) -->

## Entering a specific coordinate (double-click / double-tap)

![DRO manual coordinate entry](../assets/images/features/dro-manual-entry.webp)

To **type a coordinate** instead of zeroing, **double-click** the axis card (mouse)
or **double-tap** it (touchscreen). The card turns into an input box:

- Type the value in your current units (mm or inches).
- Press ++enter++ or tap ✓ to apply.
- Press ++escape++ or click away to cancel.

For example, if the machine is 10.5 mm left of where you want X0, type `-10.5`. You
don't have to jog to the zero first.

## What's shown on each card

| Element | Meaning |
|---|---|
| **Axis letter** (X / Y / Z / A) | The axis this card controls. |
| **Large number** (work position) | Position in the active work coordinate system (G54, G55, …). This goes to zero when you hold the card. |
| **Small number** (machine position) | Position measured from machine home. Work offsets don't change it. |
| **Progress bar** | Fills while you hold the card, so you can see when the zero will be set. |
| **XY pill** | Between the X and Y cards. Hold it to zero both. |

## A axis

The **A** card shows when your controller has an A axis and the A axis is turned on.
See [4th Axis](4th-axis.md).

## Alarms

Active alarms are listed under **Alarms** in the same panel.
