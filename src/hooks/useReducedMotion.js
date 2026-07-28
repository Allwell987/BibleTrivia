import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export default function useReducedMotion() {
  const [reducedMotionEnabled, setReducedMotionEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (typeof AccessibilityInfo?.isReduceMotionEnabled === 'function') {
      AccessibilityInfo.isReduceMotionEnabled()
        .then((enabled) => {
          if (mounted) setReducedMotionEnabled(Boolean(enabled));
        })
        .catch(() => {});
    }

    const subscription = AccessibilityInfo?.addEventListener?.(
      'reduceMotionChanged',
      (enabled) => setReducedMotionEnabled(Boolean(enabled))
    );

    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  return reducedMotionEnabled;
}
