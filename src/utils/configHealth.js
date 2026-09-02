const REQUIRED_ENV_KEYS = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
  'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  'EXPO_PUBLIC_REVENUECAT_IOS_KEY',
  'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY',
  'EXPO_PUBLIC_USE_MOCK_PURCHASES',
];

const PLACEHOLDER_PATTERNS = ['YOUR_', 'your-real-'];

const isPlaceholderValue = (value) => {
  if (!value || typeof value !== 'string') return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => value.includes(pattern));
};

const isLikelyTestRevenueCatKey = (key) =>
  typeof key === 'string' && key.startsWith('test_');

const AD_KEYS = [
  'EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID',
  'EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID',
];

export const getMissingStartupConfigKeys = () => {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);

  if (process.env.EXPO_PUBLIC_ENABLE_ADS === 'true') {
    missing.push(...AD_KEYS.filter((key) => !process.env[key]));
  }

  return missing;
};

export const getStartupConfigWarnings = () => {
  const warnings = [];

  const iosRevenueCatKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
  const androidRevenueCatKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  const useMockPurchases = process.env.EXPO_PUBLIC_USE_MOCK_PURCHASES === 'true';
  const isProduction = !__DEV__;

  if (isProduction && useMockPurchases) {
    warnings.push('EXPO_PUBLIC_USE_MOCK_PURCHASES is true in production build.');
  }

  if (isProduction && isLikelyTestRevenueCatKey(iosRevenueCatKey)) {
    warnings.push('EXPO_PUBLIC_REVENUECAT_IOS_KEY looks like a test key in production build.');
  }

  if (isProduction && isLikelyTestRevenueCatKey(androidRevenueCatKey)) {
    warnings.push('EXPO_PUBLIC_REVENUECAT_ANDROID_KEY looks like a test key in production build.');
  }

  if (process.env.EXPO_PUBLIC_ENABLE_ADS === 'true') {
    AD_KEYS.forEach((key) => {
      if (isPlaceholderValue(process.env[key])) {
        warnings.push(`${key} looks like a placeholder value.`);
      }
    });
  }

  return warnings;
};

export const logStartupConfigHealth = () => {
  const missingKeys = getMissingStartupConfigKeys();
  const warnings = getStartupConfigWarnings();

  if (missingKeys.length === 0 && warnings.length === 0) {
    return;
  }

  if (missingKeys.length > 0) {
    console.warn(
      '[config] Missing environment values:',
      missingKeys.join(', ')
    );
  }

  if (warnings.length > 0) {
    console.warn(
      '[config] Configuration warnings:',
      warnings.join(' | ')
    );
  }
};
