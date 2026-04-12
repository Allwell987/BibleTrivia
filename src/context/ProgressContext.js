import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from './AuthContext';
import { CHARACTERS, BIBLE_BOOKS } from '../data/collectibles';
import { checkProStatus, subscribeToCustomerInfo } from '../utils/purchases';

const PROGRESS_KEY = 'bible_trivia_progress';

const DEFAULT_PROGRESS = {
  unlockedDifficulties: ['easy'],
  easyHighScore: 0,
  mediumHighScore: 0,
  hardHighScore: 0,
  expertHighScore: 0,
  easyCompleted: 0,
  mediumCompleted: 0,
  hardCompleted: 0,
  expertCompleted: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  easyCorrect: 0,
  easyTotal: 0,
  mediumCorrect: 0,
  mediumTotal: 0,
  hardCorrect: 0,
  hardTotal: 0,
  expertCorrect: 0,
  expertTotal: 0,
  perfectScores: 0,
  lastPlayed: null,
  dailyChallengesCompleted: 0,
  currentStreak: 0,
  highestStreak: 0,
  lastCompletionDate: null,
  dailyChallengeCompleted: false,
  seenDailyQuestions: [],
  seenDidYouKnow: [],
  coins: 200,
  lastDailyReward: null,
  knowledgeLevel: 'Beginner',
  isPro: false,
  unlockedCharacters: [],
  unlockedBooks: [],
  bookProgress: {},
  reflections: [],
  unlockedEras: ['creation'],
  eraProgress: {
    creation: 0,
    patriarchs: 0,
    exodus: 0,
    wilderness: 0,
    conquest: 0,
    judges: 0,
    unitedKingdom: 0,
    wisdom: 0,
    dividedKingdom: 0,
    prophets: 0,
    exile: 0,
    return: 0,
    intertestamental: 0,
    gospels: 0,
    miracles: 0,
    parables: 0,
    acts: 0,
    missions: 0,
    letters: 0,
    revelation: 0,
  },
};

export const ERA_ORDER = [
  'creation',
  'patriarchs',
  'exodus',
  'wilderness',
  'conquest',
  'judges',
  'unitedKingdom',
  'wisdom',
  'dividedKingdom',
  'prophets',
  'exile',
  'return',
  'intertestamental',
  'gospels',
  'miracles',
  'parables',
  'acts',
  'missions',
  'letters',
  'revelation',
];

export const MASTERY_TIERS = {
  BRONZE: 10,
  SILVER: 30,
  GOLD: 75,
};

export const ERA_REQUIREMENTS = MASTERY_TIERS.BRONZE;

export const STREAK_MILESTONES = [
  { days: 7, name: "Days of Creation", icon: '🌍' },
  { days: 40, name: "Wilderness Journey", icon: '🏜️' },
  { days: 120, name: "Acts Church Builder", icon: '⛪' },
];

export const DifficultyRequirements = {
  medium: {
    source: 'easy',
    value: 80,
    sessions: 3,
    demoteBelow: 40,
    description: 'Complete 3 Easy quizzes with 80%+ accuracy',
  },
  hard: {
    source: 'medium',
    value: 80,
    sessions: 3,
    demoteBelow: 40,
    description: 'Complete 3 Medium quizzes with 80%+ accuracy',
  },
  expert: {
    source: 'hard',
    value: 80,
    sessions: 3,
    demoteBelow: 40,
    description: 'Complete 3 Hard quizzes with 80%+ accuracy',
  },
};

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'expert'];

