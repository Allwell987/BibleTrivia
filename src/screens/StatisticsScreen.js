import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { loadStats, loadStreak } from '../utils/storage';
import { trackEvent } from '../utils/analytics';

export default function StatisticsScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    Promise.all([loadStats(), loadStreak()]).then(([s, st]) => {
      setStats(s);
      setStreak(st);
    });
  }, []);

  const styles = createStyles(colors);

  const getAccuracy = (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const getOverallAccuracy = () => {
    if (!stats || stats.totalQuestions === 0) return 0;
    return getAccuracy(stats.totalCorrect, stats.totalQuestions);
  };

  const getDifficultyBreakdown = () => {
    const data = [
      {
        key: 'easy',
        label: 'Easy',
        color: '#4CAF82',
        total: stats.easyTotal,
        accuracy: getAccuracy(stats.easyCorrect, stats.easyTotal),
      },
      {
        key: 'medium',
        label: 'Medium',
        color: '#E6A817',
        total: stats.mediumTotal,
        accuracy: getAccuracy(stats.mediumCorrect, stats.mediumTotal),
      },
      {
        key: 'hard',
        label: 'Hard',
        color: '#D95F4B',
        total: stats.hardTotal,
        accuracy: getAccuracy(stats.hardCorrect, stats.hardTotal),
      },
    ];
    return data;
  };

  const getConsistency = () => {
    if (!streak.longestStreak) return 0;
    return Math.round((streak.currentStreak / streak.longestStreak) * 100);
  };

  const StatCard = ({ label, value, icon, color }) => (
    <View style={[styles.statCard, { borderColor: color || colors.border }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: color || colors.text }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const DifficultyBar = ({ label, correct, total, color }) => {
    const pct = getAccuracy(correct, total);
    return (
      <View style={styles.diffBar}>
        <View style={styles.diffHeader}>
          <Text style={styles.diffLabel}>{label}</Text>
          <Text style={styles.diffPct}>{pct}%</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.diffSub}>{correct}/{total} correct</Text>
      </View>
    );
  };

  if (!stats || !streak) return null;

  const diffBreakdown = getDifficultyBreakdown();
  const totalDifficultyQuestions = diffBreakdown.reduce((sum, d) => sum + d.total, 0);
  const bestDifficulty = [...diffBreakdown].sort((a, b) => b.accuracy - a.accuracy)[0];
  const needsWorkDifficulty = [...diffBreakdown].sort((a, b) => a.accuracy - b.accuracy)[0];
  const consistency = getConsistency();

  useEffect(() => {
    trackEvent('statistics_viewed', {
      total_quizzes: stats.totalQuizzes,
      total_questions: stats.totalQuestions,
      overall_accuracy: getOverallAccuracy(),
      current_streak: streak.currentStreak,
      longest_streak: streak.longestStreak,
      strongest_difficulty: bestDifficulty.label.toLowerCase(),
      needs_practice_difficulty: needsWorkDifficulty.label.toLowerCase(),
    });
  }, [stats, streak]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.streakSection}>
          <View style={styles.streakCard}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakValue}>{streak.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.streakCard}>
            <Text style={styles.streakIcon}>⭐</Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakValue}>{streak.longestStreak}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.momentumBox}>
          <View style={styles.momentumHeader}>
            <Text style={styles.momentumTitle}>Streak Momentum</Text>
            <Text style={styles.momentumPct}>{consistency}%</Text>
          </View>
          <View style={styles.momentumTrack}>
            <View style={[styles.momentumFill, { width: `${consistency}%` }]} />
          </View>
          <Text style={styles.momentumSubtext}>Current streak vs your personal best</Text>
        </View>

        <Text style={styles.sectionTitle}>Overall Performance</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Quizzes" value={stats.totalQuizzes} icon="📝" />
          <StatCard label="Accuracy" value={`${getOverallAccuracy()}%`} icon="🎯" color={colors.success} />
          <StatCard label="Perfect Scores" value={stats.perfectScores} icon="💯" color={colors.primary} />
          <StatCard label="Best Category" value={stats.favoriteDifficulty || '—'} icon="📖" />
        </View>

        <Text style={styles.sectionTitle}>By Difficulty</Text>
        <View style={styles.diffSection}>
          <DifficultyBar label="Easy" correct={stats.easyCorrect} total={stats.easyTotal} color="#4CAF82" />
          <DifficultyBar label="Medium" correct={stats.mediumCorrect} total={stats.mediumTotal} color="#E6A817" />
          <DifficultyBar label="Hard" correct={stats.hardCorrect} total={stats.hardTotal} color="#D95F4B" />
        </View>

        <Text style={styles.sectionTitle}>Difficulty Mix</Text>
        <View style={styles.mixBox}>
          <View style={styles.mixTrack}>
            {diffBreakdown.map((item) => {
              const widthPct = totalDifficultyQuestions > 0
                ? Math.round((item.total / totalDifficultyQuestions) * 100)
                : 0;

              return (
                <View
                  key={item.key}
                  style={[
                    styles.mixSegment,
                    { width: `${widthPct}%`, backgroundColor: item.color },
                  ]}
                />
              );
            })}
          </View>

          {diffBreakdown.map((item) => (
            <View key={item.key} style={styles.mixLegendRow}>
              <View style={[styles.mixDot, { backgroundColor: item.color }]} />
              <Text style={styles.mixLabel}>{item.label}</Text>
              <Text style={styles.mixMeta}>{item.total} questions</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Strongest Difficulty</Text>
            <Text style={styles.summaryValue}>{bestDifficulty.label} ({bestDifficulty.accuracy}%)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Needs More Practice</Text>
            <Text style={styles.summaryValue}>{needsWorkDifficulty.label} ({needsWorkDifficulty.accuracy}%)</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Questions</Text>
            <Text style={styles.summaryValue}>{stats.totalQuestions}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Correct</Text>
            <Text style={styles.summaryValue}>{stats.totalCorrect}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Last Played</Text>
            <Text style={styles.summaryValue}>
              {stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString() : 'Never'}
            </Text>
          </View>
        </View>
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
  streakSection: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  streakCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.cardBorder,
  },
  streakIcon: { fontSize: 28, marginRight: 12 },
  streakInfo: {},
  streakValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  streakLabel: { fontSize: 11, color: colors.textSecondary },
  momentumBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 28,
  },
  momentumHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  momentumTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
  momentumPct: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  momentumTrack: { height: 10, backgroundColor: colors.dim, borderRadius: 5, overflow: 'hidden' },
  momentumFill: { height: 10, backgroundColor: colors.primary, borderRadius: 5 },
  momentumSubtext: { color: colors.textSecondary, fontSize: 11, marginTop: 6 },
  sectionTitle: {
    fontSize: 12, letterSpacing: 2, color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: 14,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: {
    width: '47%', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 14, padding: 18, borderWidth: 1,
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  diffSection: { backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: colors.cardBorder },
  diffBar: { marginBottom: 16 },
  diffHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  diffLabel: { fontSize: 14, fontWeight: '500', color: colors.text },
  diffPct: { fontSize: 14, fontWeight: '600', color: colors.text },
  barTrack: { height: 8, backgroundColor: colors.dim, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  diffSub: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  mixBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  mixTrack: {
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: colors.dim,
    flexDirection: 'row',
    marginBottom: 12,
  },
  mixSegment: { height: 14 },
  mixLegendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  mixDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  mixLabel: { color: colors.text, fontSize: 13, flex: 1 },
  mixMeta: { color: colors.textSecondary, fontSize: 12 },
  summaryBox: { backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 40, borderWidth: 1, borderColor: colors.cardBorder },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
});
