import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import QuizScreen, { selectDidYouKnowCandidate } from '../src/screens/QuizScreen';

jest.useFakeTimers();

jest.mock('../src/data/questions', () => ({
  shuffleArray: (arr) => arr,
  ERAS: { easy: 'Easy' },
  QUESTIONS: {
    easy: [
      {
        question: 'How many days did God take to create the world?',
        options: ['5', '6', '7', '10'],
        answer: '6',
        reference: 'Genesis 1:31',
        explanation: 'God created the world in six days.',
        insight: 'God brings order out of chaos.',
        reflection: 'Where do you need to trust God with new beginnings?',
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
    progress: { coins: 200, seenDidYouKnow: [] },
    spendCoins: jest.fn(async () => true),
    completeDailyChallenge: jest.fn(async () => ({})),
    updateProgress: jest.fn(async () => ({})),
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
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('selectDidYouKnowCandidate prefers wrong answers and skips recent seen keys', () => {
    const nowISO = new Date().toISOString();
    const wrongQuestion = {
      question: 'Who interpreted Pharaoh\'s dreams in Egypt?',
      explanation: 'Joseph interpreted Pharaoh\'s dreams.',
    };
    const fallbackQuestion = {
      question: 'What was Jesus laid in after He was born?',
      explanation: 'Jesus was laid in a manger.',
    };

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [wrongQuestion],
      questions: [fallbackQuestion],
      seenDidYouKnow: [{ key: wrongQuestion.question, date: nowISO }],
    });

    expect(selected.question).toBe(fallbackQuestion.question);
  });

  it('selectDidYouKnowCandidate falls back to first candidate when all are recently seen', () => {
    const nowISO = new Date().toISOString();
    const firstWrong = { question: 'Who interpreted Pharaoh\'s dreams in Egypt?', explanation: 'Joseph interpreted Pharaoh\'s dreams.' };
    const secondWrong = { question: 'Who was thrown into the lions\' den?', explanation: 'Daniel trusted God.' };

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [firstWrong, secondWrong],
      questions: [secondWrong],
      seenDidYouKnow: [
        { key: firstWrong.question, date: nowISO },
        { key: secondWrong.question, date: nowISO },
      ],
    });

    expect(selected.question).toBe(firstWrong.question);
  });

  it('returns null when both wrongAnswers and questions are empty', () => {
    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [],
      questions: [],
      seenDidYouKnow: [],
    });
    expect(selected).toBeNull();
  });

  it('returns null when no valid question objects are provided', () => {
    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [null, undefined, { noQuestion: true }],
      questions: [],
      seenDidYouKnow: [],
    });
    expect(selected).toBeNull();
  });

  it('deduplicates: same question in wrongAnswers and questions only counted once, keeping wrong-answer position', () => {
    const sharedQ = { question: 'Who built the ark?', explanation: 'Noah built the ark.' };
    const otherQ  = { question: 'What was the garden called?', explanation: 'The garden was Eden.' };

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [sharedQ],
      questions: [sharedQ, otherQ],
      seenDidYouKnow: [],
    });

    // sharedQ appears first (from wrongAnswers slot) and is unseen → must win
    expect(selected.question).toBe(sharedQ.question);
  });

  it('wrong answer is deterministically first: returns wrong answer before a correct question when both are unseen', () => {
    const wrongQ   = { question: 'Who denied Jesus three times?', explanation: 'Peter denied Jesus.' };
    const correctQ = { question: 'Who built the ark?', explanation: 'Noah built the ark.' };

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [wrongQ],
      questions: [correctQ, wrongQ], // wrongQ also appears in questions; dedup keeps it at front
      seenDidYouKnow: [],
    });

    expect(selected.question).toBe(wrongQ.question);
  });

  it('skips wrong answers seen recently but still picks an unseen correct question', () => {
    const nowISO = new Date().toISOString();
    const wrongQ   = { question: 'Who denied Jesus three times?', explanation: 'Peter denied Jesus.' };
    const correctQ = { question: 'Who built the ark?', explanation: 'Noah built the ark.' };

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [wrongQ],
      questions: [correctQ],
      seenDidYouKnow: [{ key: wrongQ.question, date: nowISO }],
    });

    expect(selected.question).toBe(correctQ.question);
  });

  it('expired history (>30 days old) is NOT treated as recently seen — question is available again', () => {
    const expiredDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    const q = { question: 'Who built the ark?', explanation: 'Noah built the ark.' };

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [],
      questions: [q],
      seenDidYouKnow: [{ key: q.question, date: expiredDate }],
    });

    // Entry is expired → q is treated as unseen → must be returned
    expect(selected.question).toBe(q.question);
  });

  it('handles null seenDidYouKnow gracefully without throwing', () => {
    const q = { question: 'Who built the ark?', explanation: 'Noah built the ark.' };
    expect(() =>
      selectDidYouKnowCandidate({ wrongAnswers: [], questions: [q], seenDidYouKnow: null })
    ).not.toThrow();

    const selected = selectDidYouKnowCandidate({
      wrongAnswers: [],
      questions: [q],
      seenDidYouKnow: null,
    });
    expect(selected.question).toBe(q.question);
  });

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
      jest.advanceTimersByTime(650);
    });
    await waitFor(() => {
      expect(getByText('Continue')).toBeTruthy();
    });

    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith(
        'Result',
        expect.objectContaining({
          score: 1,
          total: 1,
          difficulty: 'easy',
          didYouKnow: expect.objectContaining({
            question: 'How many days did God take to create the world?',
            fact: 'God brings order out of chaos.',
            reference: 'Genesis 1:31',
          }),
        })
      );
    });
  });
});
