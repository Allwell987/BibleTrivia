import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure Firebase with EXPO_PUBLIC_* values from .env.
// NOTE: Literal access (process.env.KEY) is required for most bundlers to perform static replacement.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project-id.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project-id.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID'
};

const isPlaceholderValue = (value) =>
  typeof value === 'string' &&
  (value.includes('YOUR_') || value.includes('your-project-id'));

export const isFirebaseConfigured = !Object.entries(firebaseConfig).some(([key, value]) => {
  const isPlaceholder = isPlaceholderValue(value);
  if (isPlaceholder && __DEV__) {
    console.warn(`[Firebase] ${key} is not configured (using placeholder). Check your .env file.`);
  }
  return isPlaceholder;
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use persistent auth for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

// Initialize Analytics lazily as it might not be supported in all environments (e.g. non-browser)
export let analytics = null;
isSupported().then(supported => {
  if (supported && isFirebaseConfigured) {
    analytics = getAnalytics(app);
  }
});

export default app;
