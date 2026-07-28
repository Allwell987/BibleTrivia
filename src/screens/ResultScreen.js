import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated,
  TextInput, KeyboardAvoidingView, Platform, Alert, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveScore } from '../utils/storage';
import { shareResults } from '../utils/share';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { showRewardedAd, isAdsAvailable } from '../utils/ads';
import { trackEvent } from '../utils/analytics';
import useReducedMotion from '../hooks/useReducedMotion';

function getGrade(score, total, colors) {
  if (total === 0) return { label: 'Keep reading', emoji: '🙏', color: '#E57373', bgColor: '#E5737320' };
  const pct = score / total;
  if (pct === 1) return { label: 'Perfect!', emoji: '🏆', color: '#FFD700', bgColor: '#FFD70020' };
  if (pct >= 0.8) return { label: 'Excellent!', emoji: '⭐', color: '#4CAF50', bgColor: '#4CAF5020' };
  if (pct >= 0.6) return { label: 'Well done!', emoji: '👍', color: '#81C784', bgColor: '#81C78420' };
  if (pct >= 0.4) return { label: 'Keep studying', emoji: '📖', color: '#FFB74D', bgColor: '#FFB74D20' };
  return { label: 'Keep reading', emoji: '🙏', color: '#E57373', bgColor: '#E5737320' };
}

