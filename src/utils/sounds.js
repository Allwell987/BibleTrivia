import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

let correctSound = null;
let wrongSound = null;
let tickSound = null;
let powerupSound = null;

export async function loadSounds() {
  try {
    await setAudioModeAsync({ playsInSilentMode: true });

    correctSound = createAudioPlayer(require('../../assets/sounds/correct.wav'));
    correctSound.volume = 0.7;

    wrongSound = createAudioPlayer(require('../../assets/sounds/wrong.wav'));
    wrongSound.volume = 0.7;

    tickSound = createAudioPlayer(require('../../assets/sounds/tick.wav'));
    tickSound.volume = 0.4;

    // Fallback to correct.wav if powerup.wav is missing from assets to avoid runtime errors
    try {
      powerupSound = createAudioPlayer(require('../../assets/sounds/correct.wav'));
      powerupSound.volume = 0.6;
    } catch (e) {
      console.warn('Powerup sound failed to load:', e.message);
    }

  } catch (error) {
    console.warn('Sound load failed:', error.message);
  }
}

async function playSound(player) {
  if (player) {
    try {
      // For short sounds, we often want to restart them if played rapidly
      await player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn('Failed to play sound:', error.message);
    }
  }
}

export async function playCorrect() {
  await playSound(correctSound);
}

export async function playWrong() {
  await playSound(wrongSound);
}

export async function playTick() {
  await playSound(tickSound);
}

export async function playPowerup() {
  await playSound(powerupSound);
}

export async function unloadSounds() {
  try {
    if (correctSound) correctSound.remove();
    if (wrongSound) wrongSound.remove();
    if (tickSound) tickSound.remove();
    if (powerupSound) powerupSound.remove();
  } catch (error) {
    console.warn('Failed to unload sounds:', error.message);
  }
}
