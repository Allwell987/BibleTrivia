import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Alert, Modal, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUESTIONS, shuffleArray, ERAS } from '../data/questions';

import useTimer from '../hooks/useTimer';
import useReducedMotion from '../hooks/useReducedMotion';
import { playCorrect, playWrong, playTick, playPowerup } from '../utils/sounds';
import { TimerBar, ProgressBar, QuestionCard, AnswerOption } from '../components';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { loadSettings } from '../utils/storage';
import { vibrateOnCorrect, vibrateOnWrong, vibrateOnSelection } from '../utils/haptics';
import { trackEvent } from '../utils/analytics';
import { showInterstitialAd } from '../utils/ads';

const { width } = Dimensions.get('window');
const DIFF_COLOR = { easy: '#4CAF82', medium: '#E6A817', hard: '#D95F4B', expert: '#9B59B6', mixed: '#C9A84C', all: '#C9A84C' };

export function selectDidYouKnowCandidate({ wrongAnswers = [], questions = [], seenDidYouKnow = [] }) {
  const allCandidates = [...wrongAnswers, ...questions]
    .filter((q, idx, arr) => q?.question && arr.findIndex((x) => x.question === q.question) === idx);
  if (allCandidates.length === 0) return null;

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const recentKeys = new Set(
    (seenDidYouKnow || [])
      .filter((entry) => entry.date >= cutoff)
      .map((entry) => entry.key)
  );

  const unseenCandidates = allCandidates.filter((q) => !recentKeys.has(q.question));
  return unseenCandidates[0] || allCandidates[0];
}

