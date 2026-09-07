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
  deleteUser,
  getReactNativePersistence
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { trackEvent } from '../utils/analytics';
import { identifyPurchasesUser, clearPurchasesUser } from '../utils/purchases';
import { clearAllLocalData, deleteLeaderboardEntriesForUser } from '../utils/storage';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();
const GOOGLE_CLIENT_IDS = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
};

const isConfiguredClientId = (clientId) => clientId && !clientId.startsWith('YOUR_');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const lastUserIdRef = useRef(null);

  // Google Login Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    ...GOOGLE_CLIENT_IDS,
    selectAccount: true,
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
          trackEvent('auth_state_changed', { state: 'signed_in', provider: firebaseUser.providerData[0]?.providerId });
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
      const { id_token, authentication } = response.params;
      const token = id_token || authentication?.idToken;

      if (token) {
        const credential = GoogleAuthProvider.credential(token);
        signInWithCredential(auth, credential)
          .then(() => {
            trackEvent('auth_action_success', { method: 'google' });
          })
          .catch((error) => {
            console.error('Firebase Google Auth error:', error);
            let userMessage = 'Firebase authentication failed';
            if (error.code === 'auth/invalid-credential') userMessage = 'Invalid Google credentials.';
            if (error.code === 'auth/account-exists-with-different-credential') userMessage = 'An account already exists with this email using a different sign-in method.';

            setAuthError(userMessage);
            trackEvent('auth_action_failed', { method: 'google', reason: error.code || 'firebase_error' });
          })
          .finally(() => {
            setIsGoogleLoading(false);
          });
      } else {
        console.error('Google Auth success but no id_token found', response);
        setAuthError('Authentication failed: Missing ID token from Google.');
        setIsGoogleLoading(false);
        trackEvent('auth_action_failed', { method: 'google', reason: 'missing_token' });
      }
    } else if (response?.type === 'error' || response?.type === 'cancel') {
      setIsGoogleLoading(false);
      if (response.type === 'error') {
        console.error('Google Auth error:', response.error);
        setAuthError(response.error?.message || 'Google sign-in failed');
        trackEvent('auth_action_failed', { method: 'google', reason: 'provider_error' });
      } else {
        trackEvent('auth_action_cancelled', { method: 'google' });
      }
    }
  }, [response, isGoogleSignInAvailable]);

  const signInWithApple = async () => {
    try {
      setAuthError(null);
      if (!isFirebaseConfigured) {
        Alert.alert(
          'Sign in unavailable',
          'Firebase is not configured for this build yet.'
        );
        return;
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Unavailable', 'Apple Authentication is not available on this device.');
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
      if (!identityToken) {
        throw new Error('No identity token returned from Apple');
      }

      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: identityToken,
      });

      await signInWithCredential(auth, firebaseCredential);
      trackEvent('auth_action_requested', { method: 'apple' });
      trackEvent('auth_action_success', { method: 'apple' });
    } catch (e) {
      if (e.code !== 'ERR_CANCELED' && e.code !== 'ERR_REQUEST_CANCELED') {
        console.error('Apple Sign-In Error:', e);
        setAuthError(e.message || 'Apple Sign-In failed');
        trackEvent('auth_action_failed', { method: 'apple', reason: e.code || 'unknown_error' });
      }
    }
  };

  const signInWithGoogle = async () => {
    if (!isGoogleSignInAvailable) {
      Alert.alert(
        'Google Sign-In unavailable',
        'Check your client IDs in .env. Both iOS and Android IDs are required for native builds.'
      );
      return;
    }

    try {
      setAuthError(null);
      setIsGoogleLoading(true);
      trackEvent('auth_action_requested', { method: 'google' });

      // For Google, we use the promptAsync which is handled by the useEffect hook
      const result = await promptAsync();

      if (result.type !== 'success') {
        setIsGoogleLoading(false);
      }
    } catch (e) {
      console.error('signInWithGoogle error:', e);
      setAuthError(e.message || 'An unexpected error occurred during Google sign-in');
      setIsGoogleLoading(false);
      trackEvent('auth_action_failed', { method: 'google', reason: 'prompt_error' });
    }
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

  // Permanently deletes the signed-in user's cloud account, leaderboard entries, and local data.
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, error: 'not_signed_in' };
    }

    try {
      if (isFirebaseConfigured) {
        await deleteLeaderboardEntriesForUser(currentUser.uid);
        await deleteDoc(doc(db, 'users', currentUser.uid)).catch(() => {});
        await deleteUser(currentUser);
      }

      await clearPurchasesUser();
      await clearAllLocalData();
      trackEvent('auth_action_requested', { method: 'delete_account' });
      return { success: true };
    } catch (e) {
      if (e.code === 'auth/requires-recent-login') {
        trackEvent('auth_action_failed', { method: 'delete_account', reason: 'requires_recent_login' });
        return { success: false, error: 'requires_recent_login' };
      }
      console.error('Delete account error:', e);
      trackEvent('auth_action_failed', { method: 'delete_account', reason: e.code || 'unknown_error' });
      return { success: false, error: e.code || 'unknown_error' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isGoogleLoading,
      authError,
      signInWithApple,
      signInWithGoogle,
      logout,
      deleteAccount,
      isAppleAvailable,
      isFirebaseConfigured,
      isGoogleSignInAvailable,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
