import { Platform } from 'react-native';

let TestIds: { ADAPTIVE_BANNER: string; REWARDED: string; INTERSTITIAL: string } = {
  ADAPTIVE_BANNER: '',
  REWARDED: '',
  INTERSTITIAL: '',
};
try {
  TestIds = require('react-native-google-mobile-ads').TestIds;
} catch {
  // Native module unavailable — ads disabled for this build
}

const IS_DEV = __DEV__;

const ANDROID_IDS = {
  banner:       'ca-app-pub-9374827284535461/9589570275',
  rewarded:     'ca-app-pub-9374827284535461/9589570275',
  interstitial: 'ca-app-pub-9374827284535461/7450324221',
};

const IOS_IDS = {
  banner:       'ca-app-pub-9374827284535461/9589570275',
  rewarded:     'ca-app-pub-9374827284535461/9589570275',
  interstitial: 'ca-app-pub-9374827284535461/7450324221',
};

const real = Platform.OS === 'ios' ? IOS_IDS : ANDROID_IDS;

export const AdIds = {
  banner:       IS_DEV ? TestIds.ADAPTIVE_BANNER : real.banner,
  rewarded:     IS_DEV ? TestIds.REWARDED        : real.rewarded,
  interstitial: IS_DEV ? TestIds.INTERSTITIAL    : real.interstitial,
};

export const AD_VIDEO_DURATION = 10;
