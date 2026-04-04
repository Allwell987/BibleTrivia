import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = [
  { key: 'gospels', label: 'Gospels', icon: '✝️', desc: 'Matthew, Mark, Luke, John' },
  { key: 'oldTestament', label: 'Old Testament', icon: '📜', desc: 'Genesis to Malachi' },
  { key: 'newTestament', label: 'New Testament', icon: '📖', desc: 'Acts to Revelation' },
  { key: 'wisdom', label: 'Wisdom Literature', icon: '💡', desc: 'Psalms, Proverbs, Job' },
  { key: 'history', label: 'Historical Books', icon: '👑', desc: 'Kings, Chronicles, etc.' },
];

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy', color: '#4CAF82', seconds: 20 },
  { key: 'medium', label: 'Medium', color: '#E6A817', seconds: 15 },
  { key: 'hard', label: 'Hard', color: '#D95F4B', seconds: 10 },
  { key: 'expert', label: 'Expert', color: '#9B59B6', seconds: 8 },
];

const QUESTION_COUNTS = [5, 10, 15, 20, 25];

export default function CustomQuizBuilder({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [selectedCategories, setSelectedCategories] = useState(['gospels', 'oldTestament', 'newTestament', 'wisdom', 'history']);
  const [selectedDifficulty, setSelectedDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(true);

  const toggleCategory = (key) => {
    setSelectedCategories(prev => 
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const handleStartQuiz = () => {
    const category = selectedCategories.length === 1 ? selectedCategories[0] : 'all';
    const difficulty = selectedDifficulty === 'mixed' ? 'all' : selectedDifficulty;
    
    navigation.navigate('Quiz', { 
      difficulty,
      seconds: selectedDifficulty === 'mixed' ? 15 : DIFFICULTIES.find(d => d.key === selectedDifficulty)?.seconds || 15,
      category,
      customQuiz: true,
      questionCount,
      timerEnabled,
      hintsEnabled
    });
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Custom Quiz</Text>
          <Text style={styles.subtitle}>Build your perfect Bible study session</Text>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryCard, selectedCategories.includes(cat.key) && styles.categoryCardActive]}
              onPress={() => toggleCategory(cat.key)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryDesc}>{cat.desc}</Text>
              <View style={[styles.checkmark, selectedCategories.includes(cat.key) && styles.checkmarkActive]}>
                <Text style={styles.checkmarkText}>{selectedCategories.includes(cat.key) ? '✓' : ''}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Difficulty</Text>
        <View style={styles.difficultyRow}>
          <TouchableOpacity
            style={[styles.diffChip, selectedDifficulty === 'mixed' && styles.diffChipActive]}
            onPress={() => setSelectedDifficulty('mixed')}
          >
            <Text style={[styles.diffChipText, selectedDifficulty === 'mixed' && styles.diffChipTextActive]}>All</Text>
          </TouchableOpacity>
          {DIFFICULTIES.map(diff => (
            <TouchableOpacity
              key={diff.key}
              style={[styles.diffChip, selectedDifficulty === diff.key && { backgroundColor: diff.color + '30', borderColor: diff.color }]}
              onPress={() => setSelectedDifficulty(diff.key)}
            >
              <Text style={[styles.diffChipText, selectedDifficulty === diff.key && { color: diff.color }]}>{diff.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Questions</Text>
        <View style={styles.countRow}>
          {QUESTION_COUNTS.map(count => (
            <TouchableOpacity
              key={count}
              style={[styles.countChip, questionCount === count && styles.countChipActive]}
              onPress={() => setQuestionCount(count)}
            >
              <Text style={[styles.countChipText, questionCount === count && styles.countChipTextActive]}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Options</Text>
        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>Timer</Text>
              <Text style={styles.optionDesc}>Countdown for each question</Text>
            </View>
            <Switch
              value={timerEnabled}
              onValueChange={setTimerEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={timerEnabled ? colors.primary : colors.textMuted}
            />
          </View>
          <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>Hints</Text>
              <Text style={styles.optionDesc}>50/50 eliminate wrong answers</Text>
            </View>
            <Switch
              value={hintsEnabled}
              onValueChange={setHintsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={hintsEnabled ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: colors.primary }]}
          onPress={handleStartQuiz}
          disabled={selectedCategories.length === 0}
        >
          <Text style={styles.startBtnText}>Start Quiz ✨</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  sectionTitle: { fontSize: 12, letterSpacing: 2, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 12, marginTop: 20 },
  categoryGrid: { gap: 10 },
  categoryCard: { backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 8, flexDirection: 'row', alignItems: 'center', opacity: 0.5 },
  categoryCardActive: { borderColor: colors.primary, opacity: 1 },
  categoryIcon: { fontSize: 24, marginRight: 12 },
  categoryLabel: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  categoryDesc: { fontSize: 11, color: colors.textSecondary, position: 'absolute', bottom: 8, left: 50 },
  checkmark: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkmarkActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmarkText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  difficultyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  diffChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  diffChipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  diffChipText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  diffChipTextActive: { color: colors.primary },
  countRow: { flexDirection: 'row', gap: 10 },
  countChip: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  countChipActive: { backgroundColor: colors.primary + '15', borderColor: colors.primary },
  countChipText: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
  countChipTextActive: { color: colors.primary },
  optionCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.cardBorder },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  optionDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  optionDivider: { height: 1, marginVertical: 12 },
  startBtn: { marginTop: 32, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  startBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
