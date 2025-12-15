#!/bin/bash

# Path to bundletool
BUNDLETOOL="/Users/ten/ANTIGRAVITY/DAEMON2/bundletool.jar"

# Path to your AAB
AAB_PATH="/Users/ten/ANTIGRAVITY/DAEMON2/frontend/android/app/build/outputs/bundle/release/app-release.aab"

# Output path for the APKS file
APKS_PATH="./app.apks"

# Check if device is connected
echo "Checking for connected devices..."
adb devices

echo "-----------------------------------"
echo "Generating APKs from AAB..."
# Generate APKs specifically for the connected device
java -jar $BUNDLETOOL build-apks \
  --bundle=$AAB_PATH \
  --output=$APKS_PATH \
  --connected-device \
  --local-testing

echo "-----------------------------------"
echo "Installing APKs to device..."
# Install the APKs
java -jar $BUNDLETOOL install-apks --apks=$APKS_PATH

echo "-----------------------------------"
echo "Done! Check your phone for the 'DAEMON' app."