export default function QuizScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress, spendCoins, completeDailyChallenge, updateProgress } = useProgress();
  const reducedMotion = useReducedMotion();

  const {
    difficulty = 'medium',
    seconds = 15,
    category = 'all',
    isDaily = false,
    isReview = false,
    era = null,
    questionCount = null,
    timerEnabled = true,
    hintsEnabled = true
  } = route.params || {};

  const [questions] = useState(() => {
    let pool = [];
    if (isReview) {
      const missedMap = progress.missedQuestions || {};
      const allQ = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard, ...QUESTIONS.expert];
      // Filter questions that were missed
      pool = allQ.filter(q => missedMap[q.question] > 0);

      // If we don't have enough missed questions, add some from current level
      if (pool.length < 5) {
        const difficultyPool = QUESTIONS[difficulty] || QUESTIONS.easy;
        pool = [...pool, ...shuffleArray(difficultyPool).slice(0, 5)];
      }
    } else if (era) {
      pool = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard].filter(q => q.era === era);
    } else if (difficulty === 'mixed' || difficulty === 'all') {
      pool = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard, ...QUESTIONS.expert];
    } else {
      pool = QUESTIONS[difficulty] || QUESTIONS.easy;
    }

    if (category !== 'all') {
      pool = pool.filter(q => q.category === category);
    }

    // Fallback if filter is too restrictive
    if (pool.length === 0) {
      pool = QUESTIONS.easy;
    }

    if (isDaily) {
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const seenCutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
      const recentlySeen = new Set(
        (progress.seenDailyQuestions || [])
          .filter(e => e.date >= seenCutoff)
          .map(e => e.key)
      );
      const fresh = pool.filter(q => !recentlySeen.has(q.question));
      pool = fresh.length >= 5 ? fresh : pool;
    }

    const count = questionCount || (isDaily ? 5 : 10);
    return shuffleArray(pool).slice(0, count);
  });

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [settings, setSettings] = useState(null);

  // Track total time used
  const startTimeRef = useRef(Date.now());
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);

  // Power-ups state
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [showVerse, setShowVerse] = useState(false);

  const [results, setResults] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const scoreRef = useRef(0);
  const selectedRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const questionSlideAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;
  const timerPulseAnim = useRef(new Animated.Value(1)).current;
  const powerupScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSettings().then(setSettings);
    startTimeRef.current = Date.now();
  }, []);

  const current = questions[index] || { question: 'Loading...', options: [], answer: '' };
  const total = questions.length;
  const diffColor = DIFF_COLOR[difficulty] || colors.primary;

  const handleFiftyFifty = async () => {
    if (selected || hiddenOptions.length > 0 || !hintsEnabled) return;

    const cost = 50;
    if (progress.coins < cost) {
      Alert.alert(
        'Not enough coins',
        `You need ${cost} coins for 50/50.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Coins', onPress: () => navigation.navigate('Shop') }
        ]
      );
      return;
    }

    const success = await spendCoins(cost);
    if (success) {
      playPowerup();
      const incorrectOptions = current.options.filter(opt => opt !== current.answer);
      const toHide = shuffleArray(incorrectOptions).slice(0, 2);
      setHiddenOptions(toHide);
      trackEvent('use_powerup', { type: '50_50', question: current.question });
    }
  };

  const handleRevealVerse = async () => {
    if (selected || showVerse || !hintsEnabled) return;

    const cost = 25;
    if (progress.coins < cost) {
      Alert.alert(
        'Not enough coins',
        `You need ${cost} coins to reveal the verse.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Coins', onPress: () => navigation.navigate('Shop') }
        ]
      );
      return;
    }

    const success = await spendCoins(cost);
    if (success) {
      playPowerup();
      setShowVerse(true);
      if (reducedMotion) {
        powerupScale.setValue(1);
      } else {
        powerupScale.setValue(0);
        Animated.spring(powerupScale, { toValue: 1, friction: 7, useNativeDriver: true }).start();
      }
      trackEvent('use_powerup', { type: 'reveal_verse', question: current.question });
    }
  };

  const buildDidYouKnow = () => {
    const source = selectDidYouKnowCandidate({
      wrongAnswers,
      questions,
      seenDidYouKnow: progress.seenDidYouKnow,
    });
    if (!source) return null;

    return {
      key: source.question,
      question: source.question,
      fact: source.insight || source.explanation,
      reflection: source.reflection || 'How can you apply this truth today?',
      reference: source.reference,
    };
  };

  const handleTimeUp = useCallback(() => {
    if (!selectedRef.current && timerEnabled) {
      handleAnswer('__timeout__');
    }
  }, [current, index, timerEnabled]);

  const { timeLeft, resetTimer } = useTimer(seconds, handleTimeUp, !selected && timerEnabled);

  useEffect(() => {
    if (timerEnabled && !selectedRef.current && timeLeft <= 5 && timeLeft > 0) playTick();
    Animated.timing(timerAnim, { toValue: timerEnabled ? (timeLeft / seconds) : 1, duration: 750, useNativeDriver: false }).start();

    if (reducedMotion) {
      timerPulseAnim.setValue(1);
      return;
    }

    if (timerEnabled && !selectedRef.current && timeLeft <= 5 && timeLeft > 0) {
      timerPulseAnim.setValue(1);
      Animated.sequence([
        Animated.timing(timerPulseAnim, { toValue: 1.06, duration: 170, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(timerPulseAnim, { toValue: 1, duration: 170, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else {
      timerPulseAnim.setValue(1);
    }
  }, [reducedMotion, seconds, timeLeft, timerAnim, timerEnabled, timerPulseAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: index / total, duration: 320, useNativeDriver: false }).start();
  }, [index, total]);

  const handleAnswer = (option) => {
    if (selectedRef.current) return;
    vibrateOnSelection();
    setSelected(option);
    selectedRef.current = option;

    const isCorrect = option === current.answer;

    setResults(prev => [...prev, { era: current.era, bibleBook: current.bibleBook, isCorrect }]);

    if (isCorrect) {
      playCorrect();
      vibrateOnCorrect();
      scoreRef.current += 1;
      setScore(scoreRef.current);
    } else {
      playWrong();
      vibrateOnWrong();
      setWrongAnswers(prev => [...prev, current]);
      if (!reducedMotion) {
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8, duration: 45, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 45, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true }),
        ]).start();
      }
    }

    // Small delay before showing insight for captivation
    setTimeout(() => {
      setShowInsight(true);
    }, 500);
  };

  const handleNext = () => {
    setShowInsight(false);
    if (index + 1 >= total) {
      const didYouKnow = buildDidYouKnow();
      const finalTimeUsed = Math.round((Date.now() - startTimeRef.current) / 1000);

      if (isDaily) {
        const questionKeys = questions.map(q => q.question);
        completeDailyChallenge(scoreRef.current, total, results, questionKeys, didYouKnow?.key);
      } else {
        updateProgress(difficulty, scoreRef.current, total, results, didYouKnow?.key);
      }

      if (!progress.isPro) {
        showInterstitialAd();
      }

      navigation.replace('Result', {
        score: scoreRef.current,
        total,
        difficulty,
        wrong: wrongAnswers,
        isDaily,
        era,
        totalTime: finalTimeUsed,
        reflectionPrompt: questions[total - 1]?.reflection || 'How can you apply this truth today?',
        didYouKnow,
        // Pass back custom params for Play Again
        seconds,
        category,
        questionCount,
        timerEnabled,
        hintsEnabled
      });
      return;
    }

    if (reducedMotion) {
      setIndex(i => i + 1);
      setSelected(null);
      selectedRef.current = null;
      setHiddenOptions([]);
      setShowVerse(false);
      resetTimer();
      questionSlideAnim.setValue(0);
      fadeAnim.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(questionSlideAnim, { toValue: -24, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setIndex(i => i + 1);
      setSelected(null);
      selectedRef.current = null;
      setHiddenOptions([]);
      setShowVerse(false);
      resetTimer();
      questionSlideAnim.setValue(22);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(questionSlideAnim, { toValue: 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    });
  };

  const styles = createStyles(colors);

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No questions found for this selection.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.continueBtn}>
            <Text style={styles.continueText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backText}>‹ Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.coinBadge}
          onPress={() => navigation.navigate('Shop')}
          activeOpacity={0.7}
        >
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinText}>{progress.coins}</Text>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
        <Text style={styles.scoreText}>{score}/{total}</Text>
      </View>

      <ProgressBar current={index + 1} total={total} diffColor={diffColor} progressAnim={progressAnim} />
      {timerEnabled && (
        <TimerBar
          timeLeft={timeLeft}
          totalSeconds={seconds}
          diffColor={diffColor}
          timerAnim={timerAnim}
          timerPulseAnim={timerPulseAnim}
          selected={selected}
        />
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, width: '100%', transform: [{ translateX: questionSlideAnim }] }}>
          <Text style={[styles.categoryBadge, { color: diffColor }]}>
            {era ? ERAS[era].toUpperCase() : current.category?.toUpperCase() || difficulty.toUpperCase()}
          </Text>

          <QuestionCard question={current.question} fadeAnim={fadeAnim} shakeAnim={shakeAnim} />

          {showVerse && (
            <Animated.View style={[styles.verseRevealCard, { transform: [{ scale: powerupScale }] }]}>
              <Text style={styles.verseLabel}>BIBLE REFERENCE</Text>
              <Text style={styles.verseText}>{current.reference}</Text>
            </Animated.View>
          )}

          <View style={{ width: '100%', marginTop: 10 }}>
            {current.options.map((opt, i) => (
              <AnswerOption
                key={i}
                option={opt}
                index={i}
                selected={selected}
                correctAnswer={current.answer}
                isTimeout={selected === '__timeout__'}
                onSelect={handleAnswer}
                isHidden={hiddenOptions.includes(opt)}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {!selected && hintsEnabled && (
        <View style={styles.powerUpsContainer}>
          <TouchableOpacity
            style={[styles.powerUpBtn, (hiddenOptions.length > 0 || progress.coins < 50) && styles.powerUpDisabled]}
            onPress={handleFiftyFifty}
            disabled={hiddenOptions.length > 0}
            activeOpacity={0.7}
          >
            <Text style={styles.powerUpEmoji}>🌓</Text>
            <Text style={styles.powerUpText}>50/50 (50)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.powerUpBtn, (showVerse || progress.coins < 25) && styles.powerUpDisabled]}
            onPress={handleRevealVerse}
            disabled={showVerse}
            activeOpacity={0.7}
          >
            <Text style={styles.powerUpEmoji}>📖</Text>
            <Text style={styles.powerUpText}>Verse (25)</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showInsight} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.insightCard}>
            <Text style={[styles.resultStatus, { color: selected === current.answer ? colors.success : colors.error }]}>
              {selected === current.answer ? 'Correct!' : (selected === '__timeout__' ? 'Time is up!' : 'Not quite...')}
            </Text>

            <Text style={styles.insightTitle}>Insight</Text>
            <Text style={styles.insightText}>{current.insight || current.explanation}</Text>

            {isDaily && (
              <>
                <View style={styles.divider} />
                <Text style={styles.reflectionTitle}>Reflection</Text>
                <Text style={styles.reflectionText}>{current.reflection || 'How can you apply this truth today?'}</Text>
              </>
            )}

            <TouchableOpacity style={[styles.continueBtn, { backgroundColor: diffColor }]} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.text, fontSize: 18, textAlign: 'center', marginBottom: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 14 },
  backText: { color: colors.textSecondary, fontSize: 16 },
  scoreText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  coinIcon: { fontSize: 14, marginRight: 4 },
  coinText: { fontSize: 14, fontWeight: '700', color: colors.warning },
  plusIcon: { fontSize: 11, marginLeft: 4, color: colors.primary, fontWeight: '900' },
  categoryBadge: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' },
  scrollView: { flex: 1 },
  verseRevealCard: { backgroundColor: colors.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.warning + '40', marginBottom: 16, borderLeftWidth: 4, borderLeftColor: colors.warning },
  verseLabel: { fontSize: 9, fontWeight: '800', color: colors.warning, letterSpacing: 1, marginBottom: 4 },
  verseText: { fontSize: 15, fontWeight: '600', color: colors.text },
  powerUpsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, borderTopWidth: 1, borderTopColor: colors.border },
  powerUpBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  powerUpDisabled: { opacity: 0.5 },
  powerUpEmoji: { fontSize: 16, marginRight: 8 },
  powerUpText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  insightCard: { backgroundColor: colors.card, borderRadius: 24, padding: 30, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  resultStatus: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  insightTitle: { fontSize: 12, fontWeight: '600', color: colors.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  insightText: { fontSize: 16, color: colors.text, lineHeight: 24, marginBottom: 20 },
  reflectionTitle: { fontSize: 12, fontWeight: '600', color: colors.warning, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  reflectionText: { fontSize: 15, color: colors.text, fontStyle: 'italic', lineHeight: 22, marginBottom: 30 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 20 },
  continueBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  continueText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
