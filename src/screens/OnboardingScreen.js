import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { setOnboarded } from '../utils/storage';
import { requestNotificationPermission } from '../utils/notifications';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '📖',
    title: 'Test Your Faith',
    description: 'Challenge yourself with Bible trivia questions across multiple difficulty levels.',
  },
  {
    icon: '⏱️',
    title: 'Timed Challenges',
    description: 'Race against the clock to answer questions. The faster you answer, the more points you earn!',
  },
  {
    icon: '🎓',
    title: 'Choose Your Level',
    description: 'Select your starting knowledge level to get the best experience.',
    isSelector: true,
  },
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function OnboardingScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { setKnowledgeLevel } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      await setKnowledgeLevel(selectedLevel);
      await setOnboarded(true);
      await requestNotificationPermission();
      navigation.replace('Quiz', { difficulty: 'mixed', seconds: 15, isDaily: true });
    }
  };

  const handleSkip = async () => {
    await setKnowledgeLevel('Beginner');
    await setOnboarded(true);
    await requestNotificationPermission();
    navigation.replace('Quiz', { difficulty: 'mixed', seconds: 15, isDaily: true });
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            {slide.isSelector && (
              <View style={styles.selectorContainer}>
                {LEVELS.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelBtn,
                      selectedLevel === level && styles.levelBtnActive
                    ]}
                    onPress={() => setSelectedLevel(level)}
                  >
                    <Text style={[
                      styles.levelText,
                      selectedLevel === level && styles.levelTextActive
                    ]}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'flex-end', paddingHorizontal: 20, paddingVertical: 16 },
  skipBtn: { padding: 8 },
  skipText: { color: colors.textSecondary, fontSize: 15 },
  scrollView: { flex: 1 },
  slide: { width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  icon: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  selectorContainer: { width: '100%', gap: 12 },
  levelBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  levelBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  levelText: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  levelTextActive: { color: colors.primary, fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center' },
  dots: { flexDirection: 'row', marginBottom: 32 },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.primary, marginHorizontal: 4 },
  nextBtn: {
    width: '100%', backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  nextText: { fontSize: 17, fontWeight: '600', color: colors.background },
});
