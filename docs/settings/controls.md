# Controls (Keyboard & Gamepad)

Jog and run jobs from a keyboard or a USB gamepad. Open **Settings → Controls**.

## Turn On Keyboard Control

1. Open **Settings → Controls**.
2. Turn on **Enable Keyboard**.

<!-- CAPTURE NEEDED: assets/images/settings/controls-tab.webp (Controls tab) -->

Each row is an action, with a **Keyboard** column and a **Gamepad** column. Type in **Search Actions...** to find one.

| Group | Actions |
|---|---|
| **Jogging** | Jog X+, X-, Y+, Y-, Z+, Z-, and the four diagonals |
| **Job** | Start / Resume Job, Pause Job, Stop Job |
| **Machine** | Cycle Jog Steps, Set Step Small, Set Step Medium, Set Step Large, Home Machine |
| **Probe** | Start Probe (only works while the probe dialog is open) |

Keyboard and gamepad jogs are ignored while a job or probe is running. If your controller requires homing at startup, home the machine first.

## Change a Key

1. Click the **Keyboard** cell for an action.
2. When it says "Press a key combination...", press the key or combination.
3. If that key was used by another action, it moves to this one.

Click **×** next to a binding to remove it.

<!-- CAPTURE NEEDED: assets/images/settings/controls-capture-key.webp (Waiting for a key) -->

## Set Up a Gamepad

1. Plug in the gamepad and press any button so the computer detects it.
2. Click the **Gamepad** cell for an action.
3. When it says "Press a button or move axis...", press the button or move the stick.

<!-- CAPTURE NEEDED: assets/images/settings/controls-gamepad-bind.webp (Binding a gamepad button) -->

## Long-Press Actions

Turn on **REQUIRE LONG PRESS** for an action so a quick tap doesn't trigger it. Use it for actions like **Home Machine** or **Stop Job**.

## Reset

Click **Reset to defaults** and confirm to put back all default bindings. This can't be undone.

## Check a Gamepad With Gamepad Debug

If a gamepad doesn't respond, check what ncSender sees:

1. Click the ncSender logo in the toolbar (**Toggle Gamepad Debug**).
2. Move the sticks and press buttons. The overlay shows each axis and button as it changes.
3. If it says **No gamepad connected**, press a button on the gamepad or plug it in again.
4. Click **Toggle Gamepad Debug** again to hide it.

<!-- CAPTURE NEEDED: assets/images/settings/controls-gamepad-debug.webp (Gamepad Debug) -->

See also [Jog Controls](../features/jog-controls.md#keyboard-shortcuts).
