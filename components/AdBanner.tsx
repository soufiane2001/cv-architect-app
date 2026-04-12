import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { AdIds } from '@/utils/adConfig';

// Guard: native module required — graceful no-op when unavailable (Expo Go, missing dev client)
let BannerAd: React.ComponentType<any> | null = null;
let BannerAdSize: Record<string, string> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m = require('react-native-google-mobile-ads');
  BannerAd = m.BannerAd;
  BannerAdSize = m.BannerAdSize;
} catch {
  // Native module unavailable — ads disabled for this build
}

interface Props {
  style?: object;
}

export default function AdBanner({ style }: Props) {
  if (!BannerAd) return null;
  return (
    <View style={[s.wrap, style]}>
      <BannerAd
        unitId={AdIds.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.rule,
    overflow: 'hidden',
  },
});
