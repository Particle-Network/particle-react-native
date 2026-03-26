# @particle-network/particle-expo-config

An Expo config plugin for Particle Network. Automatically configures the native iOS and Android project settings required by the Particle Network SDKs when using the managed Expo workflow.

## Installation

```sh
npm install @particle-network/particle-expo-config
```

## Usage

Add the plugin to your `app.json` and provide your Particle Network project credentials:

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

You can find your project credentials in the [Particle Network Dashboard](https://dashboard.particle.network).
