import AsyncStorage from '@react-native-async-storage/async-storage';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebase';

const ANALYTICS_KEY = 'bible_trivia_analytics_events';
const MAX_EVENTS = 200;

async function loadEvents() {
  try {
    const raw = await AsyncStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveEvents(events) {
  try {
    await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch {}
}

export async function trackEvent(name, params = {}) {
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    params,
    timestamp: new Date().toISOString(),
  };

  // 1. Local Persistence (Legacy)
  const existing = await loadEvents();
  const updated = [event, ...existing].slice(0, MAX_EVENTS);
  await saveEvents(updated);

  // 2. Firebase Sync
  try {
    if (analytics) {
      // Firebase analytics names can't contain spaces and must be <= 40 chars
      const sanitizedName = name.replace(/\s+/g, '_').slice(0, 40);
      logEvent(analytics, sanitizedName, params);
    }
  } catch (err) {
    if (__DEV__) {
      console.warn('[analytics] Firebase logEvent failed:', err);
    }
  }

  if (__DEV__ && process.env.NODE_ENV !== 'test') {
    console.log('[analytics]', name, params);
  }

  return event;
}

export async function trackScreenView(screenName, params = {}) {
  // Use trackEvent which now handles Firebase
  return trackEvent('screen_view', {
    screen_name: screenName,
    ...params,
  });
}

export async function getAnalyticsEvents(limit = 50) {
  const events = await loadEvents();
  return events.slice(0, limit);
}

export async function clearAnalyticsEvents() {
  await AsyncStorage.removeItem(ANALYTICS_KEY);
}
