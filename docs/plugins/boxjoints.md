# BoxJoints

BoxJoints makes the G-code for finger joints (box joints) for boxes and
drawers, without a CAM program.

<!-- CAPTURE NEEDED: assets/images/plugins/boxjoints-dialog.webp (Box Joints) -->

## Make a joint

1. Open the **Plugins** tab in the console area and press **Box Joints**.
2. Fill in **Dimensions** and **Machine Settings** (below).
3. Check **Calculated Dimensions**. It shows the finger and slot widths and how
   to set up the board.
4. Press **Generate**. The program loads.

Turn on **Save to File Manager** to also keep the program in the File Manager.

<!-- CAPTURE NEEDED: assets/images/plugins/boxjoints-generate.webp (Generated joint) -->

## Dimensions

- **Board Thickness**: the thickness of your boards. This is how deep the slots
  are.
- **Board Width**: the width of the board edge being cut.
- **Finger Count**: how many fingers. The finger width is worked out for you.
- **Fit Tolerance**: extra room so the joint goes together. 0.1 to 0.2 mm is
  typical.
- **Piece Type**:
    - **A (pins)**: one board.
    - **B (tails)**: the matching board.
    - **Both (pins & tails)**: both in one program.
- **Orientation**: **X (horizontal)** or **Y (vertical)**, the direction the
  board edge runs on the table.
- **Depth Per Pass**: how deep each pass cuts.

## Machine Settings

- **Bit Diameter**, **Feed Rate**, **Spindle RPM**.
- **Spindle Delay (s)**: how long to wait for the spindle to get up to speed.
- **Mist Coolant** and **Flood Coolant**.

## Tips

- Clamp the board firmly, with the edge to cut lined up along the direction you
  chose in **Orientation**.
- Cut piece A, then piece B, with the same settings so they match.
- Test on scrap first and adjust **Fit Tolerance** if the joint is too tight or
  too loose.

## Troubleshooting

**"Slot width is smaller than bit diameter"**: the slots are too narrow for your
bit. Use fewer fingers or a smaller bit.