export function getDifficultyAccuracy(progress = {}, difficulty) {
  const correct = progress[`${difficulty}Correct`] || 0;
  const total = progress[`${difficulty}Total`] || 0;
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getDifficultySessions(progress = {}, difficulty) {
  return progress[`${difficulty}Completed`] || 0;
}

const sortUnlockedDifficulties = (difficulties = []) =>
  Array.from(new Set(['easy', ...difficulties]))
    .filter((difficulty) => DIFFICULTY_ORDER.includes(difficulty))
    .sort((a, b) => DIFFICULTY_ORDER.indexOf(a) - DIFFICULTY_ORDER.indexOf(b));

const lockDifficultyAndAbove = (difficulties, difficulty) => {
  const lockIndex = DIFFICULTY_ORDER.indexOf(difficulty);
  return difficulties.filter((level) => DIFFICULTY_ORDER.indexOf(level) < lockIndex);
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const appendSeenEntry = (entries = [], key) => {
  if (!key) return entries;
  const nowISO = new Date().toISOString();
  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
  const base = (entries || []).filter((entry) => entry.date >= cutoff && entry.key !== key);
  return [{ key, date: nowISO }, ...base];
};

export function checkUnlocks(progress) {
  const updated = {
    ...progress,
    unlockedDifficulties: sortUnlockedDifficulties(progress.unlockedDifficulties),
  };

  Object.entries(DifficultyRequirements).forEach(([difficulty, requirement]) => {
    const accuracy = getDifficultyAccuracy(updated, requirement.source);
    const sessions = getDifficultySessions(updated, requirement.source);
    const sourceTotal = updated[`${requirement.source}Total`] || 0;

    if (!updated.unlockedDifficulties.includes(requirement.source)) {
      updated.unlockedDifficulties = lockDifficultyAndAbove(updated.unlockedDifficulties, difficulty);
      return;
    }

    if (sessions >= requirement.sessions && sourceTotal > 0 && accuracy < requirement.demoteBelow) {
      updated.unlockedDifficulties = lockDifficultyAndAbove(updated.unlockedDifficulties, difficulty);
      return;
    }

    if (
      sessions >= requirement.sessions &&
      accuracy >= requirement.value &&
      updated.unlockedDifficulties.includes(requirement.source) &&
      !updated.unlockedDifficulties.includes(difficulty)
    ) {
      updated.unlockedDifficulties = sortUnlockedDifficulties([
        ...updated.unlockedDifficulties,
        difficulty,
      ]);
    }
  });

  ERA_ORDER.forEach((era, index) => {
    if (index < ERA_ORDER.length - 1) {
      const nextEra = ERA_ORDER[index + 1];
      if (!updated.unlockedEras.includes(nextEra)) {
        const currentEraProgress = updated.eraProgress[era] || 0;
        if (currentEraProgress >= ERA_REQUIREMENTS) {
          updated.unlockedEras = [...updated.unlockedEras, nextEra];
        }
      }
    }
  });

  const unlockedCharacters = CHARACTERS
    .filter((character) => {
      const requirement = character.requirement || {};
      if (requirement.type !== 'era_mastery') return false;
      return (updated.eraProgress[requirement.era] || 0) >= (requirement.count || 0);
    })
    .map((character) => character.id);

  const unlockedBooks = BIBLE_BOOKS
    .filter((book) => (updated.bookProgress[book.name] || 0) >= book.questionsNeeded)
    .map((book) => book.id);

  updated.unlockedCharacters = Array.from(new Set([...(updated.unlockedCharacters || []), ...unlockedCharacters]));
  updated.unlockedBooks = Array.from(new Set([...(updated.unlockedBooks || []), ...unlockedBooks]));

  return updated;
}

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const persistProgressSnapshot = useCallback(async (snapshot) => {
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot));
      if (user && isFirebaseConfigured) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          progress: snapshot,
          lastUpdated: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Failed to persist progress snapshot:', e);
    }
  }, [user]);

  useEffect(() => {
    loadInitialProgress();
  }, []);

  useEffect(() => {
    if (user && !loading && isFirebaseConfigured) {
      syncWithCloud();
    }
  }, [user, loading]);

  useEffect(() => {
    if (loading) return () => {};

    let isActive = true;

    const applyProStatus = async (isPro) => {
      setProgress((prev) => {
        if (prev.isPro === isPro) return prev;
        const updated = { ...prev, isPro };
        persistProgressSnapshot(updated);
        return updated;
      });
    };

    checkProStatus().then((isPro) => {
      if (!isActive) return;
      applyProStatus(isPro);
    });

    const unsubscribe = subscribeToCustomerInfo(({ isPro }) => {
      if (!isActive) return;
      applyProStatus(isPro);
    });

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [loading, persistProgressSnapshot]);

  const loadInitialProgress = async () => {
    try {
      const raw = await AsyncStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        let merged = { ...DEFAULT_PROGRESS, ...parsed };
        merged = checkDailyReset(merged);
        setProgress(merged);
      }
    } catch (e) {
      console.warn('Failed to load local progress:', e);
    }
    setLoading(false);
  };

  const checkDailyReset = (currentProgress) => {
    const today = new Date().toISOString().split('T')[0];
    if (currentProgress.lastCompletionDate !== today) {
      return {
        ...currentProgress,
        dailyChallengeCompleted: false
      };
    }
    return currentProgress;
  };

  const syncWithCloud = async () => {
    if (!user || !isFirebaseConfigured) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const cloudProgress = userDoc.data()?.progress || {};
        const merged = mergeProgress(progress, cloudProgress);
        const final = checkDailyReset(merged);
        setProgress(final);
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(final));

        if (JSON.stringify(final) !== JSON.stringify(cloudProgress)) {
          await setDoc(userDocRef, {
            progress: final,
            lastSync: new Date().toISOString(),
          }, { merge: true });
        }
      } else {
        await setDoc(userDocRef, {
          email: user.email || null,
          progress,
          lastSync: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (e) {
      console.error('Cloud sync failed:', e);
    }
  };

  const mergeProgress = (local = {}, cloud = {}) => {
    const safeLocal = { ...DEFAULT_PROGRESS, ...(local || {}) };
    const safeCloud = { ...DEFAULT_PROGRESS, ...(cloud || {}) };
    const merged = { ...DEFAULT_PROGRESS, ...safeLocal };

    merged.easyHighScore = Math.max(safeLocal.easyHighScore || 0, safeCloud.easyHighScore || 0);
    merged.mediumHighScore = Math.max(safeLocal.mediumHighScore || 0, safeCloud.mediumHighScore || 0);
    merged.hardHighScore = Math.max(safeLocal.hardHighScore || 0, safeCloud.hardHighScore || 0);
    merged.expertHighScore = Math.max(safeLocal.expertHighScore || 0, safeCloud.expertHighScore || 0);
    merged.coins = Math.max(safeLocal.coins || 0, safeCloud.coins || 0);
    merged.totalQuestionsAnswered = Math.max(safeLocal.totalQuestionsAnswered || 0, safeCloud.totalQuestionsAnswered || 0);
    merged.currentStreak = Math.max(safeLocal.currentStreak || 0, safeCloud.currentStreak || 0);
    merged.highestStreak = Math.max(safeLocal.highestStreak || 0, safeCloud.highestStreak || 0);
    merged.isPro = safeLocal.isPro || safeCloud.isPro || false;
    merged.lastCompletionDate = safeLocal.lastCompletionDate || safeCloud.lastCompletionDate;

    merged.totalCorrect = Math.max(safeLocal.totalCorrect || 0, safeCloud.totalCorrect || 0);
    merged.easyCorrect = Math.max(safeLocal.easyCorrect || 0, safeCloud.easyCorrect || 0);
    merged.easyTotal = Math.max(safeLocal.easyTotal || 0, safeCloud.easyTotal || 0);
    merged.mediumCorrect = Math.max(safeLocal.mediumCorrect || 0, safeCloud.mediumCorrect || 0);
    merged.mediumTotal = Math.max(safeLocal.mediumTotal || 0, safeCloud.mediumTotal || 0);
    merged.hardCorrect = Math.max(safeLocal.hardCorrect || 0, safeCloud.hardCorrect || 0);
    merged.hardTotal = Math.max(safeLocal.hardTotal || 0, safeCloud.hardTotal || 0);
    merged.expertCorrect = Math.max(safeLocal.expertCorrect || 0, safeCloud.expertCorrect || 0);
    merged.expertTotal = Math.max(safeLocal.expertTotal || 0, safeCloud.expertTotal || 0);
    merged.perfectScores = Math.max(safeLocal.perfectScores || 0, safeCloud.perfectScores || 0);
    merged.dailyChallengesCompleted = Math.max(safeLocal.dailyChallengesCompleted || 0, safeCloud.dailyChallengesCompleted || 0);
    merged.lastPlayed = safeLocal.lastPlayed || safeCloud.lastPlayed;

    const seenCutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
    const combinedSeen = [
      ...(safeLocal.seenDailyQuestions || []),
      ...(safeCloud.seenDailyQuestions || []),
    ];
    merged.seenDailyQuestions = combinedSeen
      .filter((e, idx, arr) => arr.findIndex(x => x.key === e.key) === idx && e.date >= seenCutoff);

    const combinedDidYouKnow = [
      ...(safeLocal.seenDidYouKnow || []),
      ...(safeCloud.seenDidYouKnow || []),
    ];
    merged.seenDidYouKnow = combinedDidYouKnow
      .filter((e, idx, arr) => arr.findIndex(x => x.key === e.key) === idx && e.date >= seenCutoff);

    merged.unlockedDifficulties = Array.from(new Set([
      ...(safeLocal.unlockedDifficulties || []),
      ...(safeCloud.unlockedDifficulties || [])
    ]));

    merged.unlockedEras = Array.from(new Set([
      ...(safeLocal.unlockedEras || []),
      ...(safeCloud.unlockedEras || [])
    ]));

    merged.unlockedCharacters = Array.from(new Set([
      ...(safeLocal.unlockedCharacters || []),
      ...(safeCloud.unlockedCharacters || [])
    ]));

    merged.unlockedBooks = Array.from(new Set([
      ...(safeLocal.unlockedBooks || []),
      ...(safeCloud.unlockedBooks || [])
    ]));

    const combinedEraProgress = { ...(safeCloud.eraProgress || {}), ...(safeLocal.eraProgress || {}) };
    Object.keys(combinedEraProgress).forEach(key => {
      combinedEraProgress[key] = Math.max(
        (safeLocal.eraProgress || {})[key] || 0,
        (safeCloud.eraProgress || {})[key] || 0
      );
    });
    merged.eraProgress = combinedEraProgress;

    const combinedBookProgress = { ...(safeCloud.bookProgress || {}), ...(safeLocal.bookProgress || {}) };
    Object.keys(combinedBookProgress).forEach(key => {
      combinedBookProgress[key] = Math.max(
        (safeLocal.bookProgress || {})[key] || 0,
        (safeCloud.bookProgress || {})[key] || 0
      );
    });
    merged.bookProgress = combinedBookProgress;

    const localReflections = safeLocal.reflections || [];
    const cloudReflections = safeCloud.reflections || [];
    merged.reflections = [...localReflections, ...cloudReflections]
      .filter((entry, idx, arr) => arr.findIndex((x) => x.id === entry.id) === idx)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return checkUnlocks(merged);
  };

  const saveProgress = async (newProgress) => {
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      if (user && isFirebaseConfigured) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          progress: newProgress,
          lastUpdated: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  };

  const updateProgress = async (difficulty, score, total, questionsBatch, didYouKnowKey = null) => {
    const pct = Math.round((score / total) * 100);
    let updated = { ...progress };

    const key = `${difficulty}HighScore`;
    const completedKey = `${difficulty}Completed`;
    
    if (pct > (updated[key] || 0)) {
      updated[key] = pct;
    }
    updated[completedKey] = (updated[completedKey] || 0) + 1;
    updated.totalQuestionsAnswered = (updated.totalQuestionsAnswered || 0) + total;
    updated.coins = (updated.coins || 0) + 10;

    updated.totalCorrect = (updated.totalCorrect || 0) + score;
    updated.lastPlayed = new Date().toISOString();
    if (score === total && total > 0) {
      updated.perfectScores = (updated.perfectScores || 0) + 1;
    }
    if (difficulty === 'easy') {
      updated.easyCorrect = (updated.easyCorrect || 0) + score;
      updated.easyTotal = (updated.easyTotal || 0) + total;
    } else if (difficulty === 'medium') {
      updated.mediumCorrect = (updated.mediumCorrect || 0) + score;
      updated.mediumTotal = (updated.mediumTotal || 0) + total;
    } else if (difficulty === 'hard') {
      updated.hardCorrect = (updated.hardCorrect || 0) + score;
      updated.hardTotal = (updated.hardTotal || 0) + total;
    } else if (difficulty === 'expert') {
      updated.expertCorrect = (updated.expertCorrect || 0) + score;
      updated.expertTotal = (updated.expertTotal || 0) + total;
    }

    if (questionsBatch) {
      questionsBatch.forEach(q => {
        if (q.era && q.isCorrect) {
          const prevProgress = updated.eraProgress[q.era] || 0;
          updated.eraProgress[q.era] = prevProgress + 1;

          if (updated.eraProgress[q.era] === MASTERY_TIERS.SILVER) {
            updated.coins += 100;
          } else if (updated.eraProgress[q.era] === MASTERY_TIERS.GOLD) {
            updated.coins += 500;
          }
        }
        if (q.bibleBook && q.isCorrect) {
          updated.bookProgress[q.bibleBook] = (updated.bookProgress[q.bibleBook] || 0) + 1;
        }
      });
    }

    updated.seenDidYouKnow = appendSeenEntry(updated.seenDidYouKnow, didYouKnowKey);

    updated = checkUnlocks(updated);
    setProgress(updated);
    await saveProgress(updated);
    return updated;
  };

  const completeDailyChallenge = async (score, total, questionsBatch, questionKeys = [], didYouKnowKey = null) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let updated = { ...progress };

    if (updated.lastCompletionDate === yesterday) {
      updated.currentStreak += 1;
    } else if (updated.lastCompletionDate !== today) {
      updated.currentStreak = 1;
    }

    updated.highestStreak = Math.max(updated.highestStreak, updated.currentStreak);
    updated.lastCompletionDate = today;
    updated.dailyChallengeCompleted = true;
    updated.coins += 50;
    updated.dailyChallengesCompleted = (updated.dailyChallengesCompleted || 0) + 1;

    updated.totalQuestionsAnswered = (updated.totalQuestionsAnswered || 0) + total;
    updated.totalCorrect = (updated.totalCorrect || 0) + score;
    updated.lastPlayed = new Date().toISOString();
    if (score === total && total > 0) {
      updated.perfectScores = (updated.perfectScores || 0) + 1;
    }

    if (questionKeys.length > 0) {
      const todayISO = new Date().toISOString();
      const seenCutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
      const newEntries = questionKeys.map(key => ({ key, date: todayISO }));
      updated.seenDailyQuestions = [
        ...newEntries,
        ...(updated.seenDailyQuestions || []).filter(e => e.date >= seenCutoff),
      ];
    }

    if (questionsBatch) {
      questionsBatch.forEach(q => {
        if (q.era && q.isCorrect) {
          const prevProgress = updated.eraProgress[q.era] || 0;
          updated.eraProgress[q.era] = prevProgress + 1;

          if (updated.eraProgress[q.era] === MASTERY_TIERS.SILVER) {
            updated.coins += 100;
          } else if (updated.eraProgress[q.era] === MASTERY_TIERS.GOLD) {
            updated.coins += 500;
          }
        }
        if (q.bibleBook && q.isCorrect) {
          updated.bookProgress[q.bibleBook] = (updated.bookProgress[q.bibleBook] || 0) + 1;
        }
      });
    }

    updated.seenDidYouKnow = appendSeenEntry(updated.seenDidYouKnow, didYouKnowKey);

    updated = checkUnlocks(updated);
    setProgress(updated);
    await saveProgress(updated);
    return updated;
  };

  const setKnowledgeLevel = async (level) => {
    const updated = { ...progress, knowledgeLevel: level };
    setProgress(updated);
    await saveProgress(updated);
  };

  const spendCoins = async (amount) => {
    if (progress.coins < amount) return false;
    const updated = { ...progress, coins: progress.coins - amount };
    setProgress(updated);
    await saveProgress(updated);
    return true;
  };

  const earnCoins = async (amount) => {
    const updated = { ...progress, coins: (progress.coins || 0) + amount };
    setProgress(updated);
    await saveProgress(updated);
  };

  const setProStatus = async (isPro) => {
    const updated = { ...progress, isPro };
    setProgress(updated);
    await saveProgress(updated);
  };

  const addCoins = async (amount) => {
    await earnCoins(amount);
  };

  const isUnlocked = (difficulty) => {
    return progress.unlockedDifficulties.includes(difficulty);
  };

  const getDifficultyInfo = (difficulty) => {
    const requirement = DifficultyRequirements[difficulty];
    if (!requirement) {
      return { unlocked: isUnlocked(difficulty), description: 'Available', progress: 1, currentProgress: 100 };
    }

    const current = getDifficultyAccuracy(progress, requirement.source);
    const sessions = getDifficultySessions(progress, requirement.source);
    const accuracyProgress = Math.min(current / requirement.value, 1);
    const sessionProgress = Math.min(sessions / requirement.sessions, 1);
    const ratio = isUnlocked(difficulty) ? 1 : Math.min(accuracyProgress, sessionProgress);

    return {
      unlocked: isUnlocked(difficulty),
      description: requirement.description,
      progress: ratio,
      currentProgress: current,
      required: requirement.value,
      sessionsCompleted: sessions,
      requiredSessions: requirement.sessions,
      progressLabel: `${Math.min(sessions, requirement.sessions)}/${requirement.sessions} quizzes · ${current}%`,
    };
  };

  const getStreakMilestone = () => {
    return STREAK_MILESTONES.find(m => progress.currentStreak < m.days) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  };

  const saveReflection = async ({ prompt, text, score, total }) => {
    const entry = {
      id: `${Date.now()}`,
      prompt,
      text,
      score,
      total,
      createdAt: new Date().toISOString(),
    };
    const updated = {
      ...progress,
      reflections: [entry, ...(progress.reflections || [])].slice(0, 100),
    };
    setProgress(updated);
    await saveProgress(updated);
    return entry;
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      loading,
      updateProgress,
      completeDailyChallenge,
      setKnowledgeLevel,
      spendCoins,
      earnCoins,
      addCoins,
      setProStatus,
      isUnlocked,
      getDifficultyInfo,
      getStreakMilestone,
      saveReflection,
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
