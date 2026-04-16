# Installation

<!-- TODO: Screenshot of ncSender running on each platform -->
![ncSender on multiple platforms](../assets/images/getting-started/installation-hero.png){ .placeholder }

## Downloads

### Community Edition (Free)

Download the latest release from [GitHub Releases](https://github.com/siganberg/ncSender/releases).

| Platform | Download |
|----------|----------|
| Windows x64 | `.exe` installer |
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Linux x64 | `.deb` |
| Linux ARM64 (Raspberry Pi) | `.deb` |

### Pro Edition

Download from [ncSender Pro Releases](https://github.com/siganberg/ncsenderpro.releases/releases).

## System Requirements

- **Windows**: Windows 10 or later (x64)
- **macOS**: macOS 12 Monterey or later (Apple Silicon and Intel)
- **Linux**: Ubuntu 22.04+ or Debian 12+ (x64 and ARM64)

## Installation Steps

=== "Windows"

    1. Download the `.exe` installer
    2. Run the installer and follow the prompts
    3. Launch ncSender from the Start menu

    <!-- TODO: Screenshot of Windows installer -->
    ![Windows installer](../assets/images/getting-started/install-windows.png){ .placeholder }

=== "macOS"

    1. Download the `.dmg` file
    2. Open the DMG and drag ncSender to Applications
    3. On first launch, clear the quarantine attribute:
    ```bash
    xattr -c /Applications/ncSender.app
    ```

    <!-- TODO: Screenshot of macOS DMG drag-to-install -->
    ![macOS installer](../assets/images/getting-started/install-macos.png){ .placeholder }

=== "Linux"

    1. Download the `.deb` package
    2. Install: `sudo dpkg -i ncSender_*.deb`
    3. Launch from the application menu or run `ncsender`

    <!-- TODO: Screenshot of Linux terminal install -->
    ![Linux installer](../assets/images/getting-started/install-linux.png){ .placeholder }
