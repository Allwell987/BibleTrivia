import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUESTIONS } from '../data/questions';
import useTimer from '../hooks/useTimer';
import { playCorrect, playWrong, playTick } from '../utils/sounds';
import { TimerBar, ProgressBar, QuestionCard, AnswerOption } from '../components';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { loadSettings } from '../utils/storage';
import { vibrateOnCorrect, vibrateOnWrong, vibrateOnSelection } from '../utils/haptics';
import { trackEvent } from '../utils/analytics';

const DIFF_COLOR = { easy: '#4CAF82', medium: '#E6A817', hard: '#D95F4B' };

function shuffle(arr) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export default function QuizScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress, spendCoins } = useProgress();
  const { difficulty, seconds = 15 } = route.params;

  const [questions] = useState(() => shuffle(QUESTIONS[difficulty]));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [settings, setSettings] = useState(null);

  // Hint State
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [showHintReference, setShowHintReference] = useState(false);

  const scoreRef = useRef(0);
  const wrongRef = useRef([]);
  const selectedRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  useEffect(() => {
    trackEvent('quiz_started', {
      difficulty,
      total_questions: questions.length,
      seconds_per_question: seconds,
    });
  }, [difficulty, questions.length, seconds]);

  const current = questions[index];
  const total = questions.length;
  const diffColor = DIFF_COLOR[difficulty];

  const handleTimeUp = useCallback(() => {
    if (!selectedRef.current) {
      playWrong();
      vibrateOnWrong();
      setSelected('__timeout__');
      selectedRef.current = '__timeout__';
      const updatedWrong = [...wrongRef.current, current];
      wrongRef.current = updatedWrong;
      setWrong(updatedWrong);
      shakeIt();
      setShowExplanation(true);
      trackEvent('question_timeout', {
        difficulty,
        question_index: index + 1,
      });
      scheduleNext(scoreRef.current, updatedWrong);
    }
  }, [current, difficulty, index]);

  const { timeLeft, resetTimer } = useTimer(seconds, handleTimeUp, !selected);

  useEffect(() => {
    if (!selectedRef.current && timeLeft <= 5 && timeLeft > 0) {
      playTick();
    }
  }, [timeLeft]);

  useEffect(() => {
    Animated.timing(timerAnim, {
      toValue: timeLeft / seconds,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, seconds]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: index / total,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [index, total]);

  const shakeIt = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -9, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const scheduleNext = useCallback(
    (finalScore, finalWrong) => {
      setTimeout(() => {
        if (index + 1 >= total) {
          trackEvent('quiz_completed', {
            difficulty,
            score: finalScore,
            total,
            total_time: totalTime + (seconds - timeLeft),
          });

          navigation.replace('Result', {
            score: finalScore,
            total,
            difficulty,
            wrong: finalWrong,
            totalTime: totalTime + (seconds - timeLeft),
          });
          return;
        }
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
          setIndex(i => i + 1);
          setSelected(null);
          setShowExplanation(false);
          setDisabledOptions([]);
          setShowHintReference(false);
          selectedRef.current = null;
          resetTimer();
          Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
        });
      }, settings?.showExplanations ? 3000 : 1600);
    },
    [index, total, navigation, difficulty, seconds, timeLeft, totalTime, fadeAnim, resetTimer, settings]
  );

  const handleAnswer = (option) => {
    if (selectedRef.current) return;
    vibrateOnSelection();
    setSelected(option);
    selectedRef.current = option;

    const timeUsed = seconds - timeLeft;
    setTotalTime(t => t + timeUsed);

    const isCorrect = option === current.answer;
    trackEvent('answer_submitted', {
      difficulty,
      question_index: index + 1,
      is_correct: isCorrect,
      time_used: timeUsed,
    });

    const newScore = isCorrect ? scoreRef.current + 1 : scoreRef.current;
    const newWrong = isCorrect ? wrongRef.current : [...wrongRef.current, current];

    if (isCorrect) {
      playCorrect();
      vibrateOnCorrect();
      scoreRef.current = newScore;
      setScore(newScore);
    } else {
      playWrong();
      vibrateOnWrong();
      wrongRef.current = newWrong;
      setWrong(newWrong);
      shakeIt();
    }

    setShowExplanation(true);
    scheduleNext(newScore, newWrong);
  };

  // HINT LOGIC
  const useFiftyFifty = async () => {
    if (selected || disabledOptions.length > 0) return;

    const cost = 50;
    const success = await spendCoins(cost);

    if (success) {
      const wrongOptions = current.options.filter(opt => opt !== current.answer);
      const toDisable = shuffle(wrongOptions).slice(0, 2);
      setDisabledOptions(toDisable);
      vibrateOnSelection();
      trackEvent('hint_used', { hint_type: 'fifty_fifty', difficulty, question_index: index + 1 });
    } else {
      Alert.alert('Not enough Wisdom', `You need ${cost} coins for this hint.`);
    }
  };

  const useReferenceHint = async () => {
    if (selected || showHintReference) return;

    const cost = 20;
    const success = await spendCoins(cost);

    if (success) {
      setShowHintReference(true);
      vibrateOnSelection();
      trackEvent('hint_used', { hint_type: 'reference', difficulty, question_index: index + 1 });
    } else {
      Alert.alert('Not enough Wisdom', `You need ${cost} coins for this hint.`);
    }
  };

  const isTimeout = selected === '__timeout__';
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.currencyContainer}>
          <Text style={styles.coinIcon} accessible={false}>✨</Text>
          <Text style={styles.coinText}>{progress.coins}</Text>
        </View>

        <Text style={[styles.badge, { color: diffColor, borderColor: diffColor }]}>
          {difficulty.toUpperCase()}
        </Text>
      </View>

      <ProgressBar current={index + 1} total={total} diffColor={diffColor} progressAnim={progressAnim} />

      <TimerBar timeLeft={timeLeft} totalSeconds={seconds} diffColor={diffColor} timerAnim={timerAnim} selected={selected} />

      {isTimeout && (
        <View style={styles.timeoutBanner} accessibilityLiveRegion="polite">
          <Text style={styles.timeoutText}>Time's up!</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <QuestionCard question={current.question} fadeAnim={fadeAnim} shakeAnim={shakeAnim} />

          {/* Hint Buttons */}
          {!selected && (
            <View style={styles.hintRow} accessible accessibilityLabel="Hint options">
              <TouchableOpacity
                onPress={useFiftyFifty}
                style={[styles.hintBtn, disabledOptions.length > 0 && styles.hintBtnDisabled]}
                disabled={disabledOptions.length > 0}
                accessibilityRole="button"
                accessibilityLabel="Use fifty fifty hint"
                accessibilityHint="Removes two incorrect choices for 50 wisdom coins"
                accessibilityState={{ disabled: disabledOptions.length > 0 }}
              >
                <Text style={styles.hintBtnText}>🌓 50/50 (50)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={useReferenceHint}
                style={[styles.hintBtn, showHintReference && styles.hintBtnDisabled]}
                disabled={showHintReference}
                accessibilityRole="button"
                accessibilityLabel="Show verse reference hint"
                accessibilityHint="Shows scripture reference for 20 wisdom coins"
                accessibilityState={{ disabled: showHintReference }}
              >
                <Text style={styles.hintBtnText}>📖 Verse (20)</Text>
              </TouchableOpacity>
            </View>
          )}

          {showHintReference && !selected && (
            <View style={styles.hintReferenceBox} accessibilityLiveRegion="polite">
              <Text style={styles.hintReferenceText}>Ref: {current.reference}</Text>
            </View>
          )}

          <Animated.View style={{ opacity: fadeAnim, width: '100%' }} accessible accessibilityLabel="Answer options">
            {current.options.map((opt, i) => {
              const isDisabled = disabledOptions.includes(opt);
              if (isDisabled) return <View key={i} style={styles.disabledOptionPlaceholder} />;

              return (
                <AnswerOption
                  key={i}
                  option={opt}
                  index={i}
                  selected={selected}
                  correctAnswer={current.answer}
                  isTimeout={isTimeout}
                  onSelect={handleAnswer}
                />
              );
            })}
          </Animated.View>
        </Animated.View>

        {selected && showExplanation && settings?.showExplanations && (
          <View style={styles.explanationBox} accessibilityLiveRegion="polite">
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationText}>{current.explanation}</Text>
            <View style={styles.refBox}>
              <Text style={styles.refText}>{current.reference}</Text>
            </View>
          </View>
        )}

        {selected && !settings?.showExplanations && (
          <View style={styles.refBox}>
            <Text style={styles.refText}>{current.reference}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  scrollView: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10, marginBottom: 14 },
  backBtn: { padding: 4 },
  backText: { color: colors.textSecondary, fontSize: 16 },
  badge: { fontSize: 10, letterSpacing: 2, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  scoreText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  currencyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: colors.cardBorder },
  coinIcon: { fontSize: 14, marginRight: 4 },
  coinText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  timeoutBanner: { width: '100%', backgroundColor: colors.error + '20', borderWidth: 1, borderColor: colors.error, borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginBottom: 10 },
  timeoutText: { color: colors.error, fontSize: 13, fontWeight: '600' },
  hintRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 15 },
  hintBtn: { backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.primary + '40' },
  hintBtnDisabled: { opacity: 0.5 },
  hintBtnText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  hintReferenceBox: { backgroundColor: colors.primary + '10', padding: 8, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  hintReferenceText: { color: colors.primary, fontSize: 12, fontWeight: '600', fontStyle: 'italic' },
  disabledOptionPlaceholder: { height: 0, marginVertical: 0 },
  refBox: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  refText: { color: colors.textSecondary, fontSize: 12, fontStyle: 'italic' },
  explanationBox: { marginTop: 16, padding: 16, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder },
  explanationTitle: { fontSize: 12, fontWeight: '600', color: colors.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  explanationText: { fontSize: 14, color: colors.text, lineHeight: 22 },
});
