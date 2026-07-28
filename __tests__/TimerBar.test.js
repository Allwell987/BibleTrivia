import React from 'react';
import { render } from '@testing-library/react-native';
import TimerBar from '../src/components/TimerBar';
import { ThemeProvider } from '../src/context/ThemeContext';
import { Animated } from 'react-native';

describe('TimerBar', () => {
  it('renders time left', () => {
    const timerAnim = new Animated.Value(1);
    const { getByText } = render(
      <ThemeProvider>
        <TimerBar timeLeft={10} totalSeconds={20} diffColor="#000" timerAnim={timerAnim} selected={false} />
      </ThemeProvider>
    );
    expect(getByText('10')).toBeTruthy();
  });
});
