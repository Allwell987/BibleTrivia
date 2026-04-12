import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from './src/context/ThemeContext';
import { ProgressProvider } from './src/context/ProgressContext';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import { loadSounds, unloadSounds } from './src/utils/sounds';
import { loadSettings } from './src/utils/storage';
import { setHapticsEnabled } from './src/utils/haptics';
import { trackScreenView } from './src/utils/analytics';
import { initializePurchases } from './src/utils/purchases';
import { initAds } from './src/utils/ads';
import { logStartupConfigHealth } from './src/utils/configHealth';

import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import ShopScreen from './src/screens/ShopScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import CustomQuizScreen from './src/screens/CustomQuizScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import ReflectionsScreen from './src/screens/ReflectionsScreen';
import { isOnboarded } from './src/utils/storage';

const Stack = createNativeStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function AppNavigator() {
  const [isOnboard, setIsOnboard] = useState(null);

  useEffect(() => {
    isOnboarded().then(setIsOnboard);
  }, []);

  if (isOnboard === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0D0A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#C9A84C" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isOnboard ? 'Home' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Journey" component={JourneyScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Collection" component={CollectionScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Reflections" component={ReflectionsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Result" component={ResultScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Challenge" component={ChallengeScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Shop" component={ShopScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="CustomQuiz" component={CustomQuizScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [boundaryKey, setBoundaryKey] = useState(0);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          loadSounds(),
          initAds(),
          initializePurchases().catch(e => console.warn('Failed to initialize purchases:', e)),
          loadSettings().then(settings => {
            setHapticsEnabled(settings.hapticEnabled);
          })
        ]);
        logStartupConfigHealth();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();

    return () => {
      unloadSounds();
    };
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once we are ready
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary onRetry={() => setBoundaryKey(prev => prev + 1)}>
        <View style={{ flex: 1 }} key={boundaryKey}>
          <AuthProvider>
            <ThemeProvider>
              <ProgressProvider>
                <NavigationContainer
                  ref={navigationRef}
                  onReady={() => {
                    routeNameRef.current = navigationRef.getCurrentRoute()?.name;
                    if (routeNameRef.current) {
                      trackScreenView(routeNameRef.current);
                    }
                  }}
                  onStateChange={() => {
                    const previousRouteName = routeNameRef.current;
                    const currentRouteName = navigationRef.getCurrentRoute()?.name;

                    if (currentRouteName && previousRouteName !== currentRouteName) {
                      trackScreenView(currentRouteName, { previous_screen: previousRouteName || null });
                    }

                    routeNameRef.current = currentRouteName;
                  }}
                >
                  <StatusBar style="light" />
                  <AppNavigator />
                </NavigationContainer>
              </ProgressProvider>
            </ThemeProvider>
          </AuthProvider>
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
