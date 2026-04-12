import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, ScrollView, Alert, Easing, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress, STREAK_MILESTONES } from '../context/ProgressContext';
import { getDailyVerse } from '../data/questions';
import useReducedMotion from '../hooks/useReducedMotion';

const { width } = Dimensions.get('window');

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy', subtitle: 'Basic Bible knowledge', color: '#4CAF82', lightColor: '#E8F5E9' },
  { key: 'medium', label: 'Medium', subtitle: 'Some study required', color: '#E6A817', lightColor: '#FFF8E1' },
  { key: 'hard', label: 'Hard', subtitle: 'Deep scripture knowledge', color: '#D95F4B', lightColor: '#FFEBEE' },
  { key: 'expert', label: 'Expert', subtitle: 'Master biblical scholar', color: '#9B59B6', lightColor: '#F3E5F5' },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { isUnlocked, progress, getStreakMilestone } = useProgress();
  const reducedMotion = useReducedMotion();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const journeyAnim = useRef(new Animated.Value(0)).current;
  const dailyAnim = useRef(new Animated.Value(0)).current;
  const dailyPulseAnim = useRef(new Animated.Value(1)).current;
  const difficultyCardAnims = useRef(DIFFICULTIES.map(() => new Animated.Value(0))).current;
  const fireAnim = useRef(new Animated.Value(1)).current;
  const [dailyVerse] = useState(getDailyVerse);

  const nextMilestone = getStreakMilestone();

  const accuracy = (progress.totalQuestionsAnswered || 0) > 0
    ? Math.round(((progress.totalCorrect || 0) / progress.totalQuestionsAnswered) * 100)
    : 0;
  const quizzes =
    (progress.easyCompleted || 0) +
    (progress.mediumCompleted || 0) +
    (progress.hardCompleted || 0) +
    (progress.expertCompleted || 0) +
    (progress.dailyChallengesCompleted || 0);

  useEffect(() => {
    if (progress.dailyChallengeCompleted || reducedMotion) {
      dailyPulseAnim.setValue(1);
      return undefined;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dailyPulseAnim, { toValue: 1.02, duration: 980, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dailyPulseAnim, { toValue: 1, duration: 980, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [dailyPulseAnim, progress.dailyChallengeCompleted, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      fireAnim.setValue(1);
      return undefined;
    }

    if (progress.currentStreak >= 3) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(fireAnim, { toValue: 1.08, duration: 430, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(fireAnim, { toValue: 1, duration: 430, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [fireAnim, progress.currentStreak, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      journeyAnim.setValue(1);
      dailyAnim.setValue(1);
      difficultyCardAnims.forEach((anim) => anim.setValue(1));
      return;
    }

    Animated.stagger(90, [
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 560, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 560, useNativeDriver: true }),
      ]),
      Animated.timing(journeyAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(dailyAnim, { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.stagger(
      70,
      difficultyCardAnims.map((anim) => Animated.timing(anim, { toValue: 1, duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }))
    ).start();
  }, [dailyAnim, difficultyCardAnims, fadeAnim, journeyAnim, reducedMotion, slideAnim]);

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.currencyBadge}
              onPress={() => navigation.navigate('Shop')}
              activeOpacity={0.7}
            >
              <Text style={styles.coinIcon}>🪙</Text>
              <Text style={styles.coinText}>{progress.coins || 0}</Text>
              {progress.isPro && (
                <View style={styles.miniProBadge}>
                  <Text style={styles.miniProText}>PRO</Text>
                </View>
              )}
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.eyebrow}>THE WORD OF GOD</Text>
          <Text style={styles.title}>Bible Trivia</Text>

          {progress.currentStreak > 0 && (
            <View style={styles.streakContainer}>
              <Animated.View style={[styles.streakBadge, progress.currentStreak >= 3 && { transform: [{ scale: fireAnim }] }]}>
                <Text style={styles.streakIcon}>{progress.currentStreak >= 7 ? '🔥🔥🔥' : '🔥'}</Text>
                <Text style={styles.streakText}>{progress.currentStreak} day streak!</Text>
              </Animated.View>
              <Text style={styles.milestoneText}>Next: {nextMilestone.name} ({nextMilestone.days} days)</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View
          style={{
            opacity: journeyAnim,
            transform: [{
              translateY: journeyAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [26, 0],
              })
            }],
          }}
        >
          <TouchableOpacity
            style={styles.journeyBtn}
            onPress={() => navigation.navigate('Journey')}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1504052434569-70ad5816544a?q=80&w=1000&auto=format&fit=crop' }}
              style={styles.journeyBg}
              imageStyle={{ borderRadius: 24 }}
            >
              <View style={styles.journeyOverlay}>
                <View style={styles.journeyContent}>
                  <View style={styles.journeyIconContainer}>
                    <Text style={styles.journeyEmoji}>🧭</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.journeyTitle}>Biblical Journey</Text>
                    <Text style={styles.journeySub}>Trace the story from Creation to Paul</Text>
                  </View>
                  <View style={styles.journeyArrowCircle}>
                    <Text style={styles.journeyArrow}>›</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: dailyAnim,
            transform: [
              {
                translateY: dailyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, 0],
                }),
              },
              { scale: dailyPulseAnim },
            ],
          }}
        >
          <TouchableOpacity
            style={[styles.dailyChallengeBtn, progress.dailyChallengeCompleted ? styles.dailyChallengeDone : { backgroundColor: colors.primary }]}
            onPress={() => {
              if (progress.dailyChallengeCompleted) {
                Alert.alert('Completed', "You have already finished today's challenge. Come back tomorrow!");
              } else {
                navigation.navigate('Quiz', { difficulty: 'mixed', seconds: 15, isDaily: true });
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.dailyIconBox}>
              <Text style={styles.dailyEmoji}>{progress.dailyChallengeCompleted ? '✅' : '☀️'}</Text>
            </View>
            <View style={styles.dailyTextContainer}>
              <Text style={[styles.dailyTitle, { color: progress.dailyChallengeCompleted ? colors.text : '#FFF' }]}>
                Daily Challenge
              </Text>
              <Text style={[styles.dailySub, { color: progress.dailyChallengeCompleted ? colors.textMuted : '#FFF' }]}>
                {progress.dailyChallengeCompleted ? 'Come back tomorrow!' : '5 Questions · 50 ✨ bonus'}
              </Text>
            </View>
            {!progress.dailyChallengeCompleted && <Text style={styles.playIcon}>▶</Text>}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.dailyVerse}>
          <View style={styles.verseInner}>
            <Text style={styles.verseIcon}>📖</Text>
            <Text style={styles.verseText}>"{dailyVerse.text}"</Text>
            <Text style={styles.verseRef}>— {dailyVerse.ref}</Text>
          </View>
        </View>

        <View style={styles.snapshotCard}>
          <Text style={styles.snapshotTitle}>Knowledge Profile: <Text style={{ color: colors.primary }}>{progress.knowledgeLevel}</Text></Text>
          <View style={styles.snapshotRow}>
            <View style={styles.snapshotMetric}>
              <Text style={styles.snapshotValue}>{accuracy}%</Text>
              <Text style={styles.snapshotLabel}>Accuracy</Text>
            </View>
            <View style={styles.snapshotMetric}>
              <Text style={styles.snapshotValue}>{quizzes}</Text>
              <Text style={styles.snapshotLabel}>Quizzes</Text>
            </View>
            <View style={styles.snapshotMetric}>
              <Text style={styles.snapshotValue}>{progress.currentStreak}</Text>
              <Text style={styles.snapshotLabel}>Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.divLine} />
          <Text style={styles.divIcon}>✦</Text>
          <View style={styles.divLine} />
        </View>

        <Text style={styles.chooseLabel}>Select Difficulty</Text>

        <View style={styles.difficultyGrid}>
          {DIFFICULTIES.map((d, index) => {
            const locked = !isUnlocked(d.key);
            return (
              <Animated.View
                key={d.key}
                style={{
                  opacity: difficultyCardAnims[index],
                  transform: [
                    {
                      translateY: difficultyCardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                    {
                      scale: difficultyCardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[styles.diffCard, locked ? styles.diffCardLocked : { backgroundColor: d.color }]}
                  onPress={() => { if (!locked) navigation.navigate('Quiz', { difficulty: d.key, seconds: d.seconds }); }}
                  activeOpacity={0.75}
                >
                  <View style={styles.diffContent}>
                    <View style={styles.diffHeader}>
                      <Text style={[styles.diffLabel, locked && { color: colors.textMuted }]}>{d.label}</Text>
                      {locked ? <Text style={styles.lockIcon}>🔒</Text> : <Text style={styles.playIconSmall}>▶</Text>}
                    </View>
                    <Text style={[styles.diffSub, locked && { color: colors.textMuted }]}>{d.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Collection')}>
            <View style={[styles.iconBox, { backgroundColor: '#FFD70020' }]}>
              <Text style={styles.btnIcon}>🧩</Text>
            </View>
            <Text style={styles.btnText}>Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Leaderboard')}>
            <View style={[styles.iconBox, { backgroundColor: '#4CAF5020' }]}>
              <Text style={styles.btnIcon}>🏆</Text>
            </View>
            <Text style={styles.btnText}>Ranking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Reflections')}>
            <View style={[styles.iconBox, { backgroundColor: '#2196F320' }]}>
              <Text style={styles.btnIcon}>📝</Text>
            </View>
            <Text style={styles.btnText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Challenge')}>
            <View style={[styles.iconBox, { backgroundColor: '#FF572220' }]}>
              <Text style={styles.btnIcon}>⚡</Text>
            </View>
            <Text style={styles.btnText}>Events</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
          <Text style={styles.settingsText}>Settings & Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30 },
  header: { alignItems: 'center', paddingTop: 20, marginBottom: 24 },
  topRow: { position: 'absolute', top: 0, right: 0 },
  currencyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  coinIcon: { fontSize: 16, marginRight: 6 },
  coinText: { fontSize: 14, fontWeight: '800', color: colors.warning },
  miniProBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  miniProText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.background,
  },
  plusIcon: { fontSize: 12, marginLeft: 6, color: colors.primary, fontWeight: '900' },
  eyebrow: { fontSize: 10, letterSpacing: 3, color: colors.primary, fontWeight: '800', marginBottom: 6 },
  title: { fontSize: 42, fontWeight: '900', color: colors.text, letterSpacing: -0.5, marginBottom: 8 },
  streakContainer: { alignItems: 'center', marginTop: 8 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.warning + '40', shadowColor: colors.warning, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  streakIcon: { fontSize: 16, marginRight: 8 },
  streakText: { fontSize: 14, color: colors.warning, fontWeight: '700' },
  milestoneText: { fontSize: 12, color: colors.textMuted, marginTop: 6, fontStyle: 'italic' },
  journeyBtn: { width: '100%', height: 160, marginBottom: 20, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  journeyBg: { flex: 1 },
  journeyOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', padding: 20 },
  journeyContent: { flexDirection: 'row', alignItems: 'center' },
  journeyIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  journeyEmoji: { fontSize: 28 },
  journeyTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 2 },
  journeySub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  journeyArrowCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  journeyArrow: { fontSize: 24, color: '#000', fontWeight: 'bold', marginTop: -2 },
  dailyChallengeBtn: { flexDirection: 'row', alignItems: 'center', padding: 20, marginBottom: 20, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  dailyChallengeDone: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  dailyIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  dailyEmoji: { fontSize: 24 },
  dailyTextContainer: { flex: 1 },
  dailyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 2, color: '#FFF' },
  dailySub: { fontSize: 12, fontWeight: '600', opacity: 0.9, color: '#FFF' },
  playIcon: { fontSize: 20, color: '#FFF', marginLeft: 10 },
  dailyVerse: { backgroundColor: colors.card, borderRadius: 20, marginBottom: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  verseInner: { padding: 24, alignItems: 'center' },
  verseIcon: { fontSize: 22, marginBottom: 12 },
  verseText: { fontSize: 16, color: colors.text, fontStyle: 'italic', textAlign: 'center', lineHeight: 26, fontWeight: '500' },
  verseRef: { fontSize: 13, color: colors.primary, marginTop: 14, fontWeight: '700', letterSpacing: 0.5 },
  snapshotCard: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  snapshotTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 },
  snapshotRow: { flexDirection: 'row', gap: 12 },
  snapshotMetric: { flex: 1, backgroundColor: colors.background, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  snapshotValue: { color: colors.text, fontSize: 20, fontWeight: '900' },
  snapshotLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divIcon: { color: colors.primary, fontSize: 14, marginHorizontal: 15 },
  chooseLabel: { fontSize: 11, letterSpacing: 2, color: colors.textMuted, fontWeight: '800', textTransform: 'uppercase', marginBottom: 16 },
  difficultyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  diffCard: { width: (width - 52) / 2, borderRadius: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  diffCardLocked: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, opacity: 0.7 },
  diffContent: { padding: 18, height: 110, justifyContent: 'space-between' },
  diffHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  diffLabel: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  lockIcon: { fontSize: 16 },
  playIconSmall: { fontSize: 14, color: '#FFF', opacity: 0.8 },
  diffSub: { fontSize: 11, color: '#FFF', opacity: 0.9, fontWeight: '600', lineHeight: 14 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  gridBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  btnIcon: { fontSize: 18 },
  btnText: { fontSize: 14, fontWeight: '700', color: colors.text },
  settingsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginTop: 10, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  settingsIcon: { fontSize: 18, marginRight: 10 },
  settingsText: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
});
