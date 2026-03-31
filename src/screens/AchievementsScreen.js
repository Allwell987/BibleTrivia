import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { loadAchievements, loadStats, loadStreak } from '../utils/storage';
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements';

export default function AchievementsScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [unlocked, setUnlocked] = useState([]);
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [recentUnlock, setRecentUnlock] = useState(null);

  useEffect(() => {
    Promise.all([loadAchievements(), loadStats(), loadStreak()]).then(([a, s, st]) => {
      setUnlocked(a);
      setStats(s);
      setStreak(st);
    });
  }, []);

  useEffect(() => {
    if (stats && streak) {
      const { newlyUnlocked } = checkAchievements(stats, streak, unlocked);
      if (newlyUnlocked.length > 0) {
        setRecentUnlock(newlyUnlocked[0]);
        setUnlocked(prev => [...prev, ...newlyUnlocked]);
      }
    }
  }, [stats, streak]);

  const styles = createStyles(colors);

  const getAchievementProgress = (achievement) => {
    if (!stats) return 0;
    const { requirement } = achievement;
    
    switch (requirement.type) {
      case 'quizzes':
        return Math.min(stats.totalQuizzes / requirement.count, 1);
      case 'perfect':
        return Math.min(stats.perfectScores / requirement.count, 1);
      case 'streak':
        return Math.min(streak?.currentStreak / requirement.count || 0, 1);
      case 'correct_answers':
        return Math.min(stats.totalCorrect / requirement.count, 1);
      default:
        return 0;
    }
  };

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressCount}>{unlockedCount}/{totalCount}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressPct}>{progressPct}% Complete</Text>
        </View>

        {recentUnlock && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeIcon}>🎉</Text>
            <View style={styles.newBadgeText}>
              <Text style={styles.newBadgeTitle}>New Achievement!</Text>
              <Text style={styles.newBadgeDesc}>
                {ACHIEVEMENTS.find(a => a.id === recentUnlock)?.title}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>All Achievements</Text>

        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id);
          const progress = getAchievementProgress(achievement);

          return (
            <View
              key={achievement.id}
              style={[styles.achievementCard, !isUnlocked && styles.lockedCard]}
            >
              <View style={[styles.iconWrap, !isUnlocked && styles.lockedIcon]}>
                <Text style={styles.icon}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, !isUnlocked && styles.lockedText]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDesc, !isUnlocked && styles.lockedSubtext]}>
                  {achievement.description}
                </Text>
                {!isUnlocked && progress > 0 && (
                  <View style={styles.progressRow}>
                    <View style={styles.miniBar}>
                      <View style={[styles.miniFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.miniPct}>{Math.round(progress * 100)}%</Text>
                  </View>
                )}
              </View>
              {isUnlocked && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footer} />
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
  progressCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: colors.cardBorder,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  progressCount: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  progressBar: { height: 10, backgroundColor: colors.dim, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 10, backgroundColor: colors.primary, borderRadius: 5 },
  progressPct: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  newBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '20',
    borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: colors.primary,
  },
  newBadgeIcon: { fontSize: 24, marginRight: 12 },
  newBadgeText: { flex: 1 },
  newBadgeTitle: { fontSize: 13, fontWeight: '700', color: colors.primary, marginBottom: 2 },
  newBadgeDesc: { fontSize: 12, color: colors.text },
  sectionTitle: {
    fontSize: 12, letterSpacing: 2, color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: 14,
  },
  achievementCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder,
  },
  lockedCard: { opacity: 0.6 },
  iconWrap: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary + '20',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  lockedIcon: { backgroundColor: colors.dim },
  icon: { fontSize: 24 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2 },
  lockedText: { color: colors.textSecondary },
  achievementDesc: { fontSize: 12, color: colors.textSecondary },
  lockedSubtext: { color: colors.textMuted },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  miniBar: { flex: 1, height: 4, backgroundColor: colors.dim, borderRadius: 2, overflow: 'hidden', marginRight: 8 },
  miniFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  miniPct: { fontSize: 10, color: colors.textMuted },
  checkmark: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  footer: { height: 40 },
});
