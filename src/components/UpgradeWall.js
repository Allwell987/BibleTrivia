import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { trackEvent } from '../utils/analytics';

const { height } = Dimensions.get('window');

const FEATURE_LIST = [
  { icon: '🚫', title: 'No Advertisements', desc: 'Study the Word without interruptions' },
  { icon: '💡', title: 'Unlimited Hints', desc: 'Never get stuck on a difficult question' },
  { icon: '🗺️', title: 'Exclusive Journey Eras', desc: 'Unlock the complete Biblical timeline' },
  { icon: '👑', title: 'Support the Ministry', desc: 'Help us bring the Bible to more people' },
];

export default function UpgradeWall({ visible, onClose }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { colors } = theme;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      trackEvent('paywall_viewed', { source: 'fallback_ui' });
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [visible]);

  if (!visible) return null;

  const handleUpgrade = () => {
    trackEvent('paywall_upgrade_click', { source: 'fallback_ui' });
    onClose?.();
    navigation.navigate('Shop');
  };

  const styles = createStyles(colors);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.handle} />
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.eyebrow}>PREMIUM ACCESS</Text>
            <Text style={styles.title}>Bible Trivia Pro</Text>
            <Text style={styles.subtitle}>
              Go deeper into Scripture with the complete trivia experience.
            </Text>

            <View style={styles.featuresContainer}>
              {FEATURE_LIST.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={styles.featureIconBox}>
                    <Text style={styles.featureEmoji}>{feature.icon}</Text>
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDesc}>{feature.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={handleUpgrade}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeBtnText}>View Pro Options</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notNowBtn}
              onPress={onClose}
            >
              <Text style={styles.notNowText}>Maybe Later</Text>
            </TouchableOpacity>

            <Text style={styles.privacyNote}>
              Restore purchases at any time in the Shop.
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 2.5,
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 15,
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  upgradeBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  notNowBtn: {
    marginTop: 16,
    paddingVertical: 10,
  },
  notNowText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  privacyNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 24,
    textAlign: 'center',
  },
});
