import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress, ERA_ORDER, ERA_REQUIREMENTS, MASTERY_TIERS } from '../context/ProgressContext';
import { ERAS } from '../data/questions';
import useReducedMotion from '../hooks/useReducedMotion';

const ERA_DETAILS = {
  creation: { icon: '🌍', description: 'The beginning of all things.', color: '#4CAF50' },
  patriarchs: { icon: '⛺', description: 'Abraham, Isaac, and Jacob.', color: '#FF9800' },
  exodus: { icon: '🌊', description: 'Freedom from slavery in Egypt.', color: '#2196F3' },
  wilderness: { icon: '🏜️', description: 'Forty years of wandering.', color: '#FBC02D' },
  conquest: { icon: '🎺', description: 'Entering the Promised Land.', color: '#CDDC39' },
  judges: { icon: '⚔️', description: 'Leaders of Israel before kings.', color: '#795548' },
  unitedKingdom: { icon: '👑', description: 'Saul, David, and Solomon.', color: '#FFC107' },
  wisdom: { icon: '📜', description: 'Psalms, Proverbs, and more.', color: '#009688' },
  dividedKingdom: { icon: '💔', description: 'Israel and Judah split.', color: '#F44336' },
  prophets: { icon: '📣', description: 'God\'s messengers to His people.', color: '#9C27B0' },
  exile: { icon: '🏺', description: 'Faithfulness in foreign lands.', color: '#607D8B' },
  return: { icon: '🧱', description: 'Rebuilding the walls and Temple.', color: '#8D6E63' },
  intertestamental: { icon: '⏳', description: '400 years of silence.', color: '#BDBDBD' },
  gospels: { icon: '✝️', description: 'The life and ministry of Jesus.', color: '#E91E63' },
  miracles: { icon: '✨', description: 'Signs and wonders of Jesus.', color: '#03A9F4' },
  parables: { icon: '🌱', description: 'Stories with eternal meaning.', color: '#8BC34A' },
  acts: { icon: '🕊️', description: 'The birth of the Church.', color: '#00BCD4' },
  missions: { icon: '⛵', description: 'Spreading the Word to nations.', color: '#673AB7' },
  letters: { icon: '📜', description: 'Wisdom for the first believers.', color: '#3F51B5' },
  revelation: { icon: '✨', description: 'The hope of things to come.', color: '#FFEB3B' },
};

