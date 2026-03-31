import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Linking, Platform, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { updateSetting, loadSettings, resetStats, resetAchievements } from '../utils/storage';
import { getAnalyticsEvents, clearAnalyticsEvents, trackEvent } from '../utils/analytics';

const TIMER_OPTIONS = [10, 15, 20, 30];
const PRIVACY_URL = 'https://your-domain.com/privacy-policy';

export default function SettingsScreen({ navigation }) {
  const { theme, updateTheme } = useTheme();
  const { colors } = theme;
  const {
    user,
    signInWithApple,
    signInWithGoogle,
    logout,
    isAppleAvailable,
    isFirebaseConfigured,
    isGoogleSignInAvailable,
  } = useAuth();
  const [settings, setSettings] = useState(null);
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  const [analyticsKPIs, setAnalyticsKPIs] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
    refreshAnalytics();
  }, []);

  const refreshAnalytics = async () => {
    const allEvents = await getAnalyticsEvents(200);

    const starts = allEvents.filter(e => e.name === 'quiz_started').length;
    const completions = allEvents.filter(e => e.name === 'quiz_completed').length;
    const answers = allEvents.filter(e => e.name === 'answer_submitted').length;
    const timeouts = allEvents.filter(e => e.name === 'question_timeout').length;
    const hints = allEvents.filter(e => e.name === 'hint_used').length;

    setAnalyticsKPIs({
      starts,
      completions,
      timeoutRate: answers > 0 ? Math.round((timeouts / answers) * 100) + '%' : '—',
      hintRate: answers > 0 ? Math.round((hints / answers) * 100) + '%' : '—',
    });

    setAnalyticsEvents(allEvents.slice(0, 30));
  };

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await updateSetting(key, !settings[key]);
  };

  const handleThemeChange = async (themeName) => {
    updateTheme(themeName);
    await updateSetting('theme', themeName);
    setSettings({ ...settings, theme: themeName });
  };

  const handleTimerChange = async (seconds) => {
    await updateSetting('defaultTimer', seconds);
    setSettings({ ...settings, defaultTimer: seconds });
  };

  const handleDifficultyChange = async (diff) => {
    await updateSetting('defaultDifficulty', diff);
    setSettings({ ...settings, defaultDifficulty: diff });
  };

  const handleResetStats = async () => {
    await resetStats();
    await resetAchievements();
    await trackEvent('settings_data_reset');
  };

  const handleClearAnalytics = async () => {
    Alert.alert(
      'Clear analytics events?',
      'This removes locally stored analytics logs for this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAnalyticsEvents();
            setAnalyticsEvents([]);
          },
        },
      ]
    );
  };

  const handleExportAnalytics = async () => {
    const events = await getAnalyticsEvents(200);
    if (events.length === 0) {
      Alert.alert('No analytics events', 'Generate events first, then export again.');
      return;
    }

    const message = `Bible Trivia Analytics Export\n\n${JSON.stringify(events, null, 2)}`;
    await Share.share({
      title: 'Bible Trivia Analytics Export',
      message,
    });
  };

  const openPrivacyPolicy = () => {
    if (PRIVACY_URL.includes('your-domain.com')) {
      Alert.alert(
        'Privacy policy unavailable',
        'Add your production privacy policy URL before opening this link.'
      );
      return;
    }
    Linking.openURL(PRIVACY_URL);
  };

  if (!settings) return null;

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Sync</Text>
          {!user ? (
            <View style={styles.authBox}>
              <Text style={styles.authDesc}>Sign in to save your progress, achievements, and stats across devices.</Text>
              {!isFirebaseConfigured && (
                <Text style={styles.authWarning}>
                  Cloud auth is not configured in this build yet.
                </Text>
              )}

              {Platform.OS === 'ios' && isAppleAvailable && (
                <TouchableOpacity
                  style={[styles.appleBtn, !isFirebaseConfigured && styles.authBtnDisabled]}
                  onPress={signInWithApple}
                  disabled={!isFirebaseConfigured}
                >
                  <Text style={styles.appleBtnText}> Sign in with Apple</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.googleBtn, !isGoogleSignInAvailable && styles.authBtnDisabled]}
                onPress={signInWithGoogle}
                disabled={!isGoogleSignInAvailable}
              >
                <Text style={styles.googleBtnText}>G Sign in with Google</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.userBox}>
              <View>
                <Text style={styles.userName}>{user.fullName?.givenName || 'Player'}</Text>
                <Text style={styles.userEmail}>{user.email || 'Signed in via ' + user.type}</Text>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Sound Effects</Text>
              <Text style={styles.rowDesc}>Play sounds for correct/wrong answers</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => handleToggle('soundEnabled')}
              trackColor={{ false: colors.dim, true: colors.success }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
              <Text style={styles.rowDesc}>Vibrate on interactions</Text>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={() => handleToggle('hapticEnabled')}
              trackColor={{ false: colors.dim, true: colors.success }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Show Explanations</Text>
              <Text style={styles.rowDesc}>Display explanations after each answer</Text>
            </View>
            <Switch
              value={settings.showExplanations}
              onValueChange={() => handleToggle('showExplanations')}
              trackColor={{ false: colors.dim, true: colors.success }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Theme</Text>
          </View>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionBtn, settings.theme === 'dark' && styles.optionActive]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[styles.optionText, settings.theme === 'dark' && styles.optionTextActive]}>🌙 Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, settings.theme === 'light' && styles.optionActive]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[styles.optionText, settings.theme === 'light' && styles.optionTextActive]}>☀️ Light</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiz Defaults</Text>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Timer Duration</Text>
          </View>
          <View style={styles.optionsRow}>
            {TIMER_OPTIONS.map((sec) => (
              <TouchableOpacity
                key={sec}
                style={[styles.optionBtn, settings.defaultTimer === sec && styles.optionActive]}
                onPress={() => handleTimerChange(sec)}
              >
                <Text style={[styles.optionText, settings.defaultTimer === sec && styles.optionTextActive]}>
                  {sec}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.row, { marginTop: 16 }]}>
            <Text style={styles.rowLabel}>Default Difficulty</Text>
          </View>
          <View style={styles.optionsRow}>
            {['easy', 'medium', 'hard'].map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[styles.optionBtn, settings.defaultDifficulty === diff && styles.optionActive]}
                onPress={() => handleDifficultyChange(diff)}
              >
                <Text style={[styles.optionText, settings.defaultDifficulty === diff && styles.optionTextActive]}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.dangerBtn} onPress={handleResetStats}>
            <Text style={styles.dangerBtnText}>Reset Statistics</Text>
          </TouchableOpacity>
        </View>

        {__DEV__ && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer Analytics</Text>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => setShowAnalytics(prev => !prev)}
              accessibilityRole="button"
              accessibilityLabel="Toggle analytics panel"
              accessibilityHint="Shows or hides recent analytics events"
            >
              <Text style={styles.linkText}>{showAnalytics ? 'Hide Analytics' : 'Show Analytics'}</Text>
            </TouchableOpacity>

            {showAnalytics && (
              <View style={styles.analyticsBox}>
                {analyticsKPIs && (
                  <View style={styles.kpiRow}>
                    <View style={styles.kpiCard}>
                      <Text style={styles.kpiValue}>{analyticsKPIs.starts}</Text>
                      <Text style={styles.kpiLabel}>Starts</Text>
                    </View>
                    <View style={styles.kpiCard}>
                      <Text style={styles.kpiValue}>{analyticsKPIs.completions}</Text>
                      <Text style={styles.kpiLabel}>Completions</Text>
                    </View>
                    <View style={styles.kpiCard}>
                      <Text style={styles.kpiValue}>{analyticsKPIs.timeoutRate}</Text>
                      <Text style={styles.kpiLabel}>Timeout Rate</Text>
                    </View>
                    <View style={styles.kpiCard}>
                      <Text style={styles.kpiValue}>{analyticsKPIs.hintRate}</Text>
                      <Text style={styles.kpiLabel}>Hint Rate</Text>
                    </View>
                  </View>
                )}

                <View style={styles.analyticsHeaderRow}>
                  <Text style={styles.analyticsTitle}>Recent Events ({analyticsEvents.length})</Text>
                  <View style={styles.analyticsActions}>
                    <TouchableOpacity style={styles.analyticsBtn} onPress={refreshAnalytics}>
                      <Text style={styles.analyticsBtnText}>Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.analyticsBtn} onPress={handleExportAnalytics}>
                      <Text style={styles.analyticsBtnText}>Export</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.analyticsBtn, styles.analyticsDangerBtn]} onPress={handleClearAnalytics}>
                      <Text style={styles.analyticsDangerText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {analyticsEvents.length === 0 ? (
                  <Text style={styles.analyticsEmpty}>No events yet.</Text>
                ) : (
                  analyticsEvents.map((event) => (
                    <View key={event.id} style={styles.analyticsEventCard}>
                      <Text style={styles.analyticsEventName}>{event.name}</Text>
                      <Text style={styles.analyticsEventMeta}>{event.timestamp}</Text>
                      <Text style={styles.analyticsEventMeta}>{JSON.stringify(event.params)}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>Bible Trivia v1.0.0</Text>
            <Text style={styles.aboutSubtext}>Test your knowledge of Scripture</Text>
          </View>
          <TouchableOpacity style={styles.linkBtn} onPress={openPrivacyPolicy}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: colors.primary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  placeholder: { width: 60 },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 12, letterSpacing: 2, color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: 14,
  },
  authBox: {
    backgroundColor: colors.card, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  authDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 16, lineHeight: 18 },
  authWarning: { fontSize: 12, color: colors.warning, marginBottom: 12, lineHeight: 18 },
  appleBtn: {
    backgroundColor: '#000000', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginBottom: 10,
  },
  appleBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  googleBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#DDDDDD',
  },
  googleBtnText: { color: '#444444', fontSize: 15, fontWeight: '600' },
  authBtnDisabled: { opacity: 0.45 },
  userBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  userName: { fontSize: 16, color: colors.text, fontWeight: '700' },
  userEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  logoutBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.error },
  logoutText: { color: colors.error, fontSize: 13, fontWeight: '500' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  rowText: { flex: 1, marginRight: 12 },
  rowLabel: { fontSize: 15, color: colors.text, fontWeight: '500' },
  rowDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionBtn: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: colors.card, borderRadius: 10,
    borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center',
  },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { fontSize: 14, color: colors.textSecondary },
  optionTextActive: { color: colors.background, fontWeight: '600' },
  dangerBtn: {
    backgroundColor: colors.error, borderRadius: 12, padding: 16,
    alignItems: 'center',
  },
  dangerBtnText: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
  aboutBox: { backgroundColor: colors.card, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  aboutText: { fontSize: 16, color: colors.text, fontWeight: '600' },
  aboutSubtext: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  linkBtn: {
    backgroundColor: colors.card, borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, marginTop: 10,
  },
  linkText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  analyticsBox: {
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
  },
  analyticsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analyticsTitle: { fontSize: 13, color: colors.text, fontWeight: '600' },
  analyticsActions: { flexDirection: 'row', gap: 8 },
  analyticsBtn: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
  },
  analyticsBtnText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  analyticsDangerBtn: { borderColor: colors.error + '70' },
  analyticsDangerText: { fontSize: 12, color: colors.error, fontWeight: '500' },
  analyticsEmpty: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  kpiCard: {
    flex: 1, alignItems: 'center', backgroundColor: colors.background,
    borderRadius: 10, borderWidth: 1, borderColor: colors.cardBorder, padding: 10,
  },
  kpiValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  kpiLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  analyticsEventCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  analyticsEventName: { fontSize: 12, color: colors.text, fontWeight: '600', marginBottom: 2 },
  analyticsEventMeta: { fontSize: 11, color: colors.textSecondary },
});
