import * as Haptics from 'expo-haptics';

let isEnabled = true;

export async function triggerHaptic(type = 'light') {
  if (!isEnabled) return;
  
  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {}
}

export function setHapticsEnabled(enabled) {
  isEnabled = enabled;
}

export async function vibrateOnCorrect() {
  await triggerHaptic('success');
}

export async function vibrateOnWrong() {
  await triggerHaptic('error');
}

export async function vibrateOnSelection() {
  await triggerHaptic('light');
}
