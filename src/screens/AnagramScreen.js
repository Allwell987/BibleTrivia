import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, Alert, Dimensions, Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { getBalancedAnagramSet, shuffleArray } from '../data/anagrams';
import { playCorrect, playWrong, playTick, playPowerup } from '../utils/sounds';
import { vibrateOnCorrect, vibrateOnWrong, vibrateOnSelection } from '../utils/haptics';
import { trackEvent } from '../utils/analytics';
import { ProgressBar } from '../components';

const { width } = Dimensions.get('window');

export default function AnagramScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress, earnCoins, spendCoins } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [anagramsList] = useState(() => getBalancedAnagramSet());
  const [currentAnagram, setCurrentAnagram] = useState(anagramsList[0]);

  const [selectedLetters, setSelectedLetters] = useState([]); // Array of { id, char } or null for empty slots
  const [availableLetters, setAvailableLetters] = useState([]); // Array of { id, char, isUsed }
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showClue, setShowClue] = useState(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initLevel(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const initLevel = (index) => {
    if (index >= anagramsList.length) {
      handleGameOver();
      return;
    }
    const anagram = anagramsList[index];
    setCurrentAnagram(anagram);

    // Skeleton setup: null for each letter, maintaining spaces
    const skeleton = anagram.word.split('').map(char => char === ' ' ? ' ' : null);
    setSelectedLetters(skeleton);

    // Bank setup
    const letters = anagram.word.replace(/\s/g, '').split('').map((char, i) => ({
      id: `${i}-${char}-${Math.random()}`,
      char: char.toUpperCase(),
      isUsed: false
    }));

    setAvailableLetters(shuffleArray(letters));
    setIsCorrect(null);
    setShowClue(false);

    Animated.timing(progressAnim, {
      toValue: index / anagramsList.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleBankPress = (letter) => {
    if (letter.isUsed || isCorrect !== null) return;

    vibrateOnSelection();
    playTick();

    // Find first null slot in selectedLetters
    const firstEmptyIndex = selectedLetters.indexOf(null);
    if (firstEmptyIndex === -1) return;

    const newSelected = [...selectedLetters];
    newSelected[firstEmptyIndex] = letter;
    setSelectedLetters(newSelected);

    const newAvailable = availableLetters.map(l =>
      l.id === letter.id ? { ...l, isUsed: true } : l
    );
    setAvailableLetters(newAvailable);

    // Auto check if full
    if (newSelected.indexOf(null) === -1) {
      setTimeout(() => handleCheck(newSelected), 100);
    }
  };

  const handleSlotPress = (index) => {
    if (isCorrect !== null) return;
    const letter = selectedLetters[index];
    if (!letter || letter === ' ') return;

    vibrateOnSelection();
    playTick();

    const newSelected = [...selectedLetters];
    newSelected[index] = null;
    setSelectedLetters(newSelected);

    const newAvailable = availableLetters.map(l =>
      l.id === letter.id ? { ...l, isUsed: false } : l
    );
    setAvailableLetters(newAvailable);
  };

  const handleCheck = (currentSelection) => {
    const userWord = currentSelection.filter(l => l && l !== ' ').map(l => l.char).join('');
    const targetWord = currentAnagram.word.replace(/\s/g, '').toUpperCase();

    if (userWord === targetWord) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      playCorrect();
      vibrateOnCorrect();

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        initLevel(nextIndex);
      }, 2000);
    } else {
      setIsCorrect(false);
      playWrong();
      vibrateOnWrong();

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        setIsCorrect(null);
        // Clear selection on wrong answer to let user try again easily
        const newSelected = currentAnagram.word.split('').map(char => char === ' ' ? ' ' : null);
        setSelectedLetters(newSelected);
        setAvailableLetters(prev => prev.map(l => ({ ...l, isUsed: false })));
      }, 1500);
    }
  };

  const handleClue = async () => {
    if (showClue) return;
    const success = await spendCoins(10);
    if (success) {
      setShowClue(true);
      playPowerup();
      trackEvent('use_clue_anagram', { word: currentAnagram.word });
    } else {
      Alert.alert('Not enough coins', 'You need 10 coins for a clue.');
    }
  };

  const handleRevealLetter = async () => {
    if (isCorrect !== null) return;
    const firstEmptyIndex = selectedLetters.indexOf(null);
    if (firstEmptyIndex === -1) return;

    const success = await spendCoins(20);
    if (success) {
      playPowerup();
      // Find the correct letter for this position
      const targetChar = currentAnagram.word[firstEmptyIndex].toUpperCase();
      // Find an unused instance of this character in the bank
      const letterToUse = availableLetters.find(l => l.char === targetChar && !l.isUsed);

      if (letterToUse) {
        handleBankPress(letterToUse);
      }
      trackEvent('use_reveal_anagram', { word: currentAnagram.word, pos: firstEmptyIndex });
    } else {
      Alert.alert('Not enough coins', 'You need 20 coins to reveal a letter.');
    }
  };

  const handleGameOver = () => {
    const bonus = score * 5;
    earnCoins(bonus);
    trackEvent('anagram_game_complete', { score, total: anagramsList.length });

    // Final progress bar fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Alert.alert(
      'Game Complete! 🎉',
      `You solved ${score} out of ${anagramsList.length} puzzles!\nYou earned ${bonus} coins!`,
      [{ text: 'Awesome', onPress: () => navigation.navigate('Home') }]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Word Scramble</Text>
          <Text style={styles.subtitle}>{currentAnagram.difficulty} Challenge</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{score}/{anagramsList.length}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <ProgressBar
          current={currentIndex + 1}
          total={anagramsList.length}
          diffColor={colors.primary}
          progressAnim={progressAnim}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: bounceAnim }, { translateX: shakeAnim }]
          }
        ]}>
          <View style={styles.cardHeader}>
            <Text style={styles.levelText}>Puzzle {currentIndex + 1}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentAnagram.category || 'General'}</Text>
            </View>
          </View>

          <View style={styles.targetContainer}>
            <View style={styles.skeletonContainer}>
              {selectedLetters.map((letter, i) => {
                if (letter === ' ') {
                  return <View key={`space-${i}`} style={styles.spaceSlot} />;
                }
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.letterSlot,
                      isCorrect === true && styles.slotCorrect,
                      isCorrect === false && styles.slotWrong,
                      letter && styles.slotFilled
                    ]}
                    onPress={() => handleSlotPress(i)}
                    disabled={isCorrect !== null}
                  >
                    <Text style={[styles.letterText, letter && styles.filledText]}>
                      {letter?.char || ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.instruction}>Tap letters to build the word</Text>

          <View style={styles.divider} />

          {/* Bank of letters */}
          <View style={styles.availableRow}>
            {availableLetters.map((letter) => (
              <TouchableOpacity
                key={letter.id}
                style={[styles.letterBox, letter.isUsed && styles.letterBoxUsed]}
                onPress={() => handleBankPress(letter)}
                disabled={letter.isUsed || isCorrect !== null}
              >
                <Text style={[styles.letterBoxText, letter.isUsed && styles.letterBoxTextUsed]}>
                  {letter.char}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showClue && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintTitle}>💡 Clue:</Text>
              <Text style={styles.hintText}>{currentAnagram.hint}</Text>
            </View>
          )}

          {isCorrect === true && currentAnagram.reference && (
            <View style={[styles.hintContainer, { backgroundColor: '#4CAF5015', borderColor: '#4CAF5040', borderWidth: 1 }]}>
              <Text style={[styles.hintTitle, { color: '#4CAF50' }]}>📖 Scripture:</Text>
              <Text style={styles.hintText}>{currentAnagram.reference}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.footerBtn, styles.hintBtn, showClue && styles.btnDisabled]}
            onPress={handleClue}
            disabled={showClue || isCorrect !== null}
          >
            <Text style={styles.hintBtnText}>{showClue ? 'Clue Revealed' : 'Show Clue (10 🪙)'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerBtn, styles.revealBtn]}
            onPress={handleRevealLetter}
            disabled={isCorrect !== null}
          >
            <Text style={styles.revealBtnText}>Reveal Letter (20 🪙)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 24, color: colors.text, fontWeight: '300' },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 10, color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  scoreBadge: { backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: colors.border },
  scoreText: { color: colors.primary, fontWeight: '700' },
  content: { padding: 20, flexGrow: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 450,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  levelText: { fontSize: 14, color: colors.primary, fontWeight: '800', letterSpacing: 1 },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: { fontSize: 10, color: colors.primary, fontWeight: '800', textTransform: 'uppercase' },
  targetContainer: { width: '100%', marginBottom: 30 },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  spaceSlot: { width: 15, height: 50 },
  letterSlot: {
    width: 36,
    height: 46,
    borderBottomWidth: 3,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  slotFilled: { borderBottomColor: colors.primary },
  slotCorrect: { borderBottomColor: '#4CAF50', backgroundColor: '#4CAF5010' },
  slotWrong: { borderBottomColor: '#F44336', backgroundColor: '#F4433610' },
  letterText: { fontSize: 24, fontWeight: '900', color: colors.textMuted },
  filledText: { color: colors.text },
  instruction: { fontSize: 12, color: colors.textMuted, marginTop: 15, fontWeight: '600' },
  divider: { width: '100%', height: 1, backgroundColor: colors.border, marginVertical: 20 },
  availableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  letterBox: {
    width: 46,
    height: 46,
    backgroundColor: colors.background,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  letterBoxUsed: {
    backgroundColor: colors.dim,
    borderColor: 'transparent',
    elevation: 0,
    opacity: 0.4,
  },
  letterBoxText: { fontSize: 20, fontWeight: '800', color: colors.text },
  letterBoxTextUsed: { color: colors.textMuted },
  hintContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    width: '100%',
  },
  hintTitle: { fontSize: 13, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  hintText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  footer: { padding: 20 },
  footerRow: { flexDirection: 'row', gap: 10 },
  footerBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 16, borderWidth: 1 },
  hintBtn: { borderColor: colors.primary },
  hintBtnText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  revealBtn: { backgroundColor: colors.primary, borderColor: colors.primary },
  revealBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  btnDisabled: { opacity: 0.5, borderColor: colors.border },
});
