import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const QuestionCard = ({ question, fadeAnim, shakeAnim }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Animated.View
      style={[styles(colors).card, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Current question"
    >
      <Text style={styles(colors).questionText} accessibilityRole="header">
        {question}
      </Text>
    </Animated.View>
  );
};

const styles = (colors) => ({
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 28,
    marginBottom: 16,
    minHeight: 100,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 19,
    color: colors.text,
    lineHeight: 29,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuestionCard;
