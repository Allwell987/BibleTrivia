import { RewardedAd, TestIds, RewardedAdEventType } from 'react-native-google-mobile-ads';

// Use TestIds for development, replace with your real Ad Unit ID later
const adUnitId = __DEV__ ? TestIds.REWARDED : 'your-real-ad-unit-id';

export const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['bible', 'christian', 'trivia', 'education'],
});

export const initAds = () => {
  // Pre-load the ad
  rewarded.load();
};

export const showRewardedAd = (onComplete) => {
  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    rewarded.show();
  });

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    reward => {
      console.log('User earned reward of ', reward);
      onComplete(true);
    }
  );

  const unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
    // Reload for next time
    rewarded.load();
    onComplete(false);
  });

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
  };
};
