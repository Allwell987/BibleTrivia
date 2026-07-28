import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ProgressBar = ({ current, total, diffColor, progressAnim }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Quiz progress"
      accessibilityValue={{ min: 0, max: total, now: current, text: `${current} of ${total}` }}
    >
      <View style={styles(colors).progressTrack}>
        <Animated.View style={[styles(colors).progressFill, { width: progressWidth, backgroundColor: diffColor }]} />
      </View>
      <Text style={styles(colors).counter}>
        {current} / {total}
      </Text>
    </View>
  );
};

const styles = (colors) => ({
  progressTrack: { width: '100%', height: 3, backgroundColor: colors.dim, borderRadius: 2, marginBottom: 6 },
  progressFill: { height: 3, borderRadius: 2 },
  counter: { color: colors.textMuted, fontSize: 11, marginBottom: 10, alignSelf: 'flex-end' },
});

export default ProgressBar;
