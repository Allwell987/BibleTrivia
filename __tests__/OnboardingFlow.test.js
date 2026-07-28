import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingScreen from '../src/screens/OnboardingScreen';
import { setOnboarded } from '../src/utils/storage';
import { requestNotificationPermission } from '../src/utils/notifications';

jest.mock('../src/utils/storage', () => ({
  setOnboarded: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/utils/notifications', () => ({
  requestNotificationPermission: jest.fn(() => Promise.resolve({ granted: false, status: 'unavailable' })),
}));

jest.mock('../src/context/ProgressContext', () => ({
  useProgress: () => ({
    setKnowledgeLevel: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('../src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#C9A84C',
        background: '#0F0D0A',
        text: '#F5EDD6',
        textSecondary: '#9E8E6A',
      },
    },
  }),
}));

describe('Onboarding flow', () => {
  it('navigates to home when skip is pressed', async () => {
    const navigation = { replace: jest.fn() };

    const { getByText } = render(
      <OnboardingScreen navigation={navigation} />
    );

    fireEvent.press(getByText('Skip'));

    await waitFor(() => {
      expect(setOnboarded).toHaveBeenCalledWith(true);
      expect(requestNotificationPermission).toHaveBeenCalled();
      expect(navigation.replace).toHaveBeenCalledWith('Quiz', { difficulty: 'mixed', seconds: 15, isDaily: true });
    });
  });
});
