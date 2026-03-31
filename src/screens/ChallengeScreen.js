import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUESTIONS } from '../data/questions';
import { playCorrect, playWrong, playTick } from '../utils/sounds';
import { TimerBar, ProgressBar, QuestionCard, AnswerOption } from '../components';
import { useTheme } from '../context/ThemeContext';
import { loadSettings } from '../utils/storage';
import { vibrateOnCorrect, vibrateOnWrong, vibrateOnSelection } from '../utils/haptics';

const CHALLENGE_MODES = [
  {
    id: 'speed',
    title: 'Speed Round',
    description: 'Answer as fast as you can',
    icon: '⚡',
    timer: 5,
    questionCount: 10,
    color: '#FF6B6B',
    pointsPerCorrect: 2,
    bonusMultiplier: 1.5,
  },
  {
    id: 'marathon',
    title: 'Marathon',
    description: '50 questions, 10 seconds each',
    icon: '🏃',
    timer: 10,
    questionCount: 50,
    color: '#4ECDC4',
    pointsPerCorrect: 1,
    bonusMultiplier: 1,
  },
  {
    id: 'survival',
    title: 'Survival',
    description: '3 lives, infinite questions',
    icon: '❤️',
    timer: 8,
    questionCount: null,
    color: '#D95F4B',
    pointsPerCorrect: 3,
    bonusMultiplier: 2,
    lives: 3,
  },
  {
    id: 'blitz',
    title: 'Blitz Mode',
    description: '60 seconds, answer as many as possible',
    icon: '💥',
    timer: null,
    questionCount: null,
    color: '#9B59B6',
    pointsPerCorrect: 1,
    bonusMultiplier: 1,
    totalTime: 60,
  },
];

