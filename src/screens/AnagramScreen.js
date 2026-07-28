import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, Alert, Dimensions, Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { ANAGRAMS, shuffleArray } from '../data/anagrams';
import { playCorrect, playWrong, playTick } from '../utils/sounds';
import { vibrateOnCorrect, vibrateOnWrong, vibrateOnSelection } from '../utils/haptics';
import { trackEvent } from '../utils/analytics';

const { width } = Dimensions.get('window');

export default function AnagramScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress, earnCoins, spendCoins } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [anagramsList] = useState(() => shuffleArray(ANAGRAMS).slice(0, 10));
  const [currentAnagram, setCurrentAnagram] = useState(anagramsList[0]);

  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    setSelectedLetters([]);
    // Split scrambled word into individual letters with unique IDs to handle duplicate letters
    const letters = anagram.scrambled.split('').map((char, i) => ({
      id: `${i}-${char}`,
      char
    }));
    setAvailableLetters(letters);
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleLetterPress = (letter, isSelected) => {
    vibrateOnSelection();
    playTick();
    if (isSelected) {
      // Move from selected back to available
      setSelectedLetters(prev => prev.filter(l => l.id !== letter.id));
      setAvailableLetters(prev => [...prev, letter]);
    } else {
      // Move from available to selected
      setAvailableLetters(prev => prev.filter(l => l.id !== letter.id));
      setSelectedLetters(prev => [...prev, letter]);
    }
  };

  const handleCheck = () => {
    const userWord = selectedLetters.map(l => l.char).join('');
    if (userWord === currentAnagram.word) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      playCorrect();
      vibrateOnCorrect();

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        initLevel(nextIndex);
      }, 1500);
    } else {
      setIsCorrect(false);
      playWrong();
      vibrateOnWrong();

      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      setTimeout(() => setIsCorrect(null), 1500);
    }
  };

  const handleHint = async () => {
    if (showHint) return;
    const success = await spendCoins(15);
    if (success) {
      setShowHint(true);
      trackEvent('use_hint_anagram', { word: currentAnagram.word });
    } else {
      Alert.alert('Not enough coins', 'You need 15 coins for a hint.');
    }
  };

  const handleGameOver = () => {
    const bonus = score * 5;
    earnCoins(bonus);
    trackEvent('anagram_game_complete', { score, total: anagramsList.length });
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
        <Text style={styles.title}>Word Scramble</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{score}/{anagramsList.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.levelText}>Puzzle {currentIndex + 1}</Text>

          <View style={styles.targetContainer}>
            {/* Word skeleton */}
            <View style={styles.skeletonContainer}>
              {currentAnagram.word.split('').map((_, i) => (
                <View key={i} style={[styles.letterSlot, isCorrect === true && styles.slotCorrect, isCorrect === false && styles.slotWrong]}>
                  <Text style={styles.letterText}>
                    {selectedLetters[i]?.char || ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.instruction}>Tap letters to build the word</Text>

          {/* Selected Letters (Tap to remove) */}
          <View style={styles.selectionRow}>
            {selectedLetters.map((letter) => (
              <TouchableOpacity
                key={letter.id}
                style={styles.letterBox}
                onPress={() => handleLetterPress(letter, true)}
              >
                <Text style={styles.letterBoxText}>{letter.char}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Available Letters (Tap to select) */}
          <View style={styles.availableRow}>
            {availableLetters.map((letter) => (
              <TouchableOpacity
                key={letter.id}
                style={styles.letterBox}
                onPress={() => handleLetterPress(letter, false)}
              >
                <Text style={styles.letterBoxText}>{letter.char}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintTitle}>💡 Hint:</Text>
              <Text style={styles.hintText}>{currentAnagram.hint}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {!showHint && (
          <TouchableOpacity style={styles.hintBtn} onPress={handleHint}>
            <Text style={styles.hintBtnText}>Get Hint (15 🪙)</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.checkBtn, selectedLetters.length !== currentAnagram.word.length && styles.checkBtnDisabled]}
          onPress={handleCheck}
          disabled={selectedLetters.length !== currentAnagram.word.length || isCorrect !== null}
        >
          <Text style={styles.checkBtnText}>Check Answer</Text>
        </TouchableOpacity>
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
    minHeight: 400,
  },
  levelText: { fontSize: 14, color: colors.primary, fontWeight: '800', letterSpacing: 1, marginBottom: 20 },
  targetContainer: { width: '100%', marginBottom: 30 },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  letterSlot: {
    width: 40,
    height: 50,
    borderBottomWidth: 3,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotCorrect: { borderBottomColor: '#4CAF50' },
  slotWrong: { borderBottomColor: '#F44336' },
  letterText: { fontSize: 28, fontWeight: '900', color: colors.text },
  instruction: { fontSize: 13, color: colors.textMuted, marginBottom: 20, fontWeight: '600' },
  selectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    minHeight: 60,
    marginBottom: 20,
  },
  divider: { width: '100%', height: 1, backgroundColor: colors.border, marginVertical: 20 },
  availableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  letterBox: {
    width: 50,
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  letterBoxText: { fontSize: 24, fontWeight: '800', color: colors.text },
  hintContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    width: '100%',
  },
  hintTitle: { fontSize: 14, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  hintText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  footer: { padding: 20, gap: 12 },
  hintBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  hintBtnText: { color: colors.primary, fontWeight: '700' },
  checkBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    elevation: 4,
  },
  checkBtnDisabled: { backgroundColor: colors.textMuted, opacity: 0.5 },
  checkBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});
