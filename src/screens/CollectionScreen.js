import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, FlatList, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { CHARACTERS, BIBLE_BOOKS } from '../data/collectibles';
import useReducedMotion from '../hooks/useReducedMotion';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 40) / 2;

function RevealCard({ children, isUnlocked, style, reducedMotion }) {
  const revealAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      revealAnim.setValue(1);
      return;
    }

    if (!isUnlocked) return;
    revealAnim.setValue(0);
    Animated.spring(revealAnim, {
      toValue: 1,
      friction: 8,
      tension: 105,
      useNativeDriver: true,
    }).start();
  }, [isUnlocked, reducedMotion, revealAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: revealAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.75, 1],
          }),
          transform: [
            {
              rotateY: revealAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['9deg', '0deg'],
              }),
            },
            {
              scale: revealAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.94, 1],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export default function CollectionScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress } = useProgress();
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('characters');
  const tabAnim = useRef(new Animated.Value(0)).current;
  const listFadeAnim = useRef(new Animated.Value(1)).current;

  const styles = createStyles(colors);
  const switchTab = (nextTab) => {
    if (nextTab === activeTab) return;

    if (reducedMotion) {
      setActiveTab(nextTab);
      tabAnim.setValue(nextTab === 'books' ? 1 : 0);
      return;
    }

    Animated.timing(listFadeAnim, {
      toValue: 0,
      duration: 90,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(nextTab);
      Animated.timing(listFadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }).start();
    });

    Animated.spring(tabAnim, {
      toValue: nextTab === 'books' ? 1 : 0,
      friction: 9,
      tension: 110,
      useNativeDriver: true,
    }).start();
  };

  const renderCharacter = ({ item, index }) => {
    const isUnlocked = progress.unlockedCharacters.includes(item.id);
    return (
      <Animated.View
        style={{
          opacity: listFadeAnim,
          transform: [{
            translateY: listFadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [12 + (index % 4) * 2, 0],
            }),
          }],
        }}
      >
        <RevealCard reducedMotion={reducedMotion} isUnlocked={isUnlocked} style={[styles.card, !isUnlocked && styles.cardLocked]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{isUnlocked ? item.image : '❓'}</Text>
            <View>
              <Text style={[styles.cardName, !isUnlocked && styles.textLocked]}>
                {isUnlocked ? item.name : 'Unknown Character'}
              </Text>
              <Text style={styles.cardEra}>{isUnlocked ? `Era: ${item.era}` : 'Keep playing to unlock'}</Text>
            </View>
          </View>
          {isUnlocked && (
            <View style={styles.cardBody}>
              <Text style={styles.cardVerse}>"{item.verse}"</Text>
              <Text style={styles.cardBio}>{item.bio}</Text>
              <View style={styles.factBox}>
                <Text style={styles.factTitle}>Did you know?</Text>
                <Text style={styles.factText}>{item.fact}</Text>
              </View>
            </View>
          )}
          {!isUnlocked && (
            <Text style={styles.lockHint}>
              Master the {item.era} era ({item.requirement.count} correct answers) to unlock.
            </Text>
          )}
        </RevealCard>
      </Animated.View>
    );
  };

  const renderBook = ({ item, index }) => {
    const isUnlocked = progress.unlockedBooks.includes(item.id);
    const progressCount = progress.bookProgress[item.name] || 0;
    return (
      <Animated.View
        style={{
          opacity: listFadeAnim,
          transform: [{
            translateY: listFadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10 + (index % 6), 0],
            }),
          }],
        }}
      >
        <RevealCard reducedMotion={reducedMotion} isUnlocked={isUnlocked} style={[styles.bookCard, !isUnlocked && styles.cardLocked]}>
          <Text style={styles.bookIcon}>{isUnlocked ? '📖' : '🔒'}</Text>
          <Text style={[styles.bookName, !isUnlocked && styles.textLocked]}>{item.name}</Text>
          <View style={styles.bookProgressContainer}>
            <View style={styles.bookProgressBarBg}>
              <View style={[styles.bookProgressBarFill, { width: `${Math.min((progressCount/item.questionsNeeded)*100, 100)}%` }]} />
            </View>
            <Text style={styles.bookProgressText}>{progressCount}/{item.questionsNeeded}</Text>
          </View>
        </RevealCard>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biblical Collection</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, TAB_WIDTH],
                }),
              }],
            },
          ]}
        />
        <TouchableOpacity
          style={[styles.tab, activeTab === 'characters' && styles.activeTab]}
          onPress={() => switchTab('characters')}
        >
          <Text style={[styles.tabText, activeTab === 'characters' && styles.activeTabText]}>Characters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'books' && styles.activeTab]}
          onPress={() => switchTab('books')}
        >
          <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>Bible Books</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: listFadeAnim,
        }}
      >
        <FlatList
          data={activeTab === 'characters' ? CHARACTERS : BIBLE_BOOKS}
          renderItem={activeTab === 'characters' ? renderCharacter : renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={activeTab === 'characters' ? 1 : 2}
          key={activeTab} // Force re-render when switching tabs
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  activeTabText: { color: colors.primary },
  tabIndicator: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    width: TAB_WIDTH,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder },
  cardLocked: { opacity: 0.7, backgroundColor: colors.background, borderStyle: 'dashed' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardIcon: { fontSize: 40, marginRight: 15 },
  cardName: { fontSize: 20, fontWeight: '800', color: colors.primary },
  textLocked: { color: colors.textMuted },
  cardEra: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardBody: { marginTop: 10 },
  cardVerse: { fontSize: 14, fontStyle: 'italic', color: colors.text, marginBottom: 12, textAlign: 'center' },
  cardBio: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 15 },
  factBox: { backgroundColor: colors.primary + '10', padding: 15, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.primary },
  factTitle: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 5, textTransform: 'uppercase' },
  factText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  lockHint: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
  bookCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 15, margin: 5, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  bookIcon: { fontSize: 30, marginBottom: 10 },
  bookName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10 },
  bookProgressContainer: { width: '100%', alignItems: 'center' },
  bookProgressBarBg: { width: '100%', height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 5 },
  bookProgressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  bookProgressText: { fontSize: 10, color: colors.textMuted },
});
