import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../src/components/ProgressBar';
import { ThemeProvider } from '../src/context/ThemeContext';
import { Animated } from 'react-native';

describe('ProgressBar', () => {
  it('renders current and total', () => {
    const progressAnim = new Animated.Value(0.5);
    const { getByText } = render(
      <ThemeProvider>
        <ProgressBar current={3} total={10} diffColor="#000" progressAnim={progressAnim} />
      </ThemeProvider>
    );
    expect(getByText('3 / 10')).toBeTruthy();
  });
});
