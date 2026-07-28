import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AnagramScreen from '../src/screens/AnagramScreen';

jest.useFakeTimers();

jest.mock('../src/data/anagrams', () => ({
  shuffleArray: (arr) => arr,
  ANAGRAMS: [
    {
      word: 'JESUS',
      hint: 'The Savior of the world.',
      category: 'People',
      reference: 'Matthew 1:21'
    }
  ],
}));

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#0F0D0A',
        card: '#18150F',
        border: '#2A261C',
        text: '#F5EDD6',
        textMuted: '#5A4F35',
        primary: '#C9A84C',
      },
    },
  }),
}));

const mockSpendCoins = jest.fn(async () => true);

jest.mock('../src/context/ProgressContext', () => ({
  useProgress: () => ({
    progress: { coins: 100 },
    spendCoins: mockSpendCoins,
    earnCoins: jest.fn(),
  }),
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

jest.mock('../src/utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

describe('AnagramScreen Hint Functionality', () => {
  it('displays the hint when the hint button is pressed and coins are spent', async () => {
    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const { getByText, queryByText } = render(
      <AnagramScreen navigation={navigation} />
    );

    // Verify hint is NOT visible initially
    expect(queryByText('The Savior of the world.')).toBeNull();

    // Find and press hint button
    const hintButton = getByText('Hint (15 🪙)');
    fireEvent.press(hintButton);

    // Wait for the hint to appear
    await waitFor(() => {
      expect(mockSpendCoins).toHaveBeenCalledWith(15);
      expect(getByText('The Savior of the world.')).toBeTruthy();
    });

    // Verify the hint button is now hidden
    expect(queryByText('Hint (15 🪙)')).toBeNull();
  });

  it('shows an alert when not enough coins are available', async () => {
    mockSpendCoins.mockImplementationOnce(async () => false);
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');

    const navigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const { getByText, queryByText } = render(
      <AnagramScreen navigation={navigation} />
    );

    const hintButton = getByText('Hint (15 🪙)');
    fireEvent.press(hintButton);

    await waitFor(() => {
      expect(mockSpendCoins).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Not enough coins', 'You need 15 coins for a hint.');
    });

    // Verify hint is still NOT visible
    expect(queryByText('The Savior of the world.')).toBeNull();
  });
});
