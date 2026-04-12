import { Platform } from 'react-native';

// Guard: react-native-google-mobile-ads requires a compiled native binary.
// Falls back to empty strings when running in Expo Go / missing custom dev client.
let TestIds: { ADAPTIVE_BANNER: string; REWARDED: string } = {
  ADAPTIVE_BANNER: '',
  REWARDED: '',
};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  TestIds = require('react-native-google-mobile-ads').TestIds;
} catch {
  // Native module unavailable — ads disabled for this build
}

// ─── Replace with your real AdMob IDs before publishing ───────────────────────
// Android: https://apps.admob.com → App ID + create ad units
// iOS:     https://apps.admob.com → App ID + create ad units
//
// Format:
//   APP_ID:   ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
//   AD_UNIT:  ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

const IS_DEV = __DEV__;

const ANDROID_IDS = {
  banner:   'ca-app-pub-9374827284535461/9589570275',
  rewarded: 'ca-app-pub-9374827284535461/9589570275',
};

const IOS_IDS = {
  banner:   'ca-app-pub-9374827284535461/9589570275',
  rewarded: 'ca-app-pub-9374827284535461/9589570275',
};

const real = Platform.OS === 'ios' ? IOS_IDS : ANDROID_IDS;

export const AdIds = {
  banner:   IS_DEV ? TestIds.ADAPTIVE_BANNER : real.banner,
  rewarded: IS_DEV ? TestIds.REWARDED        : real.rewarded,
};

// Duration in seconds the user must wait before PDF download is unlocked
export const AD_VIDEO_DURATION = 10;