const DIFF_COLOR = { easy: '#4CAF82', medium: '#E6A817', hard: '#D95F4B' };

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ChallengeScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { mode } = route.params || {};
  const [selectedMode, setSelectedMode] = useState(mode || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wrong, setWrong] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [settings, setSettings] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [blitzTime, setBlitzTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const scoreRef = useRef(0);
  const wrongRef = useRef([]);
  const selectedRef = useRef(null);
  const streakRef = useRef(0);
  const timerRef = useRef(null);
  const blitzTimerRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSettings().then(setSettings);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    };
  }, []);

  const startGame = (modeConfig) => {
    setSelectedMode(modeConfig);
    setIsPlaying(true);
    setScore(0);
    setLives(modeConfig.lives || 3);
    setWrong([]);
    setIndex(0);
    setTotalTime(0);
    setStreak(0);
    setStreakBonus(0);
    setGameOver(false);

    scoreRef.current = 0;
    wrongRef.current = [];
    streakRef.current = 0;

    const allQuestions = shuffle([...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard]);
    const count = modeConfig.questionCount || allQuestions.length;
    setQuestions(allQuestions.slice(0, count));

    if (modeConfig.totalTime) {
      setBlitzTime(modeConfig.totalTime);
      startBlitzTimer(modeConfig.totalTime);
    } else {
      startQuestionTimer(modeConfig.timer || 10);
    }
  };

  const startQuestionTimer = (seconds) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(seconds);
    selectedRef.current = null;
    setSelected(null);
    setShowExplanation(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        if (prev <= 5 && prev > 1) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBlitzTimer = (seconds) => {
    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    setBlitzTime(seconds);

    blitzTimerRef.current = setInterval(() => {
      setBlitzTime(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        if (prev <= 10) playTick();
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = useCallback(() => {
    if (!selectedRef.current) {
      playWrong();
      vibrateOnWrong();
      setSelected('__timeout__');
      selectedRef.current = '__timeout__';
      wrongRef.current = [...wrongRef.current, questions[index]];
      setWrong(prev => [...prev, questions[index]]);
      streakRef.current = 0;
      setStreak(0);
      shakeIt();

      if (selectedMode.lives) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            endGame();
          }
          return newLives;
        });
      }

      setShowExplanation(true);
      scheduleNext(scoreRef.current, wrongRef.current);
    }
  }, [questions, index, selectedMode]);

  const { current } = { current: questions[index] };
  const total = questions.length;
  const diffColor = DIFF_COLOR.easy;

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
        if (selectedMode.id === 'survival' && lives <= 0) {
          endGame();
          return;
        }
        if (selectedMode.id === 'blitz' && blitzTime <= 0) {
          endGame();
          return;
        }

        if (index + 1 >= questions.length) {
          endGame();
          return;
        }

        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
          setIndex(i => i + 1);
          if (timerRef.current) clearInterval(timerRef.current);
          Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
          if (selectedMode.totalTime) {
            startBlitzTimer(blitzTime);
          } else {
            startQuestionTimer(selectedMode.timer || 10);
          }
        });
      }, settings?.showExplanations ? 2500 : 1200);
    },
    [index, questions.length, lives, blitzTime, selectedMode, fadeAnim, settings]
  );

  const handleAnswer = (option) => {
    if (selectedRef.current) return;
    vibrateOnSelection();
    setSelected(option);
    selectedRef.current = option;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = option === current.answer;
    let points = 0;
    let bonus = 0;

    if (isCorrect) {
      playCorrect();
      vibrateOnCorrect();
      streakRef.current += 1;
      setStreak(streakRef.current);

      const streakBonusPoints = Math.floor(streakRef.current / 3);
      setStreakBonus(streakBonusPoints);

      points = selectedMode.pointsPerCorrect;
      bonus = streakBonusPoints;
      scoreRef.current += points + bonus;
      setScore(scoreRef.current);

      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } else {
      playWrong();
      vibrateOnWrong();
      wrongRef.current = [...wrongRef.current, current];
      setWrong(prev => [...prev, current]);
      streakRef.current = 0;
      setStreak(0);
      setStreakBonus(0);
      shakeIt();

      if (selectedMode.lives) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setTimeout(() => endGame(), 500);
          }
          return newLives;
        });
      }
    }

    setShowExplanation(true);
    scheduleNext(scoreRef.current, wrongRef.current);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    setGameOver(true);
  };

  const styles = createStyles(colors);

  if (!isPlaying) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Challenges</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Select a Challenge Mode</Text>

          {CHALLENGE_MODES.map((modeConfig) => (
            <TouchableOpacity
              key={modeConfig.id}
              style={[styles.modeCard, { borderColor: modeConfig.color }]}
              onPress={() => startGame(modeConfig)}
              activeOpacity={0.75}
            >
              <View style={[styles.modeIcon, { backgroundColor: modeConfig.color + '20' }]}>
                <Text style={styles.modeEmoji}>{modeConfig.icon}</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={[styles.modeTitle, { color: modeConfig.color }]}>{modeConfig.title}</Text>
                <Text style={styles.modeDesc}>{modeConfig.description}</Text>
              </View>
              <Text style={[styles.arrow, { color: modeConfig.color }]}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (gameOver) {
    const pct = questions.length > 0 ? Math.round((score / (questions.length * selectedMode.pointsPerCorrect * selectedMode.bonusMultiplier)) * 100) : 0;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Game Over!</Text>
          <View style={[styles.scoreBubble, { borderColor: selectedMode.color }]}>
            <Text style={[styles.finalScore, { color: selectedMode.color }]}>{score}</Text>
            <Text style={styles.scoreLabel}>Points</Text>
          </View>
          <Text style={styles.statsText}>
            {questions.length - wrong.length}/{questions.length} Correct
          </Text>
          <Text style={styles.statsText}>
            Best Streak: {streak}
          </Text>

          <TouchableOpacity
            style={[styles.playAgainBtn, { borderColor: selectedMode.color }]}
            onPress={() => startGame(selectedMode)}
          >
            <Text style={[styles.playAgainText, { color: selectedMode.color }]}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => {
              setIsPlaying(false);
              setGameOver(false);
            }}
          >
            <Text style={styles.exitText}>Back to Challenges</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isTimeout = selected === '__timeout__';
  const timer = selectedMode.totalTime ? blitzTime : timeLeft;
  const maxTimer = selectedMode.totalTime || selectedMode.timer || 10;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {
          if (timerRef.current) clearInterval(timerRef.current);
          if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
          setIsPlaying(false);
        }} style={styles.backBtn}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <View style={[styles.modeBadge, { backgroundColor: selectedMode.color + '20', borderColor: selectedMode.color }]}>
          <Text style={[styles.modeBadgeText, { color: selectedMode.color }]}>{selectedMode.title}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: selectedMode.color }]}>{score}</Text>
          {streak > 2 && (
            <Text style={styles.streakText}>🔥{streak}</Text>
          )}
        </View>
      </View>

      <ProgressBar
        current={index + 1}
        total={total}
        diffColor={selectedMode.color}
        progressAnim={progressAnim}
      />

      {selectedMode.lives && (
        <View style={styles.livesContainer}>
          {[...Array(3)].map((_, i) => (
            <Text key={i} style={styles.lifeIcon}>{i < lives ? '❤️' : '🖤'}</Text>
          ))}
        </View>
      )}

      <TimerBar
        timeLeft={timer}
        totalSeconds={maxTimer}
        diffColor={selectedMode.color}
        timerAnim={new Animated.Value(timer / maxTimer)}
        selected={selected}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <QuestionCard question={current?.question} fadeAnim={fadeAnim} shakeAnim={shakeAnim} />

          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            {current?.options.map((opt, i) => (
              <AnswerOption
                key={i}
                option={opt}
                index={i}
                selected={selected}
                correctAnswer={current.answer}
                isTimeout={isTimeout}
                onSelect={handleAnswer}
              />
            ))}
          </Animated.View>
        </Animated.View>

        {selected && showExplanation && settings?.showExplanations && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationText}>{current?.explanation}</Text>
            <View style={styles.refBox}>
              <Text style={styles.refText}>{current?.reference}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: colors.primary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  placeholder: { width: 60 },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 12, letterSpacing: 2, color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', backgroundColor: colors.card,
    borderWidth: 1, borderRadius: 14,
    paddingVertical: 18, paddingHorizontal: 20, marginBottom: 12,
  },
  modeIcon: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  modeEmoji: { fontSize: 24 },
  modeInfo: { flex: 1 },
  modeTitle: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
  modeDesc: { fontSize: 12, color: colors.textSecondary },
  arrow: { fontSize: 26, fontWeight: '200', lineHeight: 28 },
  scrollView: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginTop: 10, marginBottom: 14, paddingHorizontal: 20,
  },
  modeBadge: {
    fontSize: 10, letterSpacing: 2, borderWidth: 1, borderRadius: 4,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  modeBadgeText: { fontSize: 11, fontWeight: '600' },
  scoreContainer: { alignItems: 'flex-end' },
  scoreText: { fontSize: 20, fontWeight: '700' },
  streakText: { fontSize: 11, color: colors.warning },
  livesContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  lifeIcon: { fontSize: 20, marginHorizontal: 4 },
  refBox: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  refText: { color: colors.textSecondary, fontSize: 12, fontStyle: 'italic' },
  explanationBox: { marginTop: 16, padding: 16, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder },
  explanationTitle: { fontSize: 12, fontWeight: '600', color: colors.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  explanationText: { fontSize: 14, color: colors.text, lineHeight: 22 },
  gameOverContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  gameOverTitle: { fontSize: 32, fontWeight: '700', color: colors.text, marginBottom: 24 },
  scoreBubble: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 3,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  finalScore: { fontSize: 42, fontWeight: '700' },
  scoreLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  statsText: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  playAgainBtn: {
    width: '80%', borderWidth: 1, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 20,
  },
  playAgainText: { fontSize: 16, fontWeight: '600' },
  exitBtn: {
    width: '80%', borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 12,
  },
  exitText: { fontSize: 15, color: colors.textSecondary },
});