export default function ResultScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { user } = useAuth();
  const reducedMotion = useReducedMotion();
  const {
    score = 0,
    total = 0,
    difficulty = 'medium',
    wrong = [],
    totalTime = 0,
    isDaily = false,
    era = null,
    reflectionPrompt = 'How can you apply this truth today?',
    didYouKnow = null,
    // Preserved params for Play Again
    seconds = 15,
    category = 'all',
    questionCount = null,
    timerEnabled = true,
    hintsEnabled = true,
  } = route.params || {};

  const { getDifficultyInfo, saveReflection, progress, addCoins } = useProgress();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedRank, setSavedRank] = useState(null);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [bonusCoins, setBonusCoins] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pctAnim = useRef(new Animated.Value(0)).current;
  const savePanelAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const rewardFlyAnim = useRef(new Animated.Value(0)).current;

  const grade = getGrade(score, total, colors);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const nextDifficulty =
    difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : difficulty === 'hard' ? 'expert' : null;
  const nextDifficultyInfo = nextDifficulty ? getDifficultyInfo(nextDifficulty) : null;

  useEffect(() => {
    if (reducedMotion) {
      scaleAnim.setValue(1);
      fadeAnim.setValue(1);
      pctAnim.setValue(pct);
      savePanelAnim.setValue(1);
      setDisplayPct(pct);
      return undefined;
    }

    const listenerId = pctAnim.addListener(({ value }) => setDisplayPct(Math.round(value)));

    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 68, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 560, useNativeDriver: true }),
      Animated.timing(pctAnim, { toValue: pct, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
    Animated.timing(savePanelAnim, {
      toValue: 1,
      delay: 180,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      pctAnim.removeListener(listenerId);
    };
  }, [fadeAnim, pct, pctAnim, reducedMotion, savePanelAnim, scaleAnim]);

  useEffect(() => {
    if (!nextDifficultyInfo?.unlocked || reducedMotion) return undefined;

    shimmerAnim.setValue(-1);
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, [nextDifficultyInfo?.unlocked, reducedMotion, shimmerAnim]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    try {
      const { rank } = await saveScore({
        name: name.trim(),
        score, total, difficulty,
        timeLeft: totalTime,
        date: new Date().toLocaleDateString(),
        userId: user?.uid,
      });
      setSavedRank(rank);
      setSaved(true);
    } catch (e) {
      console.warn('Failed to save score:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReflection = async () => {
    if (!isDaily || !reflectionText.trim() || reflectionSaved) return;
    await saveReflection({
      prompt: reflectionPrompt,
      text: reflectionText.trim(),
      score,
      total,
    });
    setReflectionSaved(true);
    Alert.alert('Reflection saved', 'Great work. Come back tomorrow and keep your streak going.');
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await shareResults({
        score,
        total,
        difficulty,
        pct,
        playerName: name.trim() || 'Player',
        didYouKnowFact: didYouKnow?.fact,
      });
    } catch (e) {
      console.warn('Sharing failed:', e);
    } finally {
      setSharing(false);
    }
  };

  const handlePlayAgain = () => {
    navigation.replace('Quiz', {
      difficulty,
      seconds,
      category,
      isDaily,
      era,
      questionCount,
      timerEnabled,
      hintsEnabled
    });
  };

  const handleDoubleReward = () => {
    if (!isAdsAvailable || rewardClaimed) return;

    setAdLoading(true);
    const cleanup = showRewardedAd(async (success) => {
      setAdLoading(false);
      cleanup();

      if (success) {
        // Base reward for a quiz is usually 10 coins (set in updateProgress)
        // We give another 10-25 as a bonus for watching the ad
        const bonus = 25;
        if (typeof addCoins === 'function') {
          await addCoins(bonus);
        }
        setBonusCoins(bonus);
        setRewardClaimed(true);
        if (!reducedMotion) {
          rewardFlyAnim.setValue(0);
          Animated.timing(rewardFlyAnim, {
            toValue: 1,
            duration: 760,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
        trackEvent('double_reward_ad', { bonus_amount: bonus });
        Alert.alert('Bonus Earned! 🪙', `You've received an extra ${bonus} coins!`);
      }
    });
  };

  const styles = createStyles(colors, grade);

  return (
    <SafeAreaView style={styles.container}>
      {/* Wisdom Balance Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.currencyBadge}
          onPress={() => navigation.navigate('Shop')}
          activeOpacity={0.7}
        >
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinText}>{progress?.coins || 0}</Text>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>
      {rewardClaimed && !reducedMotion && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.coinFlyBadge,
            {
              opacity: rewardFlyAnim.interpolate({
                inputRange: [0, 0.75, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateY: rewardFlyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -190],
                  }),
                },
                {
                  translateX: rewardFlyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
                {
                  scale: rewardFlyAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.92, 1.03, 0.88],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.coinFlyText}>+{bonusCoins} 🪙</Text>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.bubble, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.bubbleEmoji}>{grade.emoji}</Text>
            <Text style={styles.bubblePct}>{displayPct}%</Text>
            <Text style={styles.bubbleRaw}>{score} / {total} correct</Text>
          </Animated.View>

          {!progress?.isPro && isAdsAvailable && score > 0 && !rewardClaimed && (
            <TouchableOpacity
              style={styles.doubleRewardBtn}
              onPress={handleDoubleReward}
              disabled={adLoading}
            >
              <Text style={styles.doubleRewardEmoji}>📺</Text>
              <Text style={styles.doubleRewardText}>
                {adLoading ? 'Loading Video...' : 'Watch to get +25 Bonus Coins'}
              </Text>
            </TouchableOpacity>
          )}

          {rewardClaimed && (
            <View style={[styles.rewardClaimedBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.rewardClaimedText, { color: colors.success }]}>
                ✓ +{bonusCoins} Bonus Coins Claimed
              </Text>
            </View>
          )}

          <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
            <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
            <Text style={styles.diffLabel}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty
              {totalTime > 0 ? ` · ${totalTime}s used` : ''}
            </Text>

            {nextDifficultyInfo?.unlocked && (
              <View style={[styles.newUnlockBanner, { backgroundColor: colors.success + '20' }]}>
                <Text style={styles.newUnlockText}>🔓 {nextDifficulty.charAt(0).toUpperCase() + nextDifficulty.slice(1)} Mode is unlocked!</Text>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.unlockShimmer,
                    {
                      transform: [
                        {
                          translateX: shimmerAnim.interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-260, 260],
                          }),
                        },
                        { rotate: '15deg' },
                      ],
                    },
                  ]}
                />
              </View>
            )}

            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divIcon}>✦</Text>
              <View style={styles.divLine} />
            </View>

            <Animated.View
              style={{
                width: '100%',
                opacity: savePanelAnim,
                transform: [{
                  translateY: savePanelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                }],
              }}
            >
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
                  onPress={handleSave}
                  disabled={saving || !name.trim()}
                  activeOpacity={0.8}
                  style={[styles.saveBtn, { backgroundColor: name.trim() ? grade.color : colors.card, borderColor: name.trim() ? grade.color : colors.border, borderWidth: 1 }]}
                >
                  <Text style={[styles.saveBtnText, { color: name.trim() ? '#FFF' : colors.textMuted }]}>
                    {saving ? 'Saving...' : 'Save to Leaderboard'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ghostShareBtn, { borderColor: colors.border }]}
                  onPress={handleShare}
                  disabled={sharing}
                >
                  <Text style={styles.ghostShareText}>{sharing ? 'Sharing...' : 'Share This Score'}</Text>
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
                      <Text style={styles.unlockPct}>{nextDifficultyInfo.progressLabel || `${nextDifficultyInfo.currentProgress}%`}</Text>
                    </View>
                  </View>
                )}
                </View>
              ) : (
                <View style={[styles.savedBox, { borderColor: grade.color, borderWidth: 1 }]}>
                  <Text style={[styles.savedText, { color: grade.color }]}>
                    {savedRank === 1
                      ? '🥇 New Best on ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + '!'
                      : savedRank
                        ? `✓ Ranked #${savedRank} on ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}!`
                        : '✓ Score saved!'}
                  </Text>
                  <View style={styles.savedActions}>
                    <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                      <Text style={styles.viewLbText}>Leaderboard →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                      <Text style={styles.shareText}>{sharing ? 'Sharing...' : 'Share Result'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Animated.View>

            {wrong.length === 0 && total > 0 && (
              <View style={[styles.perfectBox, { backgroundColor: '#FFD70015' }]}>
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

            {didYouKnow?.fact && (
              <View style={styles.didYouKnowCard}>
                <Text style={styles.didYouKnowTitle}>Did You Know?</Text>
                {didYouKnow.question ? <Text style={styles.didYouKnowQuestion}>{didYouKnow.question}</Text> : null}
                <Text style={styles.didYouKnowFact}>{didYouKnow.fact}</Text>
                {isDaily && didYouKnow.reflection ? (
                  <Text style={styles.didYouKnowReflection}>{didYouKnow.reflection}</Text>
                ) : null}
                {didYouKnow.reference ? <Text style={styles.didYouKnowRef}>- {didYouKnow.reference}</Text> : null}
              </View>
            )}

            {isDaily && (
              <View style={styles.saveBox}>
                <Text style={styles.saveTitle}>Daily Reflection</Text>
                <Text style={styles.unlockDesc}>{reflectionPrompt}</Text>
                <TextInput
                  style={[styles.nameInput, { minHeight: 100, textAlignVertical: 'top' }]}
                  placeholder="Write your reflection..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  maxLength={280}
                  value={reflectionText}
                  onChangeText={setReflectionText}
                  editable={!reflectionSaved}
                />
                <Text style={styles.reflectionHint}>{reflectionText.trim().length}/280 characters</Text>
                <TouchableOpacity
                  onPress={handleSaveReflection}
                  disabled={!reflectionText.trim() || reflectionSaved}
                  style={[styles.saveBtn, { width: '100%', backgroundColor: reflectionText.trim() && !reflectionSaved ? grade.color : colors.card, borderColor: colors.border, borderWidth: 1 }]}
                >
                  <Text style={[styles.saveBtnText, { color: reflectionText.trim() && !reflectionSaved ? '#FFF' : colors.textMuted }]}>
                    {reflectionSaved ? 'Reflection Saved' : 'Save Reflection Note'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={handlePlayAgain}
              activeOpacity={0.8}
              style={[styles.btnPrimary, { backgroundColor: grade.color }]}
            >
              <Text style={styles.btnPrimaryText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate('Home')}
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

const createStyles = (colors, grade) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  coinIcon: { fontSize: 16, marginRight: 6 },
  coinText: { fontSize: 14, fontWeight: '800', color: colors.warning },
  plusIcon: { fontSize: 12, marginLeft: 4, color: colors.primary, fontWeight: '900' },
  content: { alignItems: 'center', paddingTop: 10, paddingBottom: 60, paddingHorizontal: 24 },
  bubble: {
    width: 180, height: 180, borderRadius: 90,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
    backgroundColor: grade.color,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
  },
  bubbleEmoji: { fontSize: 36, marginBottom: 4 },
  bubblePct: { fontSize: 42, fontWeight: '900', color: '#FFF' },
  bubbleRaw: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginTop: 4 },
  doubleRewardBtn: {
    backgroundColor: '#FFD70020',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doubleRewardEmoji: { fontSize: 18, marginRight: 8 },
  doubleRewardText: { color: '#FFD700', fontWeight: '800', fontSize: 14 },
  rewardClaimedBadge: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  rewardClaimedText: { fontWeight: '700', fontSize: 14 },
  body: { alignItems: 'center', width: '100%' },
  gradeLabel: { fontSize: 32, fontWeight: '900', marginBottom: 6 },
  diffLabel: { fontSize: 12, color: colors.textSecondary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28, fontWeight: '700' },
  newUnlockBanner: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  newUnlockText: { color: colors.success, fontWeight: '800', fontSize: 15 },
  unlockShimmer: {
    position: 'absolute',
    top: -30,
    bottom: -30,
    width: 120,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  divider: { flexDirection: 'row', alignItems: 'center', width: '75%', marginBottom: 24 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divIcon: { color: colors.primary, fontSize: 14, marginHorizontal: 10 },
  saveBox: {
    width: '100%', backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, borderRadius: 20,
    padding: 24, marginBottom: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  saveTitle: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 },
  nameInput: {
    width: '100%', backgroundColor: colors.background, borderWidth: 1,
    borderColor: colors.border, borderRadius: 12, paddingVertical: 14,
    paddingHorizontal: 18, color: colors.text, fontSize: 16, marginBottom: 16,
  },
  saveBtn: {
    width: '100%', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '800' },
  ghostShareBtn: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  ghostShareText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  unlockBox: {
    width: '100%', backgroundColor: colors.primary + '10', borderRadius: 14,
    padding: 16, marginTop: 20, borderWidth: 1, borderColor: colors.primary + '20',
  },
  unlockTitle: { fontSize: 13, fontWeight: '800', color: colors.primary, marginBottom: 6 },
  unlockDesc: { fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 },
  unlockProgress: { flexDirection: 'row', alignItems: 'center' },
  unlockBar: { flex: 1, height: 8, backgroundColor: colors.dim, borderRadius: 4, overflow: 'hidden', marginRight: 10 },
  unlockFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  unlockPct: { fontSize: 12, color: colors.primary, fontWeight: '800' },
  savedBox: {
    width: '100%', borderRadius: 20, backgroundColor: colors.card,
    padding: 24, marginBottom: 24, alignItems: 'center',
  },
  savedText: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  savedActions: { flexDirection: 'row', gap: 24 },
  viewLbText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  shareBtn: { paddingHorizontal: 4 },
  shareText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  perfectBox: {
    width: '100%', borderRadius: 20, padding: 30,
    alignItems: 'center', marginBottom: 24,
  },
  perfectTitle: { color: colors.primary, fontSize: 18, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
  perfectVerse: { color: colors.textSecondary, fontSize: 15, fontStyle: 'italic', textAlign: 'center', fontWeight: '500' },
  perfectRef: { color: colors.textMuted, fontSize: 13, marginTop: 8, fontWeight: '600' },
  reviewSection: { width: '100%', marginBottom: 24 },
  reviewHeading: {
    fontSize: 11, letterSpacing: 2.5, color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: 16, textAlign: 'center', fontWeight: '800',
  },
  reviewCard: {
    backgroundColor: colors.card, borderWidth: 1,
    borderColor: colors.border, borderRadius: 16,
    padding: 20, marginBottom: 12,
  },
  didYouKnowCard: {
    width: '100%',
    backgroundColor: colors.primary + '08',
    borderColor: colors.primary + '30',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  didYouKnowTitle: {
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 10,
  },
  didYouKnowQuestion: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  didYouKnowFact: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  didYouKnowReflection: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  didYouKnowRef: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  reflectionHint: {
    width: '100%',
    textAlign: 'right',
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
  },
  reviewQ: { color: colors.text, fontSize: 15, marginBottom: 10, lineHeight: 22, fontWeight: '600' },
  reviewA: { color: colors.success, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  reviewExp: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 8 },
  reviewRef: { color: colors.textMuted, fontSize: 12, fontStyle: 'italic', fontWeight: '500' },
  btnPrimary: {
    width: '100%', borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  btnSecondary: {
    width: '100%', borderWidth: 1, borderColor: colors.border,
    borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', marginBottom: 32, backgroundColor: colors.card,
  },
  btnSecondaryText: { color: colors.textSecondary, fontSize: 16, fontWeight: '700' },
  bless: { color: colors.textMuted, fontSize: 14, fontStyle: 'italic', fontWeight: '500' },
  coinFlyBadge: {
    position: 'absolute',
    right: 28,
    top: 300,
    zIndex: 30,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  coinFlyText: {
    color: '#3D2B00',
    fontSize: 12,
    fontWeight: '900',
  },
});
