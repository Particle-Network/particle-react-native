# Particle Network — Expo Example

An example Expo application demonstrating how to integrate Particle Network SDKs (`rn-auth-core`, `rn-connect`, `rn-wallet`, `rn-aa`) in a managed Expo project.

## Setup

```sh
npm install
```

## Run

```sh
npx expo start
```

From the Expo CLI output you can open the app in a development build, Android emulator, or iOS simulator.

> **Note for iOS:** `particle_auth_core` only supports `ios-arm64` (physical devices). Before building for iOS, update your `Podfile` to match the reference at [`ios/Podfile`](ios/Podfile).

## Configuration

This project uses the `@particle-network/particle-expo-config` plugin. Set your Particle Network project credentials in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@particle-network/particle-expo-config",
        {
          "projectId": "YOUR_PROJECT_ID",
          "clientKey": "YOUR_CLIENT_KEY",
          "androidAppId": "YOUR_ANDROID_APP_ID",
          "iosAppId": "YOUR_IOS_APP_ID"
        }
      ]
    ]
  }
}
```

## Documentation

- [Particle Auth Core](https://developers.particle.network/api-reference/auth/mobile-sdks/react)
- [Particle Connect](https://developers.particle.network/api-reference/connect/mobile/react)
- [Particle Wallet](https://developers.particle.network/api-reference/wallet/mobile/react)
- [Particle AA](https://developers.particle.network/api-reference/aa/sdks/mobile/react)
