import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const existing = await loadEvents();
  const updated = [event, ...existing].slice(0, MAX_EVENTS);
  await saveEvents(updated);

  if (__DEV__ && process.env.NODE_ENV !== 'test') {
    console.log('[analytics]', name, params);
  }

  return event;
}

export async function trackScreenView(screenName, params = {}) {
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
