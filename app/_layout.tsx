import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium':  Inter_500Medium,
    'Inter-Bold':    Inter_700Bold,
    'Inter-Black':   Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    (async () => {
      try {
        const {
          MobileAds,
          AdsConsentStatus,
          AdsConsentDebugGeography,
        } = require('react-native-google-mobile-ads');

        // Demande de consentement RGPD (obligatoire UE)
        try {
          const { AdsConsent } = require('react-native-google-mobile-ads');
          const consentInfo = await AdsConsent.requestInfoUpdate();
          if (
            consentInfo.isConsentFormAvailable &&
            consentInfo.status === AdsConsentStatus.REQUIRED
          ) {
            await AdsConsent.showForm();
          }
        } catch { /* pays hors UE ou formulaire indisponible */ }

        await MobileAds().setRequestConfiguration({
          requestNonPersonalizedAdsOnly: true,
        });
        await MobileAds().initialize();
      } catch {
        // Native module unavailable — no-op
      }
    })();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.paper} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="builder"
          options={{
            headerShown: true,
            headerTitle: 'Créer mon CV',
            headerTitleStyle: { fontFamily: 'Inter-Bold', fontSize: 17, color: Colors.ink },
            headerStyle: { backgroundColor: Colors.paper },
            headerTintColor: Colors.primary,
            headerShadowVisible: false,
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="preview"
          options={{
            headerShown: true,
            headerTitle: 'Aperçu CV',
            headerTitleStyle: { fontFamily: 'Inter-Bold', fontSize: 17, color: Colors.ink },
            headerStyle: { backgroundColor: Colors.paper },
            headerTintColor: Colors.primary,
            headerShadowVisible: false,
            headerBackTitle: '',
          }}
        />
      </Stack>
    </>
  );
}
