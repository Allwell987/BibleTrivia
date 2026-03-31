import { Audio } from 'expo-audio';

let correctSound = null;
let wrongSound = null;
let tickSound = null;

export async function loadSounds() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    ({ sound: correctSound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/correct.wav'),
      { shouldPlay: false, volume: 0.7 }
    ));
    ({ sound: wrongSound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/wrong.wav'),
      { shouldPlay: false, volume: 0.7 }
    ));
    ({ sound: tickSound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/tick.wav'),
      { shouldPlay: false, volume: 0.4 }
    ));
  } catch (error) {
    console.warn('Sound load failed:', error.message);
  }
}

export async function playCorrect() {
  try {
    if (correctSound) {
      await correctSound.replayAsync();
    }
  } catch (error) {
    console.warn('Failed to play correct sound:', error.message);
  }
}

export async function playWrong() {
  try {
    if (wrongSound) {
      await wrongSound.replayAsync();
    }
  } catch (error) {
    console.warn('Failed to play wrong sound:', error.message);
  }
}

export async function playTick() {
  try {
    if (tickSound) {
      await tickSound.replayAsync();
    }
  } catch (error) {
    console.warn('Failed to play tick sound:', error.message);
  }
}

export async function unloadSounds() {
  try {
    if (correctSound) await correctSound.unloadAsync();
    if (wrongSound) await wrongSound.unloadAsync();
    if (tickSound) await tickSound.unloadAsync();
  } catch (error) {
    console.warn('Failed to unload sounds:', error.message);
  }
}
