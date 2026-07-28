import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const SCORES_KEY_EASY   = 'bible_trivia_scores_easy';
const SCORES_KEY_MEDIUM = 'bible_trivia_scores_medium';
const SCORES_KEY_HARD   = 'bible_trivia_scores_hard';
const SETTINGS_KEY = 'bible_trivia_settings';
const STATS_KEY = 'bible_trivia_stats';
const STREAK_KEY = 'bible_trivia_streak';
const ONBOARDED_KEY = 'bible_trivia_onboarded';
const ACHIEVEMENTS_KEY = 'bible_trivia_achievements';
const MAX_SCORES = 10;

function scoresKey(difficulty) {
  if (difficulty === 'easy') return SCORES_KEY_EASY;
  if (difficulty === 'hard') return SCORES_KEY_HARD;
  return SCORES_KEY_MEDIUM;
}

export async function loadScores(difficulty, { useCloud = false } = {}) {
  try {
    if (useCloud && isFirebaseConfigured) {
      const scoresRef = collection(db, 'leaderboard');
      let q;
      if (difficulty && difficulty !== 'all') {
        q = query(
          scoresRef,
          where('difficulty', '==', difficulty.toLowerCase()),
          orderBy('pct', 'desc'),
          orderBy('score', 'desc'),
          limit(20)
        );
      } else {
        q = query(
          scoresRef,
          orderBy('pct', 'desc'),
          orderBy('score', 'desc'),
          limit(20)
        );
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    if (difficulty) {
      const raw = await AsyncStorage.getItem(scoresKey(difficulty));
      return raw ? JSON.parse(raw) : [];
    }
    const [easy, medium, hard] = await Promise.all([
      loadScores('easy'),
      loadScores('medium'),
      loadScores('hard'),
    ]);
    return [...easy, ...medium, ...hard].sort((a, b) => b.pct - a.pct || b.score - a.score);
  } catch (error) {
    console.warn('Failed to load scores:', error);
    return [];
  }
}

export async function saveScore({ name, score, total, difficulty, timeLeft, date, userId = null }) {
  try {
    const effectiveDifficulty = difficulty || 'medium';
    const entry = {
      id: Date.now().toString(),
      name: name || 'Player',
      score,
      total,
      difficulty: effectiveDifficulty,
      pct: Math.round((score / total) * 100),
      timeLeft,
      date: date || new Date().toLocaleDateString(),
    };

    // Save locally
    const key = scoresKey(effectiveDifficulty);
    const existing = await loadScores(effectiveDifficulty);
    const updated = [entry, ...existing]
      .sort((a, b) => b.pct - a.pct || b.score - a.score)
      .slice(0, MAX_SCORES);
    await AsyncStorage.setItem(key, JSON.stringify(updated));

    // Save to cloud if configured
    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'leaderboard'), {
          ...entry,
          userId,
          createdAt: Timestamp.now(),
        });
      } catch (cloudError) {
        console.warn('Cloud score sync failed:', cloudError);
      }
    }

    const rank = updated.findIndex(e => e.id === entry.id) + 1;
    return { entries: updated, rank, isPersonalBest: rank === 1 };
  } catch (error) {
    console.warn('Failed to save score:', error);
    return { entries: [], rank: null, isPersonalBest: false };
  }
}

export async function clearScores() {
  try {
    await Promise.all([
      AsyncStorage.removeItem(SCORES_KEY_EASY),
      AsyncStorage.removeItem(SCORES_KEY_MEDIUM),
      AsyncStorage.removeItem(SCORES_KEY_HARD),
    ]);
  } catch {}
}

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  hapticEnabled: true,
  theme: 'dark',
  defaultTimer: 15,
  showExplanations: true,
  defaultDifficulty: 'medium',
};

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export async function updateSetting(key, value) {
  const settings = await loadSettings();
  settings[key] = value;
  await saveSettings(settings);
  return settings;
}

export async function resetStats() {
  // Stats and streaks are now managed in ProgressContext
  // This function is kept for backward compatibility but should be replaced with context actions if needed
  try {
    const STATS_KEY = 'bible_trivia_stats';
    const STREAK_KEY = 'bible_trivia_streak';
    await AsyncStorage.removeItem(STATS_KEY);
    await AsyncStorage.removeItem(STREAK_KEY);
  } catch {}
}

export async function isOnboarded() {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDED_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

export async function setOnboarded(value = true) {
  try {
    await AsyncStorage.setItem(ONBOARDED_KEY, value.toString());
  } catch {}
}

export async function loadAchievements() {
  try {
    const raw = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveAchievement(achievementId) {
  try {
    const existing = await loadAchievements();
    if (!existing.includes(achievementId)) {
      const updated = [...existing, achievementId];
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      return updated;
    }
    return existing;
  } catch {
    return [];
  }
}

export async function saveAchievements(achievementIds) {
  try {
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementIds));
    return achievementIds;
  } catch {
    return [];
  }
}

export async function resetAchievements() {
  try {
    await AsyncStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch {}
}
