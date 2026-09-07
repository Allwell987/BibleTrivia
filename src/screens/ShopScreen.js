import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import {
  getAvailableCoinPackages,
  purchaseProduct,
  restorePurchases,
  getProOfferings,
  presentPaywall,
  PRODUCT_CONFIG
} from '../utils/purchases';
import { trackEvent } from '../utils/analytics';
import { showRewardedAd, isAdsAvailable } from '../utils/ads';

export default function ShopScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress, addCoins, setProStatus, showUpgradeWall } = useProgress();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [adLoading, setAdLoading] = useState(false);

  const coinPackages = packages.filter(pkg => PRODUCT_CONFIG[pkg.productId]?.coins);
  const proPackages = packages.filter(pkg => PRODUCT_CONFIG[pkg.productId]?.isPro);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const [coins, pros] = await Promise.all([
        getAvailableCoinPackages(),
        getProOfferings()
      ]);
      setPackages([...pros, ...coins]);
      trackEvent('shop_offerings_loaded', {
        pro_count: pros.length,
        coin_count: coins.length,
      });
    } catch (error) {
      console.error('Failed to load offerings:', error);
      trackEvent('shop_offerings_load_failed', {
        reason: error?.message || 'unknown_error',
      });
      Alert.alert('Error', 'Failed to load store items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg) => {
    const productId = pkg.productId;
    try {
      setPurchasing(productId);
      
      const result = await purchaseProduct(pkg);
      
      if (result.success) {
        if (result.isPro) {
          await setProStatus(true);
          trackEvent('pro_upgrade', { product_id: productId });
          Alert.alert('Welcome to Pro! 👑', 'All pro features have been unlocked.');
        } else {
          // Add coins to user's account
          await addCoins(result.coins);

          // Track purchase event
          trackEvent('coin_purchase', {
            product_id: productId,
            coins_purchased: result.coins,
            coins_total: progress.coins + result.coins,
          });

          Alert.alert(
            'Purchase Successful! 🎉',
            `You've received ${result.coins} coins!`,
            [{ text: 'OK' }]
          );
        }
      } else if (result.cancelled) {
        // User closed native purchase sheet; this is expected and should stay silent.
        trackEvent('shop_purchase_cancelled', { product_id: productId });
        return;
      } else {
        trackEvent('shop_purchase_failed', {
          product_id: productId,
          reason: result.error || 'unknown_error',
        });
        Alert.alert('Purchase Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      trackEvent('shop_purchase_failed', {
        product_id: productId,
        reason: error?.message || 'unexpected_error',
      });
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setRestoring(true);
      const result = await restorePurchases();
      
      if (result.success) {
        if (result.isProRestored) {
          await setProStatus(true);
        }
        if (result.coinsRestored > 0) {
          await addCoins(result.coinsRestored);
        }

        trackEvent('shop_restore_completed', {
          is_pro_restored: !!result.isProRestored,
          coins_restored: result.coinsRestored || 0,
        });

        if (result.isProRestored || result.coinsRestored > 0) {
          Alert.alert(
            'Purchases Restored',
            'Your previous purchases have been restored to your account.'
          );
        } else {
          trackEvent('shop_restore_noop');
          Alert.alert('No Purchases to Restore', 'No previous purchases found.');
        }
      } else {
        trackEvent('shop_restore_failed', {
          reason: result.error || 'no_previous_purchases',
        });
        Alert.alert('No Purchases to Restore', 'No previous purchases found.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      trackEvent('shop_restore_failed', {
        reason: error?.message || 'unexpected_error',
      });
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  const handleWatchAd = () => {
    if (!isAdsAvailable) {
      Alert.alert('Ads Unavailable', 'Please try again later or check your internet connection.');
      return;
    }

    setAdLoading(true);
    const cleanup = showRewardedAd(async (success, meta) => {
      setAdLoading(false);
      cleanup();

      if (success) {
        const rewardAmount = 25;
        await addCoins(rewardAmount);
        trackEvent('rewarded_ad_complete', {
          reward_amount: rewardAmount,
          coins_total: progress.coins + rewardAmount,
        });
        Alert.alert('Success! 🎉', `You've earned ${rewardAmount} coins!`);
      } else if (meta?.reason !== 'closed') {
        Alert.alert('Error', 'Failed to load video. Please try again.');
      }
    });
  };

  const handlePaywallUpgrade = async () => {
    try {
      setPurchasing('paywall');
      const result = await presentPaywall();

      if (result === 'fallback') {
        // Fallback to internal Upgrade Wall if native RC UI is not supported (e.g. Expo Go)
        showUpgradeWall();
      } else if (result === true) {
        await setProStatus(true);
        trackEvent('pro_upgrade', { source: 'paywall' });
        Alert.alert('Welcome to Pro! 👑', 'All pro features have been unlocked.');
      } else {
        // Cancelled or generic failure
        trackEvent('paywall_closed', { upgraded: false });
      }
    } catch (error) {
      console.error('Paywall error:', error);
      Alert.alert('Error', 'Unable to open paywall right now. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.accent }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Coin Shop</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.card }]}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Current Balance</Text>
              <Text style={[styles.balanceAmount, { color: colors.accent }]}>
                {progress.coins.toLocaleString()} 💰
              </Text>
            </View>
            {progress.isPro && (
              <View style={[styles.proBadge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.proBadgeText, { color: colors.background }]}>PRO</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pro Subscription Section */}
        {!progress.isPro && proPackages.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Unlock Bible Trivia Pro</Text>
            <View style={[styles.proFeaturesBox, { backgroundColor: colors.card, borderColor: colors.accent }]}>
              {isAdsAvailable && <Text style={[styles.featureItem, { color: colors.text }]}>✅ No Ads</Text>}
              <Text style={[styles.featureItem, { color: colors.text }]}>✅ Unlimited Hints</Text>
              <Text style={[styles.featureItem, { color: colors.text }]}>✅ Exclusive Journey Eras</Text>
              <Text style={[styles.featureItem, { color: colors.text }]}>✅ Support the Ministry</Text>
            </View>

            {proPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.productId}
                onPress={() => handlePurchase(pkg)}
                disabled={purchasing === pkg.productId}
                style={[
                  styles.packageCard,
                  { backgroundColor: colors.card, borderColor: colors.accent },
                  purchasing === pkg.productId && styles.packageCardDisabled,
                ]}
              >
                <View style={[styles.packageHeader, { flex: 1 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.packageTitle, { color: colors.text }]} numberOfLines={2}>
                      {pkg.title}
                    </Text>
                    {pkg.productId.includes('yearly') && (
                      <View style={[styles.bonusBadge, { backgroundColor: colors.accent, alignSelf: 'flex-start', marginLeft: 0, marginTop: 4 }]}>
                        <Text style={[styles.bonusText, { color: colors.background }]}>BEST VALUE</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={[styles.packageFooter, { marginLeft: 12 }]}>
                  <Text style={[styles.price, { color: colors.accent }]}>{pkg.price}</Text>
                  {purchasing === pkg.productId ? (
                    <ActivityIndicator size="small" color={colors.accent} />
                  ) : (
                    <View style={[styles.buyButton, { backgroundColor: colors.accent }]}>
                      <Text style={[styles.buyButtonText, { color: colors.background }]}>Upgrade</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {!progress.isPro && proPackages.length === 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Unlock Bible Trivia Pro</Text>
            <TouchableOpacity
              onPress={handlePaywallUpgrade}
              disabled={purchasing === 'paywall'}
              style={[
                styles.packageCard,
                { backgroundColor: colors.card, borderColor: colors.accent },
                purchasing === 'paywall' && styles.packageCardDisabled,
              ]}
            >
              <View style={[styles.packageHeader, { flex: 1 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.packageTitle, { color: colors.text }]} numberOfLines={2}>
                    Upgrade with Paywall
                  </Text>
                  <View style={[styles.bonusBadge, { backgroundColor: colors.accent, alignSelf: 'flex-start', marginLeft: 0, marginTop: 4 }]}>
                    <Text style={[styles.bonusText, { color: colors.background }]}>RECOMMENDED</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.packageFooter, { marginLeft: 12 }]}>
                <Text style={[styles.price, { color: colors.textSecondary }]}>All Options</Text>
                {purchasing === 'paywall' ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <View style={[styles.buyButton, { backgroundColor: colors.accent }]}> 
                    <Text style={[styles.buyButtonText, { color: colors.background }]}>Open</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Free Coins Section */}
        {!progress.isPro && isAdsAvailable && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 12 }]}>Free Coins</Text>
            <TouchableOpacity
              onPress={handleWatchAd}
              disabled={adLoading}
              style={[
                styles.packageCard,
                { backgroundColor: colors.card, borderColor: '#4CAF50' },
                adLoading && styles.packageCardDisabled,
              ]}
            >
              <View style={[styles.packageHeader, { flex: 1 }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.packageCoins, { color: '#4CAF50' }]}>25</Text>
                    <Text style={[styles.packageLabel, { color: colors.textSecondary, marginLeft: 8 }]}>Coins</Text>
                  </View>
                  <View style={[styles.bonusBadge, { backgroundColor: '#4CAF50', alignSelf: 'flex-start', marginLeft: 0, marginTop: 4 }]}>
                    <Text style={[styles.bonusText, { color: '#FFF' }]}>FREE</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.packageFooter, { marginLeft: 12 }]}>
                <Text style={[styles.price, { color: colors.text }]}>Watch Video</Text>
                {adLoading ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <View style={[styles.buyButton, { backgroundColor: '#4CAF50' }]}>
                    <Text style={[styles.buyButtonText, { color: '#FFF' }]}>Play</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Coin Packages */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Buy Coins</Text>
        
        {coinPackages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No packages available at the moment
            </Text>
          </View>
        ) : (
          coinPackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.productId}
              onPress={() => handlePurchase(pkg)}
              disabled={purchasing === pkg.productId}
              style={[
                styles.packageCard,
                { backgroundColor: colors.card, borderColor: colors.accent },
                purchasing === pkg.productId && styles.packageCardDisabled,
              ]}
            >
              {/* Coin amount and bonus badge */}
              <View style={[styles.packageHeader, { flex: 1 }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.packageCoins, { color: colors.accent }]}>
                      {pkg.coins.toLocaleString()}
                    </Text>
                    <Text style={[styles.packageLabel, { color: colors.textSecondary, marginLeft: 8 }]}>
                      Coins
                    </Text>
                  </View>

                  {/* Bonus badge for larger packages */}
                  {pkg.coins >= 3000 && (
                    <View style={[styles.bonusBadge, { backgroundColor: colors.accent, alignSelf: 'flex-start', marginLeft: 0, marginTop: 4 }]}>
                      <Text style={[styles.bonusText, { color: colors.background }]}>
                        BEST VALUE
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Price and button */}
              <View style={[styles.packageFooter, { marginLeft: 12 }]}>
                <Text style={[styles.price, { color: colors.text }]}>
                  {pkg.price}
                </Text>
                {purchasing === pkg.productId ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <View
                    style={[
                      styles.buyButton,
                      { backgroundColor: colors.accent },
                    ]}
                  >
                    <Text style={[styles.buyButtonText, { color: colors.background }]}>
                      Buy
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Info Section */}
        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.textSecondary }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>ℹ️ About Coins</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Use coins to purchase hints during quizzes{'\n'}
            • Earn free coins by completing daily rewards{'\n'}
            • Coins are saved to your account across devices{'\n'}
            • No expiration - keep them as long as you want
          </Text>
        </View>

        {/* Restore Purchases Button */}
        <TouchableOpacity
          onPress={handleRestorePurchases}
          disabled={restoring}
          style={[
            styles.restoreButton,
            { backgroundColor: colors.card, borderColor: colors.textSecondary },
          ]}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Text style={[styles.restoreButtonText, { color: colors.accent }]}>
              Restore Previous Purchases
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  proBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  proFeaturesBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  packageCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageCardDisabled: {
    opacity: 0.6,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packageCoins: {
    fontSize: 28,
    fontWeight: '700',
  },
  packageLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  bonusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  bonusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  packageFooter: {
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 24,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  restoreButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
