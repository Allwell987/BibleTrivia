import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, ScrollView, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { getDailyVerse } from '../data/questions';
import { loadScores, loadStats, loadStreak } from '../utils/storage';
// import { showRewardedAd } from '../utils/ads';

const { width, height } = Dimensions.get('window');

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy', subtitle: 'Basic Bible knowledge', color: '#4CAF82', seconds: 20 },
  { key: 'medium', label: 'Medium', subtitle: 'Some study required', color: '#E6A817', seconds: 15 },
  { key: 'hard', label: 'Hard', subtitle: 'Deep scripture knowledge', color: '#D95F4B', seconds: 10 },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { isUnlocked, getDifficultyInfo, progress, claimDailyReward } = useProgress();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [dailyVerse] = useState(getDailyVerse);
  const [streak, setStreak] = useState(null);
  const [snapshot, setSnapshot] = useState({
    accuracy: 0,
    quizzes: 0,
    lastScore: null,
  });

  // Daily Reward State
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();

    // Check for daily reward on mount
    checkDailyReward();
  }, []);

  const checkDailyReward = async () => {
    const result = await claimDailyReward();
    if (result.success) {
      setRewardAmount(result.reward);
      setShowRewardModal(true);
    }
  };

  const handleWatchAd = () => {
    // Ad logic disabled for Expo Go compatibility
    /*
    setIsAdLoading(true);
    showRewardedAd(async (success) => {
      setIsAdLoading(false);
      if (success) {
        await earnCoins(100);
        setRewardAmount(100);
        setShowRewardModal(true);
      }
    });
    */
    Alert.alert('Unavailable in Expo Go', 'Watching ads is only available in the standalone app version.');
  };

  useFocusEffect(
    React.useCallback(() => {
      Promise.all([loadStreak(), loadStats(), loadScores()]).then(([st, stats, scores]) => {
        setStreak(st);
        const accuracy = stats.totalQuestions > 0
          ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
          : 0;
        setSnapshot({
          accuracy,
          quizzes: stats.totalQuizzes || 0,
          lastScore: scores[0] || null,
        });
      });
    }, [])
  );

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.crossWrap}>
            <View style={styles.crossV} />
            <View style={styles.crossH} />
          </View>

          <View style={styles.topRow}>
            <View style={styles.currencyBadge}>
              <Text style={styles.coinIcon}>✨</Text>
              <Text style={styles.coinText}>{progress.coins || 0}</Text>
            </View>
          </View>

          <Text style={styles.eyebrow}>The Word of God</Text>
          <Text style={styles.title}>Bible Trivia</Text>

          {streak && streak.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakText}>{streak.currentStreak} day streak!</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.dailyVerse, { opacity: fadeAnim }]}>
          <Text style={styles.verseIcon}>📖</Text>
          <Text style={styles.verseText}>"{dailyVerse.text}"</Text>
          <Text style={styles.verseRef}>— {dailyVerse.ref}</Text>
        </Animated.View>

        <View style={styles.snapshotCard}>
          <Text style={styles.snapshotTitle}>Performance Snapshot</Text>
          <View style={styles.snapshotRow}>
            <View style={styles.snapshotMetric}>
              <Text style={styles.snapshotValue}>{snapshot.accuracy}%</Text>
              <Text style={styles.snapshotLabel}>Accuracy</Text>
            </View>
            <View style={styles.snapshotMetric}>
              <Text style={styles.snapshotValue}>{snapshot.quizzes}</Text>
              <Text style={styles.snapshotLabel}>Quizzes</Text>
            </View>
            <View style={styles.snapshotMetric}>
              <Text style={styles.snapshotValue}>{streak?.currentStreak || 0}</Text>
              <Text style={styles.snapshotLabel}>Streak</Text>
            </View>
          </View>
          <Text style={styles.snapshotSubtext}>
            {snapshot.lastScore
              ? `Last: ${snapshot.lastScore.pct}% on ${snapshot.lastScore.difficulty}`
              : 'No saved score yet. Complete your first quiz.'}
          </Text>
        </View>

        {/* Ad Integration: Wisdom Reward Button (Disabled for Expo Go) */}
        <TouchableOpacity
          style={styles.adButton}
          onPress={handleWatchAd}
          accessibilityRole="button"
          accessibilityLabel="Get free wisdom coins"
          accessibilityHint="Shows rewarded ad availability information"
        >
          <Text style={styles.adButtonIcon}>📽️</Text>
          <View>
            <Text style={styles.adButtonTitle}>Get Free Wisdom</Text>
            <Text style={styles.adButtonSub}>Watch a video to receive 100 ✨ coins</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.divLine} />
          <Text style={styles.divIcon}>✦</Text>
          <View style={styles.divLine} />
        </View>

        <Text style={styles.chooseLabel}>Choose Your Difficulty</Text>

        {DIFFICULTIES.map((d) => {
          const locked = !isUnlocked(d.key);
          const diffInfo = locked ? getDifficultyInfo(d.key) : null;
          
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.card, { borderColor: locked ? colors.dim : d.color, opacity: locked ? 0.6 : 1 }]}
              onPress={() => {
                if (!locked) {
                  navigation.navigate('Quiz', { difficulty: d.key, seconds: d.seconds });
                }
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`${d.label} difficulty`}
              accessibilityHint={locked ? `Locked. ${diffInfo ? `${diffInfo.currentProgress}% complete toward unlock` : 'Meet unlock requirements first'}` : `Starts ${d.label} quiz with ${d.seconds} seconds per question`}
              accessibilityState={{ disabled: locked }}
            >
              <View style={[styles.dot, { backgroundColor: locked ? colors.dim : d.color }]} />
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: locked ? colors.textMuted : d.color }]}>
                  {d.label} {locked && '🔒'}
                </Text>
                <Text style={styles.cardSub}>
                  {locked && diffInfo ? `${diffInfo.currentProgress}% to unlock · ` : ''}
                  {d.subtitle} · ⏱ {d.seconds}s per question
                </Text>
              </View>
              {!locked && <Text style={[styles.arrow, { color: d.color }]}>›</Text>}
            </TouchableOpacity>
          );
        })}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.lbBtn}
            onPress={() => navigation.navigate('Leaderboard')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open leaderboard"
            accessibilityHint="View top saved scores"
          >
            <Text style={styles.lbIcon}>🏆</Text>
            <Text style={styles.lbText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statsBtn}
            onPress={() => navigation.navigate('Challenge')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open challenges"
            accessibilityHint="View challenge mode and objectives"
          >
            <Text style={styles.statsIcon}>⚡</Text>
            <Text style={styles.statsText}>Challenges</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.lbBtn}
            onPress={() => navigation.navigate('Statistics')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open statistics"
            accessibilityHint="View your quiz performance statistics"
          >
            <Text style={styles.lbIcon}>📊</Text>
            <Text style={styles.lbText}>Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statsBtn}
            onPress={() => navigation.navigate('Achievements')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open achievements"
            accessibilityHint="View unlocked and locked achievements"
          >
            <Text style={styles.statsIcon}>🏅</Text>
            <Text style={styles.statsText}>Achievements</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          accessibilityHint="Manage app preferences"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Shop')}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open coin shop"
          accessibilityHint="Purchase additional wisdom coins"
        >
          <Text style={styles.settingsIcon}>🛍️</Text>
          <Text style={styles.settingsText}>Shop</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.footLine} />
          <Text style={styles.footIcon}>🕊️</Text>
          <View style={styles.footLine} />
        </View>
      </ScrollView>

      {/* Daily Reward Modal */}
      <Modal
        visible={showRewardModal}
        transparent
        animationType="fade"
        accessibilityViewIsModal
        onRequestClose={() => setShowRewardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} accessible accessibilityLabel={`Daily reward received. ${rewardAmount} wisdom added.`}>
            <Text style={styles.modalEmoji} accessible={false}>🎁</Text>
            <Text style={styles.modalTitle}>Blessing Received!</Text>
            <Text style={styles.modalSub}>Your wisdom has increased. Use it wisely!</Text>

            <View style={styles.rewardPill}>
              <Text style={styles.rewardText}>+{rewardAmount} Wisdom</Text>
              <Text style={styles.coinIcon}>✨</Text>
            </View>

            <TouchableOpacity
              style={styles.claimBtn}
              onPress={() => setShowRewardModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Close reward dialog"
              accessibilityHint="Closes the daily reward popup"
            >
              <Text style={styles.claimBtnText}>Amen!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: { alignItems: 'center', paddingTop: 20, marginBottom: 24 },
  topRow: { position: 'absolute', top: 0, right: 0 },
  currencyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.cardBorder },
  coinIcon: { fontSize: 14, marginRight: 4 },
  coinText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  crossWrap: {
    position: 'absolute', top: -20, alignSelf: 'center',
    width: 32, height: 40, alignItems: 'center', justifyContent: 'center',
  },
  crossV: { position: 'absolute', width: 3, height: 40, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.35 },
  crossH: { position: 'absolute', width: 32, height: 3, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.35, top: 10 },
  eyebrow: { fontSize: 11, letterSpacing: 4, color: colors.primary, textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 46, fontWeight: '700', color: colors.text, letterSpacing: 1, marginBottom: 8 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.cardBorder },
  streakIcon: { fontSize: 14, marginRight: 6 },
  streakText: { fontSize: 13, color: colors.warning, fontWeight: '600' },
  dailyVerse: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  verseIcon: { fontSize: 18, marginBottom: 8 },
  verseText: { fontSize: 14, color: colors.text, fontStyle: 'italic', textAlign: 'center', lineHeight: 22 },
  verseRef: { fontSize: 12, color: colors.primary, marginTop: 10, fontWeight: '500' },
  snapshotCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  snapshotTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 12 },
  snapshotRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  snapshotMetric: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  snapshotValue: { color: colors.primary, fontSize: 18, fontWeight: '700' },
  snapshotLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  snapshotSubtext: { color: colors.textSecondary, fontSize: 12 },

  // Ad Button Styles
  adButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '10', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.primary + '30' },
  adButtonIcon: { fontSize: 24, marginRight: 16 },
  adButtonTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  adButtonSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divIcon: { color: colors.primary, fontSize: 11, marginHorizontal: 10 },
  chooseLabel: { fontSize: 10, letterSpacing: 3, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 14, alignSelf: 'flex-start' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', backgroundColor: colors.card,
    borderWidth: 1, borderRadius: 14,
    paddingVertical: 18, paddingHorizontal: 20, marginBottom: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 16 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 17, fontWeight: '600', marginBottom: 3 },
  cardSub: { fontSize: 12, color: colors.textMuted },
  arrow: { fontSize: 26, fontWeight: '200', lineHeight: 28 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12 },
  lbBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, backgroundColor: colors.card },
  lbIcon: { fontSize: 16, marginRight: 8 },
  lbText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  statsBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, backgroundColor: colors.card },
  statsIcon: { fontSize: 16, marginRight: 8 },
  statsText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  settingsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, backgroundColor: colors.card },
  settingsIcon: { fontSize: 16, marginRight: 8 },
  settingsText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  footLine: { flex: 1, height: 1, backgroundColor: colors.border },
  footIcon: { fontSize: 16, marginHorizontal: 12 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.8, backgroundColor: colors.background, borderRadius: 24, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '30' },
  modalEmoji: { fontSize: 50, marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  modalSub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  rewardPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '15', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, marginBottom: 24 },
  rewardText: { fontSize: 18, fontWeight: '700', color: colors.primary, marginRight: 6 },
  claimBtn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14, width: '100%', alignItems: 'center' },
  claimBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
