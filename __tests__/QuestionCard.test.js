import React from 'react';
import { render } from '@testing-library/react-native';
import QuestionCard from '../src/components/QuestionCard';
import { ThemeProvider } from '../src/context/ThemeContext';
import { Animated } from 'react-native';

describe('QuestionCard', () => {
  it('renders question text', () => {
    const fadeAnim = new Animated.Value(1);
    const shakeAnim = new Animated.Value(0);
    const { getByText } = render(
      <ThemeProvider>
        <QuestionCard question="Who wrote Genesis?" fadeAnim={fadeAnim} shakeAnim={shakeAnim} />
      </ThemeProvider>
    );
    expect(getByText('Who wrote Genesis?')).toBeTruthy();
  });
});
