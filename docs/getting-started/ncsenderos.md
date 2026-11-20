# Installing ncSenderOS

!!! info "Pro Feature"
    ncSenderOS ships with **ncSender Pro** only.

ncSenderOS is a ready-made operating system that boots straight into ncSender
Pro in full-screen kiosk mode. There is nothing to set up: no Linux install,
no user accounts, no USB permissions. Flash it, plug in your machine, and go.

Use it when the computer is dedicated to your CNC. If you want ncSender on a
computer you also use for other things, install the normal app instead (see
[Installation](installation.md)).

## Pick Your Image

All images are on the
[ncSenderOS releases page](https://github.com/siganberg/ncSenderProOs.releases/releases).

| Hardware | File | Goes on |
|---|---|---|
| **x64 PC**: Intel NUC, N100 mini PC, gControl Panel, any 64-bit Intel/AMD PC with UEFI | `ncSenderOS-x86-vX.Y.Z.iso` | A USB stick, then installed to the PC's internal drive |
| **Raspberry Pi 5** (4 GB or 8 GB) | `ncSenderOS-pi5-vX.Y.Z.img.xz` | A microSD card |

!!! tip "A release may not carry every image"
    An image is only rebuilt when it changes. If the latest release has no
    file for your hardware, the **Images** table at the end of its notes
    links to the newest one. ncSender Pro itself updates from inside the
    app, so an older image still ends up on the newest ncSender. If you see
    a `.rp.img.xz` file next to the Pi 5 image, ignore it. That is a
    vendor-specific build.

You also need [balenaEtcher](https://etcher.balena.io/) (free, Windows /
macOS / Linux) to write the image.

## x64 PC (ISO)

The ISO is an installer. You boot the PC from a USB stick once, it copies
ncSenderOS onto the internal drive, and from then on the PC starts ncSender
on its own.

!!! danger "The internal drive is completely erased"
    Everything on the drive you install to (Windows, files, other
    partitions) is wiped. Copy anything you want to keep first.

**You need:** a 64-bit Intel or AMD PC with UEFI, 4 GB of RAM or more, and a
USB stick of 2 GB or more (it will be erased too).

1. **Write the USB stick.** Open balenaEtcher, click **Flash from file** and
   pick the `.iso`, click **Select target** and pick the USB stick, then
   click **Flash!**.
2. **Boot from the stick.** Plug it into the PC and power on while tapping
   the boot-menu key. It is usually **F7, F10, F12 or Esc**, depending on
   the brand. Pick the USB stick from the list.
3. **Start the installer.** Choose **ncSenderOS Installer**. If the screen
   goes black or stays blank, restart and choose **ncSenderOS Installer
   (Safe Mode - nomodeset)** instead.
4. **Pick the drive.** Press OK on the welcome screen. The installer lists
   the drives it found, with their size and model. Pick the PC's internal
   drive, not the USB stick.
5. **Confirm.** A last warning shows the drive you picked. Choose **Yes**
   to erase it and install. This takes a few minutes.
6. **Reboot.** When you see *Installation Complete*, pull out the USB stick
   and press **OK**. The PC restarts into ncSender.

If a second screen is connected through HDMI or DisplayPort, it shows the
same picture.

## Raspberry Pi 5 (SD card)

The Pi 5 runs straight from the microSD card. There is no install step.

**You need:** a microSD card of 16 GB or more (U3 / A2 recommended; slow or
fake cards are the most common cause of boot problems), a card reader, and
the official 5V / 5A USB-C power supply.

1. **Flash the card.** Open balenaEtcher, click **Flash from file** and pick
   the `.img.xz`. You don't need to unzip it first. Click **Select
   target**, pick the microSD card, and click **Flash!**. It takes 5 to 10
   minutes.
2. **Connect the Pi.** Put the card in the Pi 5 and connect the screen
   (HDMI), your CNC controller (USB or Ethernet), and Ethernet to your
   network if you have it. Plug in power last.
3. **First boot.** You'll see the boot logo, then ncSender opens. The first
   boot takes 1 to 2 minutes longer than later ones while the card is
   prepared.

## After the First Boot

ncSender opens and walks you through the same first-launch steps as any
other install: see [What Happens on First Launch](installation.md#what-happens-on-first-launch),
then [License Activation](license-activation.md) and
[First Connection](first-connection.md).

- **Wi-Fi:** Settings → Network → WiFi. Ethernet works with no setup.
- **Portrait screen:** Settings → Display → Rotation. Touch follows the
  rotation.
- **Language:** Settings → General → Language & Region.
- **Updates:** ncSender updates itself from inside the app, the same as on
  any other computer. See [Software Updates](software-updates.md).
- **Accessories:** the pendant, Wireless USB and other ncSender USB
  accessories work as soon as you plug them in.

## Copy G-code From Your Computer

ncSenderOS shares its G-code folder on your network, so your CAM software can
save straight to it.

- **Windows:** in File Explorer's address bar, type `\\ncsender\ncSender`
- **macOS:** in Finder, press ⌘K and enter `smb://ncsender/ncSender`

If the name `ncsender` doesn't work on your network, use the device's IP
address instead, for example `\\192.168.1.50\ncSender`. Save your files into
the `gcode-files` folder.

!!! warning "Keep it on your shop network"
    The share needs no password and the system has a known default login,
    so it works out of the box. That is fine behind your home or shop
    router. Never connect ncSenderOS directly to the internet.

## Troubleshooting

| What you see | What to do |
|---|---|
| **x64:** black screen after picking the installer | Restart and choose the **Safe Mode** entry. |
| **x64:** the USB stick isn't in the boot menu | Rewrite it with balenaEtcher. In the PC's firmware settings, make sure UEFI boot is on. |
| **Pi 5:** black screen, no logo | Reseat the card. If it still doesn't boot, try another card. |
| Stuck on a text screen instead of ncSender | Wait 30 seconds; the first boot does extra work. If it stays, power off and on once. |
| ncSender says it can't find the controller | Check the USB cable and that the controller is powered. Try another USB port. |
