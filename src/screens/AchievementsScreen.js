import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { ACHIEVEMENTS } from '../data/achievements';
import useReducedMotion from '../hooks/useReducedMotion';

export default function AchievementsScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress: userProgress } = useProgress();
  const reducedMotion = useReducedMotion();
  const [unlocked, setUnlocked] = useState(userProgress.unlockedAchievements || []);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(ACHIEVEMENTS.map(() => new Animated.Value(0))).current;

  const styles = createStyles(colors);

  const getAchievementProgress = (achievement) => {
    // This is now handled by the achievement.check function,
    // but for UI progress bars we can approximate.
    if (achievement.id.startsWith('first_steps')) return Math.min(userProgress.totalCorrect / 1, 1);
    if (achievement.id.startsWith('bible_student')) return Math.min(userProgress.totalCorrect / 50, 1);
    if (achievement.id.startsWith('bible_scholar')) return Math.min(userProgress.totalCorrect / 250, 1);
    if (achievement.id.startsWith('streak_7')) return Math.min(userProgress.currentStreak / 7, 1);
    if (achievement.id.startsWith('streak_30')) return Math.min(userProgress.currentStreak / 30, 1);
    if (achievement.id.startsWith('perfect_10')) return Math.min(userProgress.perfectScores / 10, 1);
    if (achievement.id.startsWith('era_master')) return Math.min(userProgress.unlockedEras.length / 2, 1);
    if (achievement.id.startsWith('collector')) return Math.min(userProgress.unlockedCharacters.length / 5, 1);
    return 0;
  };

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    if (reducedMotion) {
      progressAnim.setValue(progressPct / 100);
      return;
    }

    Animated.timing(progressAnim, {
      toValue: progressPct / 100,
      duration: 520,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, progressPct, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      cardAnims.forEach((anim) => anim.setValue(1));
      return;
    }

    cardAnims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      35,
      cardAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [cardAnims, reducedMotion, unlockedCount]);


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
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressPct}>{progressPct}% Complete</Text>
        </View>

        <Text style={styles.sectionTitle}>All Achievements</Text>

        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = unlocked.includes(achievement.id);
          const progress = getAchievementProgress(achievement);
          const cardAnim = cardAnims[index];

          return (
            <Animated.View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !isUnlocked && styles.lockedCard,
                {
                  opacity: cardAnim,
                  transform: [{
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, 0],
                    }),
                  }],
                },
              ]}
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
                <Text style={[styles.rewardText, { color: colors.warning }]}>
                  🎁 {achievement.reward} coins
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
            </Animated.View>
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
    position: 'relative', overflow: 'hidden',
  },
  newBadgeGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 12,
    backgroundColor: colors.primary + '40',
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
  rewardText: { fontSize: 11, fontWeight: '700', marginTop: 4 },
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
