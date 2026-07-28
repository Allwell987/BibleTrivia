import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import useReducedMotion from '../hooks/useReducedMotion';

const { width } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnswerOption = ({ option, index, selected, correctAnswer, isTimeout, onSelect, isHidden }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const reducedMotion = useReducedMotion();
  const sx = styles(colors);
  const pressScale = useRef(new Animated.Value(1)).current;
  const feedbackScale = useRef(new Animated.Value(1)).current;
  const wrongShake = useRef(new Animated.Value(0)).current;
  const collapseAnim = useRef(new Animated.Value(isHidden && !selected ? 1 : 0)).current;

  const letter = String.fromCharCode(65 + index);

  let containerStyle = sx.optBtn;
  let letterBoxStyle = sx.letterBox;
  let letterTextStyle = sx.letterText;
  let textColor = colors.textSecondary;

  if (selected) {
    if (option === correctAnswer) {
      containerStyle = [sx.optBtn, sx.optCorrect];
      letterBoxStyle = [sx.letterBox, sx.letterCorrect];
      letterTextStyle = [sx.letterText, sx.letterTextCorrect];
      textColor = colors.success;
    } else if (option === selected && !isTimeout) {
      containerStyle = [sx.optBtn, sx.optWrong];
      letterBoxStyle = [sx.letterBox, sx.letterWrong];
      letterTextStyle = [sx.letterText, sx.letterTextWrong];
      textColor = colors.error;
    } else {
      containerStyle = [sx.optBtn, sx.optDim];
      textColor = colors.textMuted;
    }
  }

  useEffect(() => {
    if (reducedMotion) {
      collapseAnim.setValue(isHidden && !selected ? 1 : 0);
      return;
    }

    Animated.timing(collapseAnim, {
      toValue: isHidden && !selected ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [collapseAnim, isHidden, reducedMotion, selected]);

  useEffect(() => {
    if (!selected) {
      feedbackScale.setValue(1);
      wrongShake.setValue(0);
      return;
    }

    if (reducedMotion) return;

    if (option === correctAnswer) {
      Animated.sequence([
        Animated.timing(feedbackScale, { toValue: 1.04, duration: 110, useNativeDriver: true }),
        Animated.spring(feedbackScale, { toValue: 1, friction: 6, tension: 130, useNativeDriver: true }),
      ]).start();
    } else if (option === selected && !isTimeout) {
      Animated.sequence([
        Animated.timing(wrongShake, { toValue: 6, duration: 42, useNativeDriver: true }),
        Animated.timing(wrongShake, { toValue: -6, duration: 42, useNativeDriver: true }),
        Animated.timing(wrongShake, { toValue: 3, duration: 38, useNativeDriver: true }),
        Animated.timing(wrongShake, { toValue: 0, duration: 38, useNativeDriver: true }),
      ]).start();
    }
  }, [feedbackScale, correctAnswer, isTimeout, option, reducedMotion, selected, wrongShake]);

  const handlePressIn = () => {
    if (reducedMotion || selected || (isHidden && !selected)) return;
    Animated.spring(pressScale, { toValue: 0.98, tension: 220, friction: 10, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (reducedMotion) return;
    Animated.spring(pressScale, { toValue: 1, tension: 200, friction: 12, useNativeDriver: true }).start();
  };

  const contentOpacity = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const contentMaxHeight = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [140, 0],
  });
  const contentMargin = collapseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [9, 0],
  });

  return (
    <Animated.View
      style={{
        maxHeight: contentMaxHeight,
        opacity: contentOpacity,
        marginBottom: contentMargin,
        overflow: 'hidden',
      }}
    >
      <AnimatedTouchable
        style={[
          containerStyle,
          {
            transform: [
              { scale: Animated.multiply(pressScale, feedbackScale) },
              { translateX: wrongShake },
            ],
          },
        ]}
        onPress={() => onSelect(option)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!!selected || (isHidden && !selected)}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={`Answer ${letter}: ${option}`}
        accessibilityHint={selected ? 'Answer is locked for this question' : `Select answer ${letter}`}
        accessibilityState={{ disabled: !!selected || (isHidden && !selected) }}
      >
        <View style={letterBoxStyle}>
          <Text style={letterTextStyle}>{letter}</Text>
        </View>
        <Text style={[sx.optText, { color: textColor }]}>{option}</Text>
      </AnimatedTouchable>
    </Animated.View>
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
