import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import QuizScreen from '../src/screens/QuizScreen';

jest.useFakeTimers();

jest.mock('../src/data/questions', () => ({
  QUESTIONS: {
    easy: [
      {
        question: 'How many days did God take to create the world?',
        options: ['5', '6', '7', '10'],
        answer: '6',
        reference: 'Genesis 1:31',
        explanation: 'God created the world in six days.',
      },
    ],
  },
}));

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
      },
    },
  }),
}));

jest.mock('../src/context/ProgressContext', () => ({
  useProgress: () => ({
    progress: { coins: 200 },
    spendCoins: jest.fn(async () => true),
  }),
}));

jest.mock('../src/hooks/useTimer', () =>
  jest.fn(() => ({
    timeLeft: 10,
    resetTimer: jest.fn(),
  }))
);

jest.mock('../src/utils/storage', () => ({
  loadSettings: jest.fn(() => Promise.resolve({ showExplanations: false })),
}));

jest.mock('../src/utils/sounds', () => ({
  playCorrect: jest.fn(),
  playWrong: jest.fn(),
  playTick: jest.fn(),
}));

jest.mock('../src/utils/haptics', () => ({
  vibrateOnCorrect: jest.fn(),
  vibrateOnWrong: jest.fn(),
  vibrateOnSelection: jest.fn(),
}));

describe('Quiz flow', () => {
  it('navigates to result after answering final question', async () => {
    const navigation = {
      goBack: jest.fn(),
      replace: jest.fn(),
    };

    const route = {
      params: {
        difficulty: 'easy',
        seconds: 15,
      },
    };

    const { getByText } = render(
      <QuizScreen route={route} navigation={navigation} />
    );

    fireEvent.press(getByText('6'));
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith(
        'Result',
        expect.objectContaining({
          score: 1,
          total: 1,
          difficulty: 'easy',
        })
      );
    });
  });
});
