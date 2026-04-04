const REQUIRED_ENV_KEYS = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
  'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
  'EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID',
  'EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID',
  'EXPO_PUBLIC_REVENUECAT_IOS_KEY',
  'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY',
  'EXPO_PUBLIC_USE_MOCK_PURCHASES',
];

export const getMissingStartupConfigKeys = () =>
  REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);

export const logStartupConfigHealth = () => {
  const missingKeys = getMissingStartupConfigKeys();

  if (missingKeys.length === 0) {
    return;
  }

  console.warn(
    '[config] Missing environment values:',
    missingKeys.join(', ')
  );
};
