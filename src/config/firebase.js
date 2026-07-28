import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getEnvOrPlaceholder = (key, placeholder) => process.env[key] || placeholder;

// Configure Firebase with EXPO_PUBLIC_* values from .env.
const firebaseConfig = {
  apiKey: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_API_KEY', 'YOUR_API_KEY'),
  authDomain: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'your-project-id.firebaseapp.com'),
  projectId: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'your-project-id'),
  storageBucket: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'your-project-id.appspot.com'),
  messagingSenderId: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'YOUR_MESSAGING_SENDER_ID'),
  appId: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_APP_ID', 'YOUR_APP_ID'),
  measurementId: getEnvOrPlaceholder('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID', 'YOUR_MEASUREMENT_ID')
};

const isPlaceholderValue = (value) =>
  typeof value === 'string' &&
  (value.includes('YOUR_') || value.includes('your-project-id'));

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(isPlaceholderValue);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use persistent auth for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export default app;
