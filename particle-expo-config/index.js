const fs = require("fs");

const {
    withAndroidManifest,
    withAppBuildGradle,
    withPodfileProperties,
    withXcodeProject,
    IOSConfig,
} = require("@expo/config-plugins");

module.exports = (config, params) => {
    config = setAndroidManifest(config);
    config = setAndroidBuildGradle(config, params);
    config = createIosInfoPlist(config, params);
    config = setIosPodfile(config);
    return config;
};

function setAndroidManifest(config) {
    return withAndroidManifest(config, (config) => {
        const particleActivity = [
            {
                $: {
                    "android:name": "com.particle.auth.controller.AuthCoreWebActivity",
                    "android:configChanges": "orientation|keyboardHidden|screenSize",
                    "android:exported": "true",
                    "android:launchMode": "singleTask",
                    "android:theme": "@style/ThemeAuthWeb",
                },
                "intent-filter": [
                    {
                        action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
                        category: [
                            { $: { "android:name": "android.intent.category.DEFAULT" } },
                            { $: { "android:name": "android.intent.category.BROWSABLE" } },
                        ],
                        data: [{ $: { "android:scheme": "ac${PN_APP_ID}" } }],
                    },
                ],
            },
        ];

        if (config.modResults.manifest.application?.length) {
            config.modResults.manifest.application[0].activity = [
                ...config.modResults.manifest.application[0].activity,
                ...particleActivity,
            ];
        } else {
            config.modResults.manifest.application = [{ activity: particleActivity }];
        }

        return config;
    });
}

function setAndroidBuildGradle(config, { projectId, clientKey, androidAppId }) {
    return withAppBuildGradle(config, (config) => {
        config.modResults.contents = config.modResults.contents.replace(
            /(defaultConfig\s*{[^}]*)}/gs,
            `$1
        manifestPlaceholders["PN_PROJECT_ID"] = "${projectId}"
        manifestPlaceholders["PN_PROJECT_CLIENT_KEY"] = "${clientKey}"
        manifestPlaceholders["PN_APP_ID"] = "${androidAppId}"
    }
    configurations {
        all*.exclude module: 'bcprov-jdk15on'
    }
    dataBinding {
        enabled = true
    }`
        );

        return config;
    });
}

function createIosInfoPlist(config, { projectId, clientKey, iosAppId }) {
    return withXcodeProject(config, (config) => {
        const info = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>PROJECT_UUID</key>
<string>${projectId}</string>
<key>PROJECT_CLIENT_KEY</key>
<string>${clientKey}</string>
<key>PROJECT_APP_UUID</key>
<string>${iosAppId}</string>
</dict>
</plist>`;

        const { platformProjectRoot, projectName } = config.modRequest;
        const filename = "ParticleNetwork-Info.plist";
        const filepath = `${platformProjectRoot}/${projectName}/${filename}`;

        fs.writeFile(filepath, info, (err) => {
            if (err) {
                throw Error(err);
            }
        });

        config.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
            filepath,
            groupName: `${projectName}/Resources`,
            project: config.modResults,
        });

        const { PBXFileReference, PBXResourcesBuildPhase } =
            config.modResults.hash.project.objects;
        const BUILD_KEY = "F38419322B6C8EE800074CA5";
        const BUILD_COMMENT = `${filename} in Resources`;

        config.modResults.hash.project.objects.PBXBuildFile[BUILD_KEY] = {
            fileRef: Object.keys(PBXFileReference).find((k) =>
                PBXFileReference[k].name?.includes(filename)
            ),
            fileRef_comment: filename,
            isa: "PBXBuildFile",
        };
        config.modResults.hash.project.objects.PBXBuildFile[
            `${BUILD_KEY}_comment`
        ] = BUILD_COMMENT;
        config.modResults.hash.project.objects.PBXResourcesBuildPhase[
            Object.keys(PBXResourcesBuildPhase).find((k) => !/comment/.test(k))
        ].files.push({
            value: BUILD_KEY,
            comment: BUILD_COMMENT,
        });

        return config;
    });
}

function setIosPodfile(config) {
    return withPodfileProperties(config, (config) => {
        const { platformProjectRoot } = config.modRequest;
        const podfilePath = `${platformProjectRoot}/Podfile`;
        fs.readFile(podfilePath, "utf8", (err, data) => {
            if (err) {
                throw Error(err);
            } else {
                if (/pod "Thresh"/.test(data)) {
                    return;
                }
                nextData = data
                    .replace(
                        /(use_react_native\!\([^\)]*\))/gs,
                        `$1\n
  pod "Thresh", '1.3.4'
  pod "ParticleMPCCore", '1.3.4'
  pod "ParticleAuthCore", '1.3.4'
  pod "AuthCoreAdapter", '1.3.4'
  pod 'ParticleAuthService', '1.3.9'
  pod 'ParticleNetworkBase', '1.3.9'
  pod 'ConnectCommon',  '0.2.15'`
                    )
                    .replace(
                        /(__apply_Xcode_[^\)]*\))/gs,
                        `$1\n
    installer.pods_project.targets.each do |target|
      if target.name == 'ParticleNetworkBase' or 
         target.name == 'Thresh' or 
         target.name == 'ParticleMPCCore' or 
         target.name == 'ParticleAuthCore' or 
         target.name == 'AuthCoreAdapter' or 
         target.name == 'ParticleAuthService' or 
         target.name == 'ConnectCommon' or
         target.name == 'CryptoSwift' or
         target.name == 'SwiftyUserDefaults' or
         target.name == 'RxSwift' or
         target.name == 'RxCocoa' or
         target.name == 'SwiftyJSON' or
         target.name == 'Base58.swift' or
         target.name == 'SwiftMessages' or
         target.name == 'SkeletonView' or
         target.name == 'SnapKit' or
         target.name == 'BigInt' or
         target.name == 'Alamofire'

         target.build_configurations.each do |config|
          config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
         end
      end
    end`
                    );
                fs.writeFile(podfilePath, nextData, (err) => {
                    if (err) {
                        throw Error(err);
                    }
                });
            }
        });
        return config;
    });
}
