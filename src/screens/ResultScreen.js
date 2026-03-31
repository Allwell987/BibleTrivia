import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated, Dimensions,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveScore } from '../utils/storage';
import { shareResults } from '../utils/share';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

const { width } = Dimensions.get('window');

function getGrade(score, total, colors) {
  const pct = score / total;
  if (pct === 1) return { label: 'Perfect!', emoji: '🏆', color: colors.primary };
  if (pct >= 0.8) return { label: 'Excellent!', emoji: '⭐', color: colors.success };
  if (pct >= 0.6) return { label: 'Well done!', emoji: '👍', color: colors.success };
  if (pct >= 0.4) return { label: 'Keep studying', emoji: '📖', color: colors.warning };
  return { label: 'Keep reading', emoji: '🙏', color: colors.error };
}

export default function ResultScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { score, total, difficulty, wrong, totalTime = 0 } = route.params;
  const { updateProgress, getDifficultyInfo, isUnlocked } = useProgress();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUnlock, setNewUnlock] = useState(null);
  const [savedRank, setSavedRank] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const grade = getGrade(score, total, colors);
  const pct = Math.round((score / total) * 100);
  const nextDifficulty =
    difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : null;
  const nextDifficultyInfo = nextDifficulty ? getDifficultyInfo(nextDifficulty) : null;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const wasUnlocked = nextDifficulty ? isUnlocked(nextDifficulty) : true;

    const unlockedDifficulties = await updateProgress(difficulty, score, total);

    const isUnlockedNow = nextDifficulty
      ? unlockedDifficulties.includes(nextDifficulty)
      : true;

    if (nextDifficulty && !wasUnlocked && isUnlockedNow) {
      setNewUnlock(nextDifficulty);
    }
    
    const { rank } = await saveScore({
      name: name.trim(),
      score, total, difficulty,
      timeLeft: totalTime,
      date: new Date().toLocaleDateString(),
    });
    setSaving(false);
    setSavedRank(rank);
    setSaved(true);
  };

  const handleShare = async () => {
    await shareResults({
      score,
      total,
      difficulty,
      pct,
      playerName: name.trim() || 'Player',
    });
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.bubble, { transform: [{ scale: scaleAnim }], borderColor: grade.color }]}>
            <Text style={styles.bubbleEmoji}>{grade.emoji}</Text>
            <Text style={[styles.bubblePct, { color: grade.color }]}>{pct}%</Text>
            <Text style={styles.bubbleRaw}>{score} / {total} correct</Text>
          </Animated.View>

          <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
            <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
            <Text style={styles.diffLabel}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty
              {totalTime > 0 ? ` · ${totalTime}s used` : ''}
            </Text>

            {newUnlock && (
              <View style={styles.newUnlockBanner}>
                <Text style={styles.newUnlockText}>🔓 New Difficulty Unlocked: {newUnlock.charAt(0).toUpperCase() + newUnlock.slice(1)}!</Text>
              </View>
            )}

            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divIcon}>✦</Text>
              <View style={styles.divLine} />
            </View>

            {!saved ? (
              <View style={styles.saveBox}>
                <Text style={styles.saveTitle}>Save to Leaderboard</Text>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  maxLength={20}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  accessibilityLabel="Player name"
                  accessibilityHint="Enter your name to save this score"
                />
                <TouchableOpacity
                  style={[styles.saveBtn, { borderColor: grade.color, opacity: name.trim() ? 1 : 0.4 }]}
                  onPress={handleSave}
                  disabled={saving || !name.trim()}
                  accessibilityRole="button"
                  accessibilityLabel="Save score"
                  accessibilityHint="Saves this score to the leaderboard"
                  accessibilityState={{ disabled: saving || !name.trim() }}
                >
                  <Text style={[styles.saveBtnText, { color: grade.color }]}>
                    {saving ? 'Saving...' : 'Save Score 🏆'}
                  </Text>
                </TouchableOpacity>

                {nextDifficultyInfo && !nextDifficultyInfo.unlocked && (
                  <View style={styles.unlockBox}>
                    <Text style={styles.unlockTitle}>
                      🔓 Unlock {nextDifficulty.charAt(0).toUpperCase() + nextDifficulty.slice(1)} Mode
                    </Text>
                    <Text style={styles.unlockDesc}>{nextDifficultyInfo.description}</Text>
                    <View style={styles.unlockProgress}>
                      <View style={styles.unlockBar}>
                        <View
                          style={[styles.unlockFill, { width: `${nextDifficultyInfo.progress * 100}%` }]}
                        />
                      </View>
                      <Text style={styles.unlockPct}>{nextDifficultyInfo.currentProgress}%</Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.savedBox, { borderColor: grade.color }]}>
                <Text style={[styles.savedText, { color: grade.color }]}>
                  {savedRank === 1
                    ? '🥇 New Best on ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + '!'
                    : savedRank
                      ? `✓ Ranked #${savedRank} on ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}!`
                      : '✓ Score saved!'}
                </Text>
                <View style={styles.savedActions}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Leaderboard')}
                    accessibilityRole="button"
                    accessibilityLabel="Open leaderboard"
                    accessibilityHint="View saved leaderboard scores"
                  >
                    <Text style={styles.viewLbText}>Leaderboard →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleShare}
                    style={styles.shareBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Share results"
                    accessibilityHint="Share your quiz score"
                  >
                    <Text style={styles.shareText}>Share 📤</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divIcon}>✦</Text>
              <View style={styles.divLine} />
            </View>

            {wrong.length === 0 && (
              <View style={styles.perfectBox}>
                <Text style={styles.perfectTitle}>Flawless! Every answer correct.</Text>
                <Text style={styles.perfectVerse}>"I have hidden your word in my heart"</Text>
                <Text style={styles.perfectRef}>— Psalm 119:11</Text>
              </View>
            )}

            {wrong.length > 0 && (
              <View style={styles.reviewSection}>
                <Text style={styles.reviewHeading}>Review These Questions</Text>
                {wrong.map((q, i) => (
                  <View key={i} style={styles.reviewCard}>
                    <Text style={styles.reviewQ}>{q.question}</Text>
                    <Text style={styles.reviewA}>✓ {q.answer}</Text>
                    {q.explanation && <Text style={styles.reviewExp}>{q.explanation}</Text>}
                    <Text style={styles.reviewRef}>📜 {q.reference}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.btnPrimary, { borderColor: grade.color }]}
              onPress={() => navigation.replace('Quiz', { difficulty, seconds: route.params.seconds })}
              accessibilityRole="button"
              accessibilityLabel="Play again"
              accessibilityHint="Starts a new quiz with the same difficulty"
            >
              <Text style={[styles.btnPrimaryText, { color: grade.color }]}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate('Home')}
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              accessibilityHint="Returns to home screen"
            >
              <Text style={styles.btnSecondaryText}>Back to Home</Text>
            </TouchableOpacity>

            <Text style={styles.bless}>God bless you! 🙏</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', paddingTop: 40, paddingBottom: 60, paddingHorizontal: 24 },
  bubble: {
    width: 164, height: 164, borderRadius: 82, borderWidth: 2,
    backgroundColor: colors.card, alignItems: 'center',
    justifyContent: 'center', marginBottom: 28,
  },
  bubbleEmoji: { fontSize: 30, marginBottom: 4 },
  bubblePct: { fontSize: 34, fontWeight: '700' },
  bubbleRaw: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  body: { alignItems: 'center', width: '100%' },
  gradeLabel: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  diffLabel: { fontSize: 11, color: colors.textSecondary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28 },
  newUnlockBanner: { backgroundColor: colors.success + '20', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.success, marginBottom: 20, width: '100%', alignItems: 'center' },
  newUnlockText: { color: colors.success, fontWeight: '600', fontSize: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', width: '75%', marginBottom: 24 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divIcon: { color: colors.primary, fontSize: 11, marginHorizontal: 10 },
  saveBox: {
    width: '100%', backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 14,
    padding: 20, marginBottom: 24, alignItems: 'center',
  },
  saveTitle: { color: colors.primary, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 },
  nameInput: {
    width: '100%', backgroundColor: colors.background, borderWidth: 1,
    borderColor: colors.cardBorder, borderRadius: 10, paddingVertical: 12,
    paddingHorizontal: 16, color: colors.text, fontSize: 15, marginBottom: 12,
  },
  saveBtn: {
    width: '100%', borderWidth: 1, borderRadius: 10,
    paddingVertical: 13, alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '600' },
  unlockBox: {
    width: '100%', backgroundColor: colors.primary + '15', borderRadius: 10,
    padding: 14, marginTop: 16, borderWidth: 1, borderColor: colors.primary + '30',
  },
  unlockTitle: { fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  unlockDesc: { fontSize: 11, color: colors.textSecondary, marginBottom: 10 },
  unlockProgress: { flexDirection: 'row', alignItems: 'center' },
  unlockBar: { flex: 1, height: 6, backgroundColor: colors.dim, borderRadius: 3, overflow: 'hidden', marginRight: 8 },
  unlockFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  unlockPct: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  savedBox: {
    width: '100%', borderWidth: 1, borderRadius: 14,
    padding: 18, marginBottom: 24, alignItems: 'center', backgroundColor: colors.card,
  },
  savedText: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  savedActions: { flexDirection: 'row', gap: 20 },
  viewLbText: { color: colors.primary, fontSize: 13 },
  shareBtn: { paddingHorizontal: 12, paddingVertical: 2 },
  shareText: { color: colors.primary, fontSize: 13 },
  perfectBox: {
    width: '100%', backgroundColor: colors.card, borderWidth: 1,
    borderColor: colors.primary, borderRadius: 14, padding: 24,
    alignItems: 'center', marginBottom: 24,
  },
  perfectTitle: { color: colors.primary, fontSize: 15, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  perfectVerse: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
  perfectRef: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  reviewSection: { width: '100%', marginBottom: 24 },
  reviewHeading: {
    fontSize: 10, letterSpacing: 3, color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: 14, textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: colors.card, borderWidth: 1,
    borderColor: colors.cardBorder, borderRadius: 12,
    padding: 16, marginBottom: 10,
  },
  reviewQ: { color: colors.text, fontSize: 14, marginBottom: 8, lineHeight: 20 },
  reviewA: { color: colors.success, fontSize: 13, fontWeight: '600', marginBottom: 4 },
  reviewExp: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 6 },
  reviewRef: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic' },
  btnPrimary: {
    width: width - 48, borderWidth: 1, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    marginBottom: 12, backgroundColor: colors.card,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '600' },
  btnSecondary: {
    width: width - 48, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginBottom: 32,
  },
  btnSecondaryText: { color: colors.textSecondary, fontSize: 15 },
  bless: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },
});
