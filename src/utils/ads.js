import { Platform } from 'react-native';

const ENABLE_ADS = process.env.EXPO_PUBLIC_ENABLE_ADS === 'true';

let adsModule = null;

if (ENABLE_ADS) {
  try {
    adsModule = require('react-native-google-mobile-ads');
  } catch (error) {
    const message = 'AdMob module unavailable in this build; rewarded ads disabled.';
    if (__DEV__) {
      console.log(message);
    } else {
      console.warn(message);
    }
  }
}

const PROD_REWARDED_AD_UNIT_ID = Platform.select({
  ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID_IOS,
  android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID,
  default: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID,
}) || 'your-real-ad-unit-id';
const isPlaceholderAdUnit =
  !PROD_REWARDED_AD_UNIT_ID ||
  PROD_REWARDED_AD_UNIT_ID.includes('your-real-ad-unit-id');

const TestIds = adsModule?.TestIds;
const RewardedAd = adsModule?.RewardedAd;
const RewardedAdEventType = adsModule?.RewardedAdEventType;
const InterstitialAd = adsModule?.InterstitialAd;
const AdEventType = adsModule?.AdEventType;
const AdErrorEventType = AdEventType?.ERROR;

// Use test IDs in development and as a guardrail when production IDs are not set.
const adUnitId = __DEV__ || isPlaceholderAdUnit
  ? (TestIds?.REWARDED || PROD_REWARDED_AD_UNIT_ID)
  : PROD_REWARDED_AD_UNIT_ID;

const effectiveAdUnitId = __DEV__ && TestIds ? TestIds.REWARDED : adUnitId;

const PROD_INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID_IOS,
  android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID,
  default: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID,
}) || 'your-real-interstitial-id';
const isPlaceholderInterstitial = !PROD_INTERSTITIAL_AD_UNIT_ID || PROD_INTERSTITIAL_AD_UNIT_ID.includes('your-real-interstitial-id');

const interstitialAdUnitId = __DEV__ || isPlaceholderInterstitial
  ? (TestIds?.INTERSTITIAL || PROD_INTERSTITIAL_AD_UNIT_ID)
  : PROD_INTERSTITIAL_AD_UNIT_ID;

export const rewarded = ENABLE_ADS && RewardedAd
  ? RewardedAd.createForAdRequest(effectiveAdUnitId, {
      keywords: ['bible', 'christian', 'trivia', 'education'],
    })
  : null;

export const interstitial = ENABLE_ADS && InterstitialAd
  ? InterstitialAd.createForAdRequest(interstitialAdUnitId, {
      keywords: ['bible', 'christian', 'trivia', 'education'],
    })
  : null;

export const isAdsAvailable = !!rewarded;
export const isInterstitialAvailable = !!interstitial;

export const initAds = () => {
  try {
    if (rewarded) rewarded.load();
    if (interstitial) interstitial.load();
  } catch (error) {
    if (__DEV__) console.warn('AdMob failed to start loading:', error?.message || error);
  }
  return true;
};

export const showInterstitialAd = () => {
  if (!interstitial || !AdEventType) return;

  const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    interstitial.show();
  });

  const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    interstitial.load();
  });

  if (interstitial.loaded) {
    interstitial.show();
  } else {
    interstitial.load();
  }

  return () => {
    unsubscribeLoaded();
    unsubscribeClosed();
  };
};

export const showRewardedAd = (onComplete) => {
  if (!rewarded || !RewardedAdEventType) {
    onComplete(false, { reason: 'module_unavailable' });
    return () => {};
  }

  let finished = false;

  const completeOnce = (success, meta) => {
    if (finished) return;
    finished = true;
    onComplete(success, meta);
  };

  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    rewarded.show();
  });

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    reward => {
      console.log('User earned reward of ', reward);
      completeOnce(true, { reason: 'earned', reward });
    }
  );

  const unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
    // Reload for next time
    rewarded.load();
    completeOnce(false, { reason: 'closed' });
  });

  const unsubscribeError = AdErrorEventType
    ? rewarded.addAdEventListener(AdErrorEventType, error => {
        completeOnce(false, { reason: 'load_failed', error });
      })
    : () => {};

  // If already loaded, show it immediately
  if (rewarded.loaded) {
    rewarded.show();
  } else {
    rewarded.load();
  }

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
    unsubscribeClosed();
    unsubscribeError();
  };
};
