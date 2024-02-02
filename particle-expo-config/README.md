# @particle-network/particle-expo-config

## Installation

```sh
npm install @particle-network/particle-expo-config
```

## Usage

```js
// app.json
{
    "expo": {
        // ...
    },
    "plugins": [
        // ...
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
```