export default function JourneyScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress } = useProgress();
  const reducedMotion = useReducedMotion();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lineDrawAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(ERA_ORDER.map(() => new Animated.Value(0))).current;
  const unlockPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      fadeAnim.setValue(1);
      lineDrawAnim.setValue(1);
      cardAnims.forEach((anim) => anim.setValue(1));
      unlockPulseAnim.setValue(1);
      return;
    }

    Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }).start();
    Animated.timing(lineDrawAnim, { toValue: 1, duration: 720, useNativeDriver: true }).start();
    Animated.stagger(
      40,
      cardAnims.map((anim) => Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }))
    ).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(unlockPulseAnim, { toValue: 1.03, duration: 760, useNativeDriver: true }),
        Animated.timing(unlockPulseAnim, { toValue: 1, duration: 760, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [cardAnims, fadeAnim, lineDrawAnim, reducedMotion, unlockPulseAnim]);

  const getMasteryInfo = (count) => {
    if (count >= MASTERY_TIERS.GOLD) return { label: 'Gold', color: '#FFD700', icon: '🏆', next: null };
    if (count >= MASTERY_TIERS.SILVER) return { label: 'Silver', color: '#C0C0C0', icon: '🥈', next: MASTERY_TIERS.GOLD };
    if (count >= MASTERY_TIERS.BRONZE) return { label: 'Bronze', color: '#CD7F32', icon: '🥉', next: MASTERY_TIERS.SILVER };
    return { label: 'Initiate', color: colors.textSecondary, icon: '📖', next: MASTERY_TIERS.BRONZE };
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biblical Journey</Text>
        <TouchableOpacity
          style={styles.coinBadge}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.coinText}>💰 {progress.coins}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.retentionBanner}>
            <Text style={styles.retentionTitle}>Deepen Your Knowledge ✨</Text>
            <Text style={styles.retentionSub}>Master all 16 eras from Creation to Revelation</Text>
          </View>

          <View style={styles.mapContainer}>
            {ERA_ORDER.map((eraKey, index) => {
              const isUnlocked = progress.unlockedEras.includes(eraKey);
              const eraProgress = progress.eraProgress[eraKey] || 0;
              const details = ERA_DETAILS[eraKey] || { icon: '📖', description: 'Exploring Scripture.', color: colors.primary };
              const isLast = index === ERA_ORDER.length - 1;
              const mastery = getMasteryInfo(eraProgress);
              const cardAnim = cardAnims[index];

              const nextThreshold = mastery.next;
              const progressToNext = nextThreshold ? Math.min(eraProgress / nextThreshold, 1) : 1;

              return (
                <Animated.View
                  key={eraKey}
                  style={[
                    styles.eraNodeWrapper,
                    {
                      opacity: cardAnim,
                      transform: [{
                        translateY: cardAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [24, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  {/* Connecting Line */}
                  {!isLast && (
                    <Animated.View
                      style={[
                        styles.line,
                        {
                          backgroundColor: isUnlocked && progress.unlockedEras.includes(ERA_ORDER[index + 1]) ? details.color : colors.border,
                          transform: [
                            {
                              scaleY: lineDrawAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.2, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  )}

                  <TouchableOpacity
                    style={[
                      styles.eraCard,
                      !isUnlocked && styles.eraCardLocked,
                      isUnlocked && { borderColor: details.color + '40' }
                    ]}
                    onPress={() => {
                      if (isUnlocked) {
                        navigation.navigate('Quiz', { difficulty: 'mixed', category: 'all', era: eraKey });
                      } else {
                        Alert.alert('Locked', `Achieve Bronze mastery in ${ERAS[ERA_ORDER[index-1]]} to unlock this era.`);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Animated.View style={[
                      styles.iconCircle,
                      !isUnlocked && styles.iconCircleLocked,
                      isUnlocked && { backgroundColor: details.color + '15', transform: [{ scale: unlockPulseAnim }] }
                    ]}>
                      <Text style={[styles.eraIcon, !isUnlocked && { opacity: 0.5 }]}>
                        {isUnlocked ? details.icon : '🔒'}
                      </Text>
                    </Animated.View>

                    <View style={styles.eraInfo}>
                      <View style={styles.eraTitleRow}>
                        <Text style={[
                          styles.eraName,
                          !isUnlocked && styles.eraNameLocked,
                          isUnlocked && { color: details.color }
                        ]}>
                          {ERAS[eraKey]}
                        </Text>
                        {isUnlocked && (
                          <Animated.View
                            style={[
                              styles.masteryBadge,
                              {
                                backgroundColor: mastery.color + '20',
                                transform: [{
                                  scale: cardAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.82, 1],
                                  }),
                                }],
                              },
                            ]}
                          >
                            <Text style={[styles.masteryText, { color: mastery.color }]}>{mastery.icon} {mastery.label}</Text>
                          </Animated.View>
                        )}
                      </View>
                      <Text style={styles.eraDesc} numberOfLines={1}>{details.description}</Text>

                      {isUnlocked && (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBarBg}>
                            <View style={[
                              styles.progressBarFill,
                              { width: `${progressToNext * 100}%`, backgroundColor: details.color }
                            ]} />
                          </View>
                          <Text style={styles.progressText}>
                            {eraProgress}{mastery.next ? `/${mastery.next}` : ' (MAX)'}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.arrow, { color: isUnlocked ? details.color : colors.textMuted }]}>›</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  coinBadge: { backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  coinText: { color: colors.warning, fontWeight: '800', fontSize: 13 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60 },
  retentionBanner: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 30, borderWidth: 1, borderColor: colors.primary + '30', alignItems: 'center' },
  retentionTitle: { color: colors.primary, fontWeight: '800', fontSize: 16, marginBottom: 4 },
  retentionSub: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', fontWeight: '600' },
  mapContainer: { alignItems: 'center' },
  eraNodeWrapper: { width: '100%', alignItems: 'center' },
  line: { width: 3, height: 50, position: 'absolute', bottom: -45, zIndex: -1, borderRadius: 1.5 },
  eraCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 45,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  eraCardLocked: { opacity: 0.7, backgroundColor: colors.dim, borderStyle: 'dashed' },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 18,
  },
  iconCircleLocked: { backgroundColor: colors.border },
  eraIcon: { fontSize: 30 },
  eraInfo: { flex: 1 },
  eraTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  eraName: { fontSize: 18, fontWeight: '800' },
  eraNameLocked: { color: colors.textMuted },
  masteryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  masteryText: { fontSize: 10, fontWeight: '800' },
  eraDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 12, fontWeight: '500' },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, marginRight: 12, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  arrow: { fontSize: 28, fontWeight: '300', marginLeft: 10 },
});
