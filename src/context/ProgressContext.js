import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from './AuthContext';

const PROGRESS_KEY = 'bible_trivia_progress';

const DEFAULT_PROGRESS = {
  unlockedDifficulties: ['easy'],
  easyHighScore: 0,
  mediumHighScore: 0,
  hardHighScore: 0,
  easyCompleted: 0,
  mediumCompleted: 0,
  hardCompleted: 0,
  totalQuestionsAnswered: 0,
  highestStreak: 0,
  coins: 200, // "Wisdom" currency for hints
  lastDailyReward: null, // Timestamp for the last time they claimed a reward
};

export const DifficultyRequirements = {
  medium: {
    type: 'easyScore',
    value: 70,
    description: 'Score 70% or higher on Easy difficulty',
  },
  hard: {
    type: 'mediumScore',
    value: 70,
    description: 'Score 70% or higher on Medium difficulty',
  },
};

export function checkUnlocks(progress) {
  const updated = { ...progress };

  if (!updated.unlockedDifficulties.includes('medium')) {
    if (progress.easyHighScore >= DifficultyRequirements.medium.value) {
      updated.unlockedDifficulties = [...updated.unlockedDifficulties, 'medium'];
    }
  }

  if (!updated.unlockedDifficulties.includes('hard')) {
    if (progress.mediumHighScore >= DifficultyRequirements.hard.value) {
      updated.unlockedDifficulties = [...updated.unlockedDifficulties, 'hard'];
    }
  }

  return updated;
}

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    loadInitialProgress();
  }, []);

  // Sync with Cloud when user logs in
  useEffect(() => {
    if (user && !loading && isFirebaseConfigured) {
      syncWithCloud();
    }
  }, [user, loading]);

  const loadInitialProgress = async () => {
    try {
      const raw = await AsyncStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });
      }
    } catch (e) {
      console.warn('Failed to load local progress:', e);
    }
    setLoading(false);
  };

  const syncWithCloud = async () => {
    if (!user || !isFirebaseConfigured) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const cloudProgress = userDoc.data()?.progress || {};
        // Merge strategy: Take the best of both (local vs cloud)
        const merged = mergeProgress(progress, cloudProgress);
        setProgress(merged);
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));

        // Update cloud if local had better stats
        if (JSON.stringify(merged) !== JSON.stringify(cloudProgress)) {
          await setDoc(
            userDocRef,
            {
              progress: merged,
              lastSync: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      } else {
        // First time login: Upload current local progress to cloud
        await setDoc(
          userDocRef,
          {
            email: user.email || null,
            progress,
            lastSync: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error('Cloud sync failed:', e);
    }
  };

  const mergeProgress = (local = {}, cloud = {}) => {
    const safeLocal = { ...DEFAULT_PROGRESS, ...(local || {}) };
    const safeCloud = { ...DEFAULT_PROGRESS, ...(cloud || {}) };
    const merged = { ...DEFAULT_PROGRESS, ...safeLocal };

    // Higher scores
    merged.easyHighScore = Math.max(safeLocal.easyHighScore || 0, safeCloud.easyHighScore || 0);
    merged.mediumHighScore = Math.max(safeLocal.mediumHighScore || 0, safeCloud.mediumHighScore || 0);
    merged.hardHighScore = Math.max(safeLocal.hardHighScore || 0, safeCloud.hardHighScore || 0);

    // Coins - take the higher amount (safety first)
    merged.coins = Math.max(safeLocal.coins || 0, safeCloud.coins || 0);

    // Cumulative totals
    merged.easyCompleted = Math.max(safeLocal.easyCompleted || 0, safeCloud.easyCompleted || 0);
    merged.mediumCompleted = Math.max(safeLocal.mediumCompleted || 0, safeCloud.mediumCompleted || 0);
    merged.hardCompleted = Math.max(safeLocal.hardCompleted || 0, safeCloud.hardCompleted || 0);
    merged.totalQuestionsAnswered = Math.max(
      safeLocal.totalQuestionsAnswered || 0,
      safeCloud.totalQuestionsAnswered || 0
    );
    merged.highestStreak = Math.max(safeLocal.highestStreak || 0, safeCloud.highestStreak || 0);

    // Unlocked sets (unique items)
    merged.unlockedDifficulties = Array.from(new Set([
      ...(safeLocal.unlockedDifficulties || []),
      ...(safeCloud.unlockedDifficulties || [])
    ]));

    return checkUnlocks(merged);
  };

  const saveProgress = async (newProgress) => {
    try {
      // Save Local
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));

      // Save Cloud if logged in
      if (user && isFirebaseConfigured) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            progress: newProgress,
            lastUpdated: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  };

  const updateProgress = async (difficulty, score, total) => {
    const pct = Math.round((score / total) * 100);
    let updated = { ...progress };

    const key = `${difficulty}HighScore`;
    const completedKey = `${difficulty}Completed`;
    
    if (pct > (updated[key] || 0)) {
      updated[key] = pct;
    }
    updated[completedKey] = (updated[completedKey] || 0) + 1;
    updated.totalQuestionsAnswered = (updated.totalQuestionsAnswered || 0) + total;

    // Reward for completing a quiz (e.g., 10 coins per quiz)
    updated.coins = (updated.coins || 0) + 10;

    updated = checkUnlocks(updated);
    
    setProgress(updated);
    await saveProgress(updated);
    
    return updated.unlockedDifficulties;
  };

  const spendCoins = async (amount) => {
    if (progress.coins < amount) return false;

    const updated = {
      ...progress,
      coins: progress.coins - amount
    };

    setProgress(updated);
    await saveProgress(updated);
    return true;
  };

  const earnCoins = async (amount) => {
    const updated = {
      ...progress,
      coins: (progress.coins || 0) + amount
    };

    setProgress(updated);
    await saveProgress(updated);
  };

  const claimDailyReward = async () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    if (progress.lastDailyReward && (now - progress.lastDailyReward < dayInMs)) {
      return { success: false, timeLeft: dayInMs - (now - progress.lastDailyReward) };
    }

    const reward = 50; // wisdom coins
    const updated = {
      ...progress,
      coins: (progress.coins || 0) + reward,
      lastDailyReward: now
    };

    setProgress(updated);
    await saveProgress(updated);
    return { success: true, reward };
  };

  const isUnlocked = (difficulty) => {
    return progress.unlockedDifficulties.includes(difficulty);
  };

  const getDifficultyInfo = (difficulty) => {
    const requirements = DifficultyRequirements[difficulty];
    if (!requirements) return null;

    let currentProgress = 0;
    if (requirements.type === 'easyScore') {
      currentProgress = progress.easyHighScore;
    } else if (requirements.type === 'mediumScore') {
      currentProgress = progress.mediumHighScore;
    }

    return {
      ...requirements,
      currentProgress,
      requiredProgress: requirements.value,
      progress: Math.min(currentProgress / requirements.value, 1),
      unlocked: isUnlocked(difficulty),
    };
  };

  const resetProgress = async () => {
    setProgress(DEFAULT_PROGRESS);
    await AsyncStorage.removeItem(PROGRESS_KEY);
    if (user && isFirebaseConfigured) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          progress: DEFAULT_PROGRESS,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      loading,
      updateProgress,
      spendCoins,
      earnCoins,
      addCoins: earnCoins, // Alias for purchase flow
      claimDailyReward,
      isUnlocked,
      getDifficultyInfo,
      resetProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
