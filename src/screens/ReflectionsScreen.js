import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

function ReflectionCard({ item, colors }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.prompt, { color: colors.primary }]}>{item.prompt}</Text>
      <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
      <Text style={[styles.meta, { color: colors.textMuted }]}>
        {new Date(item.createdAt).toLocaleDateString()} • {item.score}/{item.total}
      </Text>
    </View>
  );
}

export default function ReflectionsScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress } = useProgress();

  const reflections = progress.reflections || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Reflections</Text>
        <View style={{ width: 40 }} />
      </View>

      {reflections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No reflections yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Complete a Daily Challenge and save your first reflection.</Text>
        </View>
      ) : (
        <FlatList
          data={reflections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReflectionCard item={item} colors={colors} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backText: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  prompt: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  meta: { fontSize: 11 },
});

