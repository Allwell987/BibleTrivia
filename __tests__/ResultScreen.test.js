import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResultScreen from '../src/screens/ResultScreen';
import { shareResults } from '../src/utils/share';

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#0F0D0A',
        card: '#18150F',
        cardBorder: '#2A261C',
        text: '#F5EDD6',
        textSecondary: '#9E8E6A',
        textMuted: '#5A4F35',
        primary: '#C9A84C',
        success: '#4CAF82',
        warning: '#E6A817',
        error: '#D95F4B',
        dim: '#1E1B14',
        border: '#2A261C',
      },
    },
  }),
}));

jest.mock('../src/context/ProgressContext', () => ({
  useProgress: () => ({
    progress: { coins: 200, isPro: false },
    getDifficultyInfo: () => ({ unlocked: false, description: '', progress: 0, currentProgress: 0 }),
    saveReflection: jest.fn(async () => ({})),
    addCoins: jest.fn(async () => ({})),
  }),
}));

jest.mock('../src/utils/storage', () => ({
  saveScore: jest.fn(async () => ({ rank: 1 })),
}));

jest.mock('../src/utils/share', () => ({
  shareResults: jest.fn(async () => ({})),
}));

describe('ResultScreen did you know', () => {
  const navigation = { navigate: jest.fn(), replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders Did You Know card when payload exists', () => {
    const route = {
      params: {
        score: 7,
        total: 10,
        difficulty: 'easy',
        wrong: [],
        didYouKnow: {
          question: 'Who interpreted Pharaoh\'s dreams in Egypt?',
          fact: 'God gave Joseph wisdom to prepare for famine.',
          reflection: 'Where can wise preparation honor God this week?',
          reference: 'Genesis 41:25-32',
        },
      },
    };

    const { getByText } = render(<ResultScreen route={route} navigation={navigation} />);

    expect(getByText('Did You Know?')).toBeTruthy();
    expect(getByText('God gave Joseph wisdom to prepare for famine.')).toBeTruthy();
    expect(getByText('- Genesis 41:25-32')).toBeTruthy();
    expect(getByText('Share This Score')).toBeTruthy();
  });

  it('forwards did-you-know fact to share payload', async () => {
    const route = {
      params: {
        score: 8,
        total: 10,
        difficulty: 'easy',
        wrong: [],
        didYouKnow: {
          question: 'Who interpreted Pharaoh\'s dreams in Egypt?',
          fact: 'God gave Joseph wisdom to prepare for famine.',
          reflection: 'Where can wise preparation honor God this week?',
          reference: 'Genesis 41:25-32',
        },
      },
    };

    const { getByText } = render(<ResultScreen route={route} navigation={navigation} />);
    fireEvent.press(getByText('Share This Score'));

    await waitFor(() => {
      expect(shareResults).toHaveBeenCalledWith(expect.objectContaining({
        didYouKnowFact: 'God gave Joseph wisdom to prepare for famine.',
      }));
    });
  });

  it('does not render Did You Know card when no payload exists', () => {
    const route = {
      params: {
        score: 7,
        total: 10,
        difficulty: 'easy',
        wrong: [],
      },
    };

    const { queryByText } = render(<ResultScreen route={route} navigation={navigation} />);

    expect(queryByText('Did You Know?')).toBeNull();
  });
});
