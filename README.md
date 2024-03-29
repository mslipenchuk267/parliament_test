# Parliament - Anonymous Contact Tracing

## Environment Setup
Follow the [React Native Environment Setup Guide](https://reactnative.dev/docs/environment-setup) and make sure to select the the **React Native CLI Quickstart** tab.
__*Note*__: A Mac is required to build app to iOS devices and use the iOS simulator.

## Project Setup
1. `cd` into project directory
2. Run `yarn install`

## Running App on Simulator
- Make sure you are in project root directory (e.g. `/parliament`)
- **Android**: Run `npx react-native run-android`
- **iOS (Mac required)**: Run `npx react-native run-ios`

## Running on Physical Device
#### First Time Setup
- Plug device into laptop via USB
- **Android**: 
    - Make sure [developer mode is enabled](https://www.digitaltrends.com/mobile/how-to-get-developer-options-on-android/) on mobile device
    - Run `adb devices` and confirm a device appears (i.e. your phone)
    - Run `npx react-native run-android` in terminal (make sure you are in project dir)
        - This will build the app and install it on your phone, it will automatically launch when ready 
- **iOS**: 
    - Run `xed -b ios` in project directory
        - this will open up xcode for you
    - In Xcode, go to Product -> Destination -> Select iPhone in the Device section 
        - (iPhone corresponds to your physical device, yours might have sligtly different name e.g. Matt's iPhone)
    - Press the Play icon Button located at the top left of xcode
    - Xcode will now build the app and install it on your phone, it will automatically launch when ready
#### Wifi Setup (Optional)
- In app, shake device to open developer menu
- **Android**
    - Select Settings -> Debug server host & port for device
    - Enter your computers IP adress and emulator port (which is always 8081)
        - e.g. `10.0.0.1:8081` 
    - Select OK
- **iOS**
    - Select Configure Bundler
    - Enter your laptop's IP address (e.g. 10.0.0.1)
        - You can leave the other entries as is, we don't want to change those
    - Select Apply changes
- Your device can now get updates without needing a USB connection
    - if your computer IP changes, you will have to update this
#### Running After the First Time Setup
- Run `yarn start`
    - This launches the metro server which lets us get the live code updates
- For wifi setup make sure your phone is on the same wifi network as your laptop
    - Also make sure you completed the __Wifi Setup__ above
- If you don't want to use the wifi setup, make sure to connect your phone via USB
- The app should already be installed previously during the __First Time Setup__
- Open the app on your device
         
