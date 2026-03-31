import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { loadScores, clearScores } from '../utils/storage';
import { trackEvent } from '../utils/analytics';
import { useTheme } from '../context/ThemeContext';

const DIFF_COLOR = { easy: '#4CAF82', medium: '#E6A817', hard: '#D95F4B' };
const MEDAL = ['🥇', '🥈', '🥉'];
const FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

export default function LeaderboardScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchScores = async (selectedFilter = filter) => {
    setLoading(true);
    const difficulty = selectedFilter === 'All' ? undefined : selectedFilter.toLowerCase();
    const data = await loadScores(difficulty);
    setScores(data);
    setLoading(false);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  useFocusEffect(useCallback(() => {
    fadeAnim.setValue(0);
    fetchScores(filter);
    trackEvent('leaderboard_viewed', { filter: filter.toLowerCase() });
  }, [filter]));

  const handleClear = () => {
    Alert.alert(
      'Clear Leaderboard',
      'Are you sure you want to delete all scores?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All', style: 'destructive',
          onPress: async () => {
            await clearScores();
            setScores([]);
            await trackEvent('leaderboard_cleared');
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => {
    const color = DIFF_COLOR[item.difficulty] || colors.primary;
    const isTop = index < 3;
    return (
      <View style={[styles.row, isTop && styles.rowTop, isTop && { borderColor: color }]}>
        <Text style={styles.rank}>
          {isTop ? MEDAL[index] : `#${index + 1}`}
        </Text>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowMeta}>
            <Text style={{ color }}>{item.difficulty}</Text>
            {'  ·  '}{item.date}
          </Text>
        </View>
        <View style={styles.rowScore}>
          <Text style={[styles.rowPct, { color }]}>{item.pct}%</Text>
          <Text style={styles.rowRaw}>{item.score}/{item.total}</Text>
        </View>
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.trophy}>🏆</Text>
      <View style={styles.divider}>
        <View style={styles.divLine} />
        <Text style={styles.divIcon}>✦</Text>
        <View style={styles.divLine} />
      </View>

      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={async () => {
              setFilter(f);
              await trackEvent('leaderboard_filter_selected', { filter: f.toLowerCase() });
            }}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : scores.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>No scores yet.</Text>
          <Text style={styles.emptySubtext}>Complete a {filter === 'All' ? '' : filter.toLowerCase() + ' '}quiz to appear here!</Text>
        </View>
      ) : (
        <Animated.View style={[{ flex: 1, width: '100%' }, { opacity: fadeAnim }]}>
          <FlatList
            data={scores}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.playBtnText}>Play Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10, marginBottom: 6 },
  backBtn: { padding: 4, minWidth: 50 },
  backText: { color: colors.textSecondary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  clearBtn: { minWidth: 50, alignItems: 'flex-end', padding: 4 },
  clearText: { color: colors.error, fontSize: 13 },
  trophy: { fontSize: 36, marginTop: 6, marginBottom: 10 },
  divider: { flexDirection: 'row', alignItems: 'center', width: '70%', marginBottom: 18 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divIcon: { color: colors.primary, fontSize: 11, marginHorizontal: 10 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card },
  filterActive: { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
  filterText: { color: colors.textSecondary, fontSize: 12 },
  filterTextActive: { color: colors.primary, fontWeight: '600' },
  list: { paddingBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10 },
  rowTop: { borderWidth: 1.5 },
  rank: { fontSize: 18, width: 36, textAlign: 'center', marginRight: 10 },
  rowInfo: { flex: 1 },
  rowName: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 3 },
  rowMeta: { color: colors.textSecondary, fontSize: 11 },
  rowScore: { alignItems: 'flex-end' },
  rowPct: { fontSize: 18, fontWeight: '700' },
  rowRaw: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 14 },
  emptyText: { color: colors.textSecondary, fontSize: 15, marginBottom: 6 },
  emptySubtext: { color: colors.textMuted, fontSize: 12 },
  playBtn: { width: '100%', borderWidth: 1, borderColor: colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 16, backgroundColor: colors.card },
  playBtnText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
