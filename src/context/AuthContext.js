import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signOut,
  getReactNativePersistence
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { trackEvent } from '../utils/analytics';
import { identifyPurchasesUser, clearPurchasesUser } from '../utils/purchases';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();
const GOOGLE_CLIENT_IDS = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
};

const isConfiguredClientId = (clientId) => clientId && !clientId.startsWith('YOUR_');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const lastUserIdRef = useRef(null);

  // Google Login Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    ...GOOGLE_CLIENT_IDS,
  });
  const isGoogleSignInAvailable =
    isFirebaseConfigured &&
    Object.values(GOOGLE_CLIENT_IDS).every(isConfiguredClientId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem('bible_trivia_user', JSON.stringify(firebaseUser));
        await identifyPurchasesUser(firebaseUser.uid);

        if (lastUserIdRef.current !== firebaseUser.uid) {
          trackEvent('auth_state_changed', { state: 'signed_in' });
        }
        lastUserIdRef.current = firebaseUser.uid;
      } else {
        setUser(null);
        await AsyncStorage.removeItem('bible_trivia_user');
        await clearPurchasesUser();

        if (lastUserIdRef.current) {
          trackEvent('auth_state_changed', { state: 'signed_out' });
        }
        lastUserIdRef.current = null;
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (isMounted) {
          setIsAppleAvailable(available);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAppleAvailable(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && isGoogleSignInAvailable) {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response, isGoogleSignInAvailable]);

  const signInWithApple = async () => {
    try {
      if (!isFirebaseConfigured) {
        Alert.alert(
          'Sign in unavailable',
          'Firebase is not configured for this build yet.'
        );
        return;
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        alert('Apple Authentication is not available on this device.');
        trackEvent('auth_action_failed', { method: 'apple', reason: 'not_available' });
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = credential;
      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: identityToken,
      });

      await signInWithCredential(auth, firebaseCredential);
      trackEvent('auth_action_requested', { method: 'apple' });
    } catch (e) {
      if (e.code !== 'ERR_CANCELED') {
        console.error(e);
        trackEvent('auth_action_failed', { method: 'apple', reason: e.code || 'unknown_error' });
      }
    }
  };

  const signInWithGoogle = async () => {
    if (!isGoogleSignInAvailable) {
      Alert.alert(
        'Google Sign-In unavailable',
        'Add your Firebase and Google OAuth client IDs to enable Google Sign-In.'
      );
      return;
    }

    trackEvent('auth_action_requested', { method: 'google' });
    await promptAsync();
  };

  const logout = async () => {
    try {
      await signOut(auth);
      trackEvent('auth_action_requested', { method: 'logout' });
    } catch (e) {
      console.error("Logout error:", e);
      trackEvent('auth_action_failed', { method: 'logout', reason: 'signout_error' });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithApple,
      signInWithGoogle,
      logout,
      isAppleAvailable,
      isFirebaseConfigured,
      isGoogleSignInAvailable,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
