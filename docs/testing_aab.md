# How to Test the Android App Bundle (AAB)

Since AAB files cannot be installed directly like APKs, we use `bundletool` to generate a set of APKs optimized for your specific device.

## Prerequisites

1.  **Enable Developer Options**:
    *   Go to **Settings** > **About Phone**.
    *   Tap **Build Number** 7 times until it says "You are now a developer".
2.  **Enable USB Debugging**:
    *   Go to **Settings** > **System** > **Developer Options**.
    *   Enable **USB Debugging**.
3.  **Connect your Phone**:
    *   Plug your phone into your computer via USB.
    *   If prompted on your phone ("Allow USB debugging?"), tap **Allow**.

## Installation Steps

We have created a helper script to automate the process.

1.  Open your terminal in the project root (`/Users/ten/ANTIGRAVITY/DAEMON2`).
2.  Run the installation script:
    ```bash
    ./scripts/install_aab.sh
    ```

## What the script does

1.  **Checks for devices**: Verifies your phone is connected via ADB.
2.  **Builds APKs**: Uses `bundletool` to convert the `app-release.aab` into an `app.apks` archive, tailored specifically for your connected device's configuration (screen density, CPU architecture, language).
3.  **Installs**: Pushes the generated APKs to your phone.

## Troubleshooting

*   **"List of devices attached" is empty**:
    *   Check your USB cable.
    *   Make sure you accepted the prompt on your phone screen.
    *   Try unplugging and replugging.
*   **"Command not found: java"**:
    *   Ensure you have Java installed and in your PATH.
