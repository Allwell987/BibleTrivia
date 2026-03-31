import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { getAvailableCoinPackages, purchaseCoinPackage, restorePurchases } from '../utils/purchases';
import { trackEvent } from '../utils/analytics';

export default function ShopScreen({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress, addCoins } = useProgress();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadCoinPackages();
  }, []);

  const loadCoinPackages = async () => {
    try {
      setLoading(true);
      const availablePackages = await getAvailableCoinPackages();
      setPackages(availablePackages);
    } catch (error) {
      console.error('Failed to load coin packages:', error);
      Alert.alert('Error', 'Failed to load coin packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId) => {
    try {
      setPurchasing(productId);
      
      const result = await purchaseCoinPackage(productId);
      
      if (result.success) {
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
      } else {
        Alert.alert('Purchase Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setRestoring(true);
      const result = await restorePurchases();
      
      if (result.success && result.coinsRestored > 0) {
        await addCoins(result.coinsRestored);
        Alert.alert(
          'Purchases Restored',
          `${result.coinsRestored} coins have been restored to your account.`
        );
      } else {
        Alert.alert('No Purchases to Restore', 'No previous purchases found.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setRestoring(false);
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
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.accent }]}>
            {progress.coins.toLocaleString()} 💰
          </Text>
        </View>

        {/* Coin Packages */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose a Package</Text>
        
        {packages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No packages available at the moment
            </Text>
          </View>
        ) : (
          packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.productId}
              onPress={() => handlePurchase(pkg.productId)}
              disabled={purchasing === pkg.productId}
              style={[
                styles.packageCard,
                { backgroundColor: colors.card, borderColor: colors.accent },
                purchasing === pkg.productId && styles.packageCardDisabled,
              ]}
            >
              {/* Coin amount and bonus badge */}
              <View style={styles.packageHeader}>
                <View>
                  <Text style={[styles.packageCoins, { color: colors.accent }]}>
                    {pkg.coins.toLocaleString()}
                  </Text>
                  <Text style={[styles.packageLabel, { color: colors.textSecondary }]}>
                    Coins
                  </Text>
                </View>
                
                {/* Bonus badge for larger packages */}
                {pkg.coins >= 3000 && (
                  <View style={[styles.bonusBadge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.bonusText, { color: colors.background }]}>
                      BEST VALUE
                    </Text>
                  </View>
                )}
              </View>

              {/* Price and button */}
              <View style={styles.packageFooter}>
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
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
