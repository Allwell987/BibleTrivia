import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/context/ThemeContext';
import { ProgressProvider } from './src/context/ProgressContext';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import { loadSounds, unloadSounds } from './src/utils/sounds';
import { loadSettings } from './src/utils/storage';
import { setHapticsEnabled } from './src/utils/haptics';
import { trackScreenView } from './src/utils/analytics';
import { initializePurchases } from './src/utils/purchases';
// import { initAds } from './src/utils/ads';

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
import { isOnboarded } from './src/utils/storage';

const Stack = createNativeStackNavigator();

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
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Challenge" component={ChallengeScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [boundaryKey, setBoundaryKey] = useState(0);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  useEffect(() => {
    loadSounds();
    // initAds();
    initializePurchases().catch(e => console.warn('Failed to initialize purchases:', e));

    loadSettings().then(settings => {
      setHapticsEnabled(settings.hapticEnabled);
    });

    return () => {
      unloadSounds();
    };
  }, []);

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
