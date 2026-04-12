import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import { AdIds, AD_VIDEO_DURATION } from '@/utils/adConfig';

// Guard: native module required — graceful no-op when unavailable (Expo Go, missing dev client)
let RewardedAd: any = null;
let RewardedAdEventType: Record<string, string> = { LOADED: 'loaded', EARNED_REWARD: 'earned_reward' };
let AdEventType: Record<string, string> = { CLOSED: 'closed', ERROR: 'error' };
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m = require('react-native-google-mobile-ads');
  RewardedAd = m.RewardedAd;
  RewardedAdEventType = m.RewardedAdEventType;
  AdEventType = m.AdEventType;
} catch {
  // Native module unavailable — countdown fallback will be used
}
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface Props {
  visible: boolean;
  onComplete: () => void;   // called when ad finishes or countdown reaches 0
  onDismiss: () => void;    // called if user somehow closes early (shouldn't happen)
}

export default function AdVideoModal({ visible, onComplete, onDismiss }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(AD_VIDEO_DURATION);
  const [adState, setAdState] = useState<'loading' | 'playing' | 'done'>('loading');
  const ringAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rewardedRef = useRef<RewardedAd | null>(null);
  const completedRef = useRef(false);
  const countRef = useRef(AD_VIDEO_DURATION);

  const triggerComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    onComplete();
  };

  // Animate the SVG-like ring progress
  const startRingAnimation = () => {
    ringAnim.setValue(0);
    Animated.timing(ringAnim, {
      toValue: 1,
      duration: AD_VIDEO_DURATION * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  // Countdown timer
  const startCountdown = () => {
    countRef.current = AD_VIDEO_DURATION;
    setSecondsLeft(AD_VIDEO_DURATION);
    startRingAnimation();
    timerRef.current = setInterval(() => {
      countRef.current -= 1;
      const remaining = countRef.current;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        triggerComplete();
      }
    }, 1000);
  };

  useEffect(() => {
    if (!visible) return;

    completedRef.current = false;
    countRef.current = AD_VIDEO_DURATION;
    setAdState('loading');
    setSecondsLeft(AD_VIDEO_DURATION);

    // Native module unavailable — skip ad, run countdown only
    if (!RewardedAd) {
      setAdState('playing');
      startCountdown();
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }

    // Load rewarded ad
    const rewarded = RewardedAd.createForAdRequest(AdIds.rewarded, {
      requestNonPersonalizedAdsOnly: true,
    });
    rewardedRef.current = rewarded;

    const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdState('playing');
      startCountdown();
      rewarded.show();
    });

    const unsubReward = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      triggerComplete();
    });

    const unsubClose = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      // Ad dismissed — complete if countdown ran enough, else still complete
      triggerComplete();
    });

    const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      // Ad failed to load — fallback: run countdown with a "please wait" screen
      setAdState('playing');
      startCountdown();
    });

    rewarded.load();

    return () => {
      unsubLoaded();
      unsubReward();
      unsubClose();
      unsubError();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  // Ring stroke dash offset interpolation (0 = full circle, 1 = empty)
  const circumference = 2 * Math.PI * 36; // radius 36
  const strokeDashoffset = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // block back button
    >
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Préparez votre CV</Text>
          <Text style={s.subtitle}>
            {adState === 'loading'
              ? 'Chargement de la publicité...'
              : 'Regardez la vidéo pour débloquer votre PDF'}
          </Text>

          {/* Countdown ring */}
          <View style={s.ringWrap}>
            {/* Background circle */}
            <View style={s.ringBg} />

            {/* Animated border using View rotation trick */}
            <Animated.View
              style={[
                s.ringProgress,
                {
                  borderColor: Colors.primary,
                  transform: [
                    {
                      rotate: ringAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />

            {/* Center label */}
            <View style={s.ringCenter}>
              <Text style={s.ringNumber}>{secondsLeft}</Text>
              <Text style={s.ringSec}>sec</Text>
            </View>
          </View>

          <Text style={s.note}>
            {adState === 'loading'
              ? 'Connexion en cours...'
              : 'Votre PDF sera prêt dans ' + secondsLeft + ' seconde' + (secondsLeft > 1 ? 's' : '')}
          </Text>

          <View style={s.progress}>
            <Animated.View
              style={[
                s.progressFill,
                {
                  width: ringAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={s.disclaimer}>
            La publicité finance cet outil gratuit. Merci de votre soutien.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.paper,
    width: '100%',
    padding: Spacing.xl,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: Colors.primary,
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: FontSize.lg,
    color: Colors.ink,
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.sm,
    color: Colors.ink2,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },

  // Ring countdown
  ringWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  ringBg: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: Colors.rule2,
  },
  ringProgress: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNumber: {
    fontFamily: 'Inter-Black',
    fontSize: 30,
    color: Colors.ink,
    lineHeight: 34,
  },
  ringSec: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.ink3,
    letterSpacing: 0.5,
  },

  note: {
    fontFamily: 'Inter-Medium',
    fontSize: FontSize.sm,
    color: Colors.ink2,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  progress: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.rule,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.primary,
  },

  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.ink3,
    textAlign: 'center',
    lineHeight: 16,
  },
});
