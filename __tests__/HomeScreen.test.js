import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { loadScores, loadStats, loadStreak } from '../src/utils/storage';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback) => {
    const ReactLib = require('react');
    ReactLib.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('../src/utils/storage', () => ({
  loadScores: jest.fn(),
  loadStats: jest.fn(),
  loadStreak: jest.fn(),
}));

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#C9A84C',
        background: '#0F0D0A',
        card: '#18150F',
        cardBorder: '#2A261C',
        text: '#F5EDD6',
        textSecondary: '#9E8E6A',
        textMuted: '#5A4F35',
        border: '#2A261C',
        dim: '#1E1B14',
        warning: '#E6A817',
      },
    },
  }),
}));

jest.mock('../src/context/ProgressContext', () => ({
  useProgress: () => ({
    isUnlocked: () => true,
    getDifficultyInfo: () => ({ currentProgress: 0 }),
    progress: { coins: 50 },
    claimDailyReward: jest.fn(async () => ({ success: false, reward: 0 })),
  }),
}));

jest.mock('../src/data/questions', () => ({
  getDailyVerse: () => ({
    text: 'Your word is a lamp for my feet.',
    ref: 'Psalm 119:105',
  }),
}));

describe('Home snapshot card', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty snapshot state when no scores exist', async () => {
    loadStreak.mockResolvedValue({ currentStreak: 0, longestStreak: 0, lastPlayedDate: null });
    loadStats.mockResolvedValue({
      totalQuizzes: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      perfectScores: 0,
      favoriteDifficulty: null,
      easyCorrect: 0,
      easyTotal: 0,
      mediumCorrect: 0,
      mediumTotal: 0,
      hardCorrect: 0,
      hardTotal: 0,
      lastPlayed: null,
    });
    loadScores.mockResolvedValue([]);

    const { getByText } = render(<HomeScreen navigation={navigation} />);

    await waitFor(() => {
      expect(getByText('Performance Snapshot')).toBeTruthy();
      expect(getByText('No saved score yet. Complete your first quiz.')).toBeTruthy();
    });
  });

  it('shows last score details when scores exist', async () => {
    loadStreak.mockResolvedValue({ currentStreak: 3, longestStreak: 7, lastPlayedDate: '2026-03-31T00:00:00.000Z' });
    loadStats.mockResolvedValue({
      totalQuizzes: 4,
      totalCorrect: 30,
      totalQuestions: 40,
      perfectScores: 1,
      favoriteDifficulty: 'easy',
      easyCorrect: 10,
      easyTotal: 12,
      mediumCorrect: 12,
      mediumTotal: 18,
      hardCorrect: 8,
      hardTotal: 10,
      lastPlayed: '2026-03-31T00:00:00.000Z',
    });
    loadScores.mockResolvedValue([
      {
        id: '1',
        name: 'Player',
        score: 8,
        total: 10,
        pct: 80,
        difficulty: 'easy',
        date: '3/31/2026',
      },
    ]);

    const { getByText } = render(<HomeScreen navigation={navigation} />);

    await waitFor(() => {
      expect(getByText('Performance Snapshot')).toBeTruthy();
      expect(getByText('Last: 80% on easy')).toBeTruthy();
      expect(getByText('75%')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
    });
  });
});
