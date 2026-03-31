import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TimerBar = ({ timeLeft, totalSeconds, diffColor, timerAnim, selected }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const timerColor = timerAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [colors.error, colors.warning, diffColor],
  });

  const timerWidth = timerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={styles(colors).timerRow}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Question timer"
      accessibilityValue={{ min: 0, max: totalSeconds, now: selected ? 0 : timeLeft, text: selected ? 'Locked' : `${timeLeft} seconds left` }}
    >
      <View style={styles(colors).timerTrack}>
        <Animated.View style={[styles(colors).timerFill, { width: timerWidth, backgroundColor: timerColor }]} />
      </View>
      <Text style={[styles(colors).timerNum, timeLeft <= 5 && !selected ? styles(colors).timerUrgent : null]}>
        {selected ? '—' : timeLeft}
      </Text>
    </View>
  );
};

const styles = (colors) => ({
  timerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 16, gap: 10 },
  timerTrack: { flex: 1, height: 6, backgroundColor: colors.dim, borderRadius: 3, overflow: 'hidden' },
  timerFill: { height: 6, borderRadius: 3 },
  timerNum: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, width: 24, textAlign: 'right' },
  timerUrgent: { color: colors.error },
});

export default TimerBar;
