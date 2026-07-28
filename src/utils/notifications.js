export async function requestNotificationPermission() {
  try {
    // Lazy-load to avoid hard dependency in environments where Expo Notifications isn't installed.
    const Notifications = require('expo-notifications');

    const current = await Notifications.getPermissionsAsync();
    if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return { granted: true, status: current.status || 'granted' };
    }

    const requested = await Notifications.requestPermissionsAsync();
    const granted = !!requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    return { granted, status: requested.status || (granted ? 'granted' : 'denied') };
  } catch (error) {
    // Non-fatal: app can continue even when notifications module is not available.
    return { granted: false, status: 'unavailable', error: error?.message || 'unavailable' };
  }
}

