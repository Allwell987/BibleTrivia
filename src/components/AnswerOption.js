import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const AnswerOption = ({ option, index, selected, correctAnswer, isTimeout, onSelect }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const letter = String.fromCharCode(65 + index);

  let containerStyle = styles(colors).optBtn;
  let letterBoxStyle = styles(colors).letterBox;
  let letterTextStyle = styles(colors).letterText;
  let textColor = colors.textSecondary;

  if (selected) {
    if (option === correctAnswer) {
      containerStyle = [styles(colors).optBtn, styles(colors).optCorrect];
      letterBoxStyle = [styles(colors).letterBox, styles(colors).letterCorrect];
      letterTextStyle = [styles(colors).letterText, styles(colors).letterTextCorrect];
      textColor = colors.success;
    } else if (option === selected && !isTimeout) {
      containerStyle = [styles(colors).optBtn, styles(colors).optWrong];
      letterBoxStyle = [styles(colors).letterBox, styles(colors).letterWrong];
      letterTextStyle = [styles(colors).letterText, styles(colors).letterTextWrong];
      textColor = colors.error;
    } else {
      containerStyle = [styles(colors).optBtn, styles(colors).optDim];
      textColor = colors.textMuted;
    }
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => onSelect(option)}
      disabled={!!selected}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Answer ${letter}: ${option}`}
      accessibilityHint={selected ? 'Answer is locked for this question' : `Select answer ${letter}`}
      accessibilityState={{ disabled: !!selected }}
    >
      <View style={letterBoxStyle}>
        <Text style={letterTextStyle}>{letter}</Text>
      </View>
      <Text style={[styles(colors).optText, { color: textColor }]}>{option}</Text>
    </TouchableOpacity>
  );
};

const styles = (colors) => StyleSheet.create({
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 40,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 9,
  },
  optCorrect: { borderColor: colors.success, backgroundColor: colors.success + '15' },
  optWrong: { borderColor: colors.error, backgroundColor: colors.error + '15' },
  optDim: { opacity: 0.4 },
  letterBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  letterCorrect: { borderColor: colors.success, backgroundColor: colors.success },
  letterWrong: { borderColor: colors.error, backgroundColor: colors.error },
  letterText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  letterTextCorrect: { color: '#FFFFFF' },
  letterTextWrong: { color: '#FFFFFF' },
  optText: { fontSize: 15, flex: 1 },
});

export default AnswerOption;
