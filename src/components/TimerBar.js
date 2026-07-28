import React from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TimerBar = ({ timeLeft, totalSeconds, diffColor, timerAnim, timerPulseAnim, selected }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const pulseScale = timerPulseAnim || 1;

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
        <Animated.View
          style={[styles(colors).timerFillPulse, { transform: [{ scaleY: pulseScale }] }]}
        >
          <Animated.View
            style={[
              styles(colors).timerFill,
              {
                width: timerWidth,
                backgroundColor: timerColor,
              },
            ]}
          />
        </Animated.View>
      </View>
      <View style={styles(colors).timerNumWrap}>
        <Animated.Text
          style={[
            styles(colors).timerNum,
            timeLeft <= 5 && !selected ? styles(colors).timerUrgent : null,
            { transform: [{ scale: pulseScale }] },
          ]}
        >
          {selected ? '—' : timeLeft}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = (colors) => ({
  timerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 16, gap: 10 },
  timerTrack: { flex: 1, height: 6, backgroundColor: colors.dim, borderRadius: 3, overflow: 'hidden' },
  timerFillPulse: { flex: 1, height: '100%' },
  timerFill: { height: 6, borderRadius: 3 },
  timerNumWrap: { width: 24, alignItems: 'flex-end' },
  timerNum: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, textAlign: 'right' },
  timerUrgent: { color: colors.error },
});

export default TimerBar;
