const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

/**
 * Custom Expo config plugin for react-native-google-mobile-ads (v13.x).
 * Injects the AdMob App ID into AndroidManifest.xml and Info.plist.
 */
const withGoogleMobileAds = (config, { androidAppId, iosAppId } = {}) => {
  // Android: add <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" ...>
  config = withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const application = manifest.manifest.application[0];

    if (!application['meta-data']) {
      application['meta-data'] = [];
    }

    const metaData = application['meta-data'];
    const key = 'com.google.android.gms.ads.APPLICATION_ID';

    const existing = metaData.findIndex(
      (item) => item.$['android:name'] === key
    );

    const entry = {
      $: {
        'android:name': key,
        'android:value': androidAppId,
      },
    };

    if (existing >= 0) {
      metaData[existing] = entry;
    } else {
      metaData.push(entry);
    }

    return mod;
  });

  // iOS: add GADApplicationIdentifier to Info.plist
  config = withInfoPlist(config, (mod) => {
    mod.modResults['GADApplicationIdentifier'] = iosAppId;
    return mod;
  });

  return config;
};

module.exports = withGoogleMobileAds;
