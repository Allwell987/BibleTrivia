import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

// ── mocks must be declared before any import that depends on them ────────────

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#C9A84C', background: '#0F0D0A', card: '#18150F',
        cardBorder: '#2A261C', text: '#F5EDD6', textSecondary: '#9E8E6A',
        textMuted: '#5A4F35', border: '#2A261C', dim: '#1E1B14', warning: '#E6A817',
      },
    },
  }),
}));

// Shared mutable progress object so individual tests can override it
let mockProgress = {};

jest.mock('../src/context/ProgressContext', () => ({
  STREAK_MILESTONES: [
    { days: 7, name: 'Days of Creation', icon: '🌍' },
    { days: 40, name: 'Wilderness Journey', icon: '🏜️' },
    { days: 120, name: 'Acts Church Builder', icon: '⛪' },
  ],
  useProgress: () => ({
    isUnlocked: () => true,
    getDifficultyInfo: () => ({ currentProgress: 0 }),
    getStreakMilestone: () => ({ days: 7, name: 'Days of Creation', icon: '🌍' }),
    progress: {
      coins: 50,
      currentStreak: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      easyCompleted: 0,
      mediumCompleted: 0,
      hardCompleted: 0,
      expertCompleted: 0,
      dailyChallengesCompleted: 0,
      knowledgeLevel: 'Beginner',
      dailyChallengeCompleted: false,
      ...mockProgress,
    },
  }),
}));

jest.mock('../src/data/questions', () => ({
  getDailyVerse: () => ({ text: 'Your word is a lamp for my feet.', ref: 'Psalm 119:105' }),
}));

// Import after mocks are set up
import HomeScreen from '../src/screens/HomeScreen';

// ── tests ─────────────────────────────────────────────────────────────────────

describe('HomeScreen snapshot card', () => {
  const navigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProgress = {};
  });

  it('shows zero accuracy when no quizzes have been completed', async () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getByText(/Knowledge Profile/)).toBeTruthy();
      expect(getByText('0%')).toBeTruthy();
      expect(getByText('Quizzes')).toBeTruthy();
      expect(getByText('Streak')).toBeTruthy();
    });
  });

  it('derives accuracy and quiz count correctly from progress context', async () => {
    // 30 correct out of 40 answered = 75%; 2+2 = 4 quizzes; streak = 3
    mockProgress = {
      totalQuestionsAnswered: 40,
      totalCorrect: 30,
      easyCompleted: 2,
      mediumCompleted: 2,
      currentStreak: 3,
      knowledgeLevel: 'Intermediate',
    };

    const { getByText } = render(<HomeScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getByText('75%')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });
  });
});
