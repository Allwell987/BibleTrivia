import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { trackEvent } from './analytics';

let Purchases = null;
let RevenueCatUI = null;

if (Platform.OS !== 'web') {
  try {
    const PurchasesModule = require('react-native-purchases');
    Purchases = PurchasesModule.default || PurchasesModule;

    const RevenueCatUIModule = require('react-native-purchases-ui');
    RevenueCatUI = RevenueCatUIModule.default || RevenueCatUIModule;
  } catch (error) {
    if (__DEV__) {
      console.log('RevenueCat native modules unavailable in this environment.');
    }
  }
}

// NOTE: For production builds, use platform public SDK keys from RevenueCat dashboard.
const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || 'test_gxRnMpjvLZJXAQdYMWRxMUmUctc',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || 'test_gxRnMpjvLZJXAQdYMWRxMUmUctc',
});

const isInvalidRevenueCatKey = (key) =>
  !key ||
  typeof key !== 'string' ||
  key.includes('YOUR_') ||
  key.startsWith('test_');

// Product requirement: entitlement name should be exactly "Bible Trivia Pro".
const ENTITLEMENT_ID = 'Bible Trivia Pro';
const PURCHASES_KEY = 'bible_trivia_purchases';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_PURCHASES === 'true';

const MOCK_CUSTOMER_INFO = {
  entitlements: {
    active: USE_MOCK && process.env.EXPO_PUBLIC_MOCK_PRO === 'true' ? { [ENTITLEMENT_ID]: {} } : {},
  },
};

export const PRODUCT_CONFIG = {
  'com.iguruapp.bibletrivia.coins_250': { coins: 250 },
  'com.iguruapp.bibletrivia.coins_500': { coins: 500 },
  'com.iguruapp.bibletrivia.coins_1200': { coins: 1200 },
  'com.iguruapp.bibletrivia.coins_3000': { coins: 3000 },
  'com.iguruapp.bibletrivia.coins_7500': { coins: 7500 },
  'com.iguruapp.bibletrivia.pro_monthly': { isPro: true, packageType: 'monthly' },
  'com.iguruapp.bibletrivia.pro_yearly': { isPro: true, packageType: 'yearly' },
  'com.iguruapp.bibletrivia.pro_lifetime': { isPro: true, packageType: 'lifetime' },
};

let connectionInitialized = false;

const safeTrack = (name, params = {}) => {
  trackEvent(name, params).catch(() => {});
};

const savePurchaseRecord = async ({ productId, transactionId, coins = 0, isPro = false }) => {
  try {
    if (!productId) return;
    const existing = await getPurchaseHistory();
    const record = {
      productId,
      transactionId: transactionId || null,
      coins,
      isPro,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify([record, ...existing]));
  } catch (error) {
    console.warn('Failed to save purchase history:', error?.message || error);
  }
};

const hasProEntitlement = (customerInfo) =>
  !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

const isPurchasesAvailable = () => USE_MOCK || !!Purchases;

/**
 * Initialize RevenueCat SDK
 */
export async function initializePurchases(userId) {
  try {
    safeTrack('rc_init_started', {
      platform: Platform.OS,
      is_mock: USE_MOCK,
      has_user: !!userId,
    });

    if (USE_MOCK) {
      console.log('✨ RevenueCat initialized (MOCK MODE)');
      safeTrack('rc_init_succeeded', { mode: 'mock' });
      connectionInitialized = true;
      return true;
    }

    if (!isPurchasesAvailable()) {
      safeTrack('rc_init_failed', { reason: 'module_unavailable' });
      return false;
    }

    if (connectionInitialized) {
      if (userId) {
        await Purchases.logIn(String(userId));
      }
      safeTrack('rc_init_succeeded', { mode: 'reused_session' });
      return true;
    }

    if (!__DEV__ && isInvalidRevenueCatKey(REVENUECAT_API_KEY)) {
      console.error('⚠️ RevenueCat initialization blocked: missing production API key.');
      safeTrack('rc_init_failed', { reason: 'invalid_production_key' });
      return false;
    }

    if (__DEV__) {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    if (userId) {
      await Purchases.logIn(String(userId));
    }

    connectionInitialized = true;
    console.log('✅ RevenueCat initialized');
    safeTrack('rc_init_succeeded', { mode: 'configured' });
    return true;
  } catch (error) {
    console.error('⚠️ Failed to initialize RevenueCat:', error?.message || error);
    safeTrack('rc_init_failed', {
      reason: error?.message || 'unknown_error',
    });
    return false;
  }
}

export async function identifyPurchasesUser(userId) {
  try {
    if (USE_MOCK) return;
    if (!isPurchasesAvailable()) return;
    if (!userId) return;
    if (!connectionInitialized) {
      await initializePurchases(userId);
      return;
    }
    await Purchases.logIn(String(userId));
    safeTrack('rc_user_identified', { has_user: true });
  } catch (e) {
    console.error('RevenueCat logIn failed:', e?.message || e);
    safeTrack('rc_user_identify_failed', { reason: e?.message || 'unknown_error' });
  }
}

export async function clearPurchasesUser() {
  try {
    if (USE_MOCK) return;
    if (!isPurchasesAvailable()) return;
    if (!connectionInitialized) return;
    await Purchases.logOut();
    safeTrack('rc_user_cleared');
  } catch (e) {
    console.error('RevenueCat logOut failed:', e?.message || e);
    safeTrack('rc_user_clear_failed', { reason: e?.message || 'unknown_error' });
  }
}

export function subscribeToCustomerInfo(onUpdate) {
  try {
    if (USE_MOCK) {
      setTimeout(() => onUpdate?.({ customerInfo: MOCK_CUSTOMER_INFO, isPro: hasProEntitlement(MOCK_CUSTOMER_INFO) }), 100);
      return () => {};
    }
    if (!isPurchasesAvailable()) return () => {};

    const listener = (customerInfo) => {
      onUpdate?.({ customerInfo, isPro: hasProEntitlement(customerInfo) });
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      if (typeof Purchases.removeCustomerInfoUpdateListener === 'function') {
        Purchases.removeCustomerInfoUpdateListener(listener);
      }
    };
  } catch (e) {
    console.error('Customer info listener failed:', e?.message || e);
    return () => {};
  }
}

/**
 * Check if user has active "Bible Trivia Pro" entitlement
 */
export async function checkProStatus() {
  try {
    if (USE_MOCK) return hasProEntitlement(MOCK_CUSTOMER_INFO);
    if (!isPurchasesAvailable()) return false;
    const customerInfo = await Purchases.getCustomerInfo();
    return hasProEntitlement(customerInfo);
  } catch (e) {
    console.error('Error checking pro status:', e);
    return false;
  }
}

export async function getCustomerInfo() {
  try {
    if (USE_MOCK) return MOCK_CUSTOMER_INFO;
    if (!isPurchasesAvailable()) return null;
    return await Purchases.getCustomerInfo();
  } catch (e) {
    console.error('Error fetching customer info:', e);
    return null;
  }
}

/**
 * Fetch available offerings (Monthly, Yearly, Lifetime)
 */
export async function getOfferings() {
  try {
    if (USE_MOCK) return []; // Mocks could be expanded here if needed
    if (!isPurchasesAvailable()) return [];
    safeTrack('rc_offerings_fetch_started', { source: 'all' });
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      safeTrack('rc_offerings_fetch_succeeded', {
        source: 'all',
        package_count: offerings.current.availablePackages.length,
      });
      return offerings.current.availablePackages;
    }
    safeTrack('rc_offerings_fetch_empty', { source: 'all', reason: 'no_current_offering' });
    return [];
  } catch (e) {
    console.error('Error fetching offerings:', e);
    safeTrack('rc_offerings_fetch_failed', {
      source: 'all',
      reason: e?.message || 'unknown_error',
    });
    return [];
  }
}

const isProPackage = (pkg) => {
  const type = String(pkg?.identifier || '').toLowerCase();
  const productId = pkg?.product?.identifier;
  return (
    type === 'monthly' ||
    type === 'yearly' ||
    type === 'lifetime' ||
    !!PRODUCT_CONFIG[productId]?.isPro
  );
};

/**
 * Helper for ShopScreen to get pro offerings specifically
 */
export async function getProOfferings() {
  try {
    if (USE_MOCK) {
      return [
        { productId: 'com.iguruapp.bibletrivia.pro_monthly', title: 'Pro Monthly (Mock)', price: '$4.99', packageId: 'monthly' },
        { productId: 'com.iguruapp.bibletrivia.pro_yearly', title: 'Pro Yearly (Mock)', price: '$29.99', packageId: 'yearly' },
      ];
    }
    if (!isPurchasesAvailable()) return [];
    safeTrack('rc_offerings_fetch_started', { source: 'pro' });
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      const proPackages = offerings.current.availablePackages
        .filter(isProPackage)
        .map((pkg) => ({
          productId: pkg.product.identifier,
          title: pkg.product.title,
          price: pkg.product.priceString,
          packageId: pkg.identifier,
          package: pkg,
        }));
      if (proPackages.length === 0) {
        safeTrack('rc_offerings_fetch_empty', { source: 'pro', reason: 'no_matching_products' });
      } else {
        safeTrack('rc_offerings_fetch_succeeded', {
          source: 'pro',
          package_count: proPackages.length,
        });
      }
      return proPackages;
    }
    safeTrack('rc_offerings_fetch_empty', { source: 'pro', reason: 'no_current_offering' });
    return [];
  } catch (e) {
    console.error('Error fetching pro offerings:', e);
    safeTrack('rc_offerings_fetch_failed', {
      source: 'pro',
      reason: e?.message || 'unknown_error',
    });
    return [];
  }
}

/**
 * Fetch available coin packages
 */
export async function getAvailableCoinPackages() {
  try {
    if (USE_MOCK) {
      return [
        { productId: 'com.iguruapp.bibletrivia.coins_500', title: '500 Coins (Mock)', price: '$0.99', coins: 500 },
        { productId: 'com.iguruapp.bibletrivia.coins_1200', title: '1200 Coins (Mock)', price: '$2.99', coins: 1200 },
        { productId: 'com.iguruapp.bibletrivia.coins_3000', title: '3000 Coins (Mock)', price: '$4.99', coins: 3000 },
      ];
    }
    if (!isPurchasesAvailable()) return [];
    safeTrack('rc_offerings_fetch_started', { source: 'coins' });
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      const coinPackages = offerings.current.availablePackages
        .filter((pkg) => PRODUCT_CONFIG[pkg.product.identifier]?.coins)
        .map((pkg) => ({
          productId: pkg.product.identifier,
          title: pkg.product.title,
          price: pkg.product.priceString,
          coins: PRODUCT_CONFIG[pkg.product.identifier].coins,
          package: pkg,
        }));
      if (coinPackages.length === 0) {
        safeTrack('rc_offerings_fetch_empty', { source: 'coins', reason: 'no_matching_products' });
      } else {
        safeTrack('rc_offerings_fetch_succeeded', {
          source: 'coins',
          package_count: coinPackages.length,
        });
      }
      return coinPackages;
    }
    safeTrack('rc_offerings_fetch_empty', { source: 'coins', reason: 'no_current_offering' });
    return [];
  } catch (e) {
    console.error('Error fetching coin packages:', e);
    safeTrack('rc_offerings_fetch_failed', {
      source: 'coins',
      reason: e?.message || 'unknown_error',
    });
    return [];
  }
}

/**
 * Purchase a package or product id
 */
export async function purchaseProduct(pkgOrId) {
  const productId = typeof pkgOrId === 'string'
    ? pkgOrId
    : (pkgOrId?.productId || pkgOrId?.product?.identifier || 'unknown_product');

  try {
    safeTrack('rc_purchase_started', { product_id: productId });

    if (USE_MOCK) {
      const config = PRODUCT_CONFIG[productId] || {};
      const isPro = !!config.isPro;
      const coins = config.coins || 0;
      await savePurchaseRecord({
        productId,
        transactionId: `mock_${Date.now()}`,
        coins,
        isPro,
      });
      console.log('🛒 Mock purchase successful:', productId);
      safeTrack('rc_purchase_succeeded', {
        product_id: productId,
        is_pro: isPro,
        coins,
        mode: 'mock',
      });
      return {
        success: true,
        isPro,
        coins,
        customerInfo: MOCK_CUSTOMER_INFO,
      };
    }
    if (!isPurchasesAvailable()) {
      safeTrack('rc_purchase_failed', {
        product_id: productId,
        reason: 'module_unavailable',
      });
      return {
        success: false,
        error: 'Purchases module unavailable',
        cancelled: false,
      };
    }

    let purchaseResult;
    if (typeof pkgOrId === 'string') {
      purchaseResult = await Purchases.purchaseStoreProduct(pkgOrId);
    } else if (pkgOrId?.package) {
      purchaseResult = await Purchases.purchasePackage(pkgOrId.package);
    } else {
      purchaseResult = await Purchases.purchasePackage(pkgOrId);
    }

    const { customerInfo } = purchaseResult;
    const isPro = hasProEntitlement(customerInfo);

    const coins = PRODUCT_CONFIG[productId]?.coins || 0;
    const transactionId =
      purchaseResult?.transaction?.transactionIdentifier ||
      purchaseResult?.transaction?.purchaseToken ||
      purchaseResult?.productIdentifier ||
      null;

    await savePurchaseRecord({
      productId,
      transactionId,
      coins,
      isPro,
    });

    safeTrack('rc_purchase_succeeded', {
      product_id: productId,
      is_pro: isPro,
      coins,
      has_transaction_id: !!transactionId,
    });

    return {
      success: true,
      isPro,
      coins,
      customerInfo,
    };
  } catch (error) {
    if (!error?.userCancelled) {
      console.error('Purchase error:', error);
      safeTrack('rc_purchase_failed', {
        product_id: productId,
        reason: error?.message || 'purchase_failed',
      });
    } else {
      safeTrack('rc_purchase_cancelled', { product_id: productId });
    }
    return {
      success: false,
      error: error?.message || 'purchase_failed',
      cancelled: !!error?.userCancelled,
    };
  }
}

/**
 * Alias for purchaseProduct to match older calls
 */
export async function purchaseCoinPackage(productId) {
  return purchaseProduct(productId);
}

/**
 * Restore previous purchases
 */
export async function restorePurchases() {
  try {
    if (USE_MOCK) {
      safeTrack('rc_restore_succeeded', { mode: 'mock' });
      return {
        success: true,
        isProRestored: hasProEntitlement(MOCK_CUSTOMER_INFO),
        customerInfo: MOCK_CUSTOMER_INFO,
        coinsRestored: 0,
      };
    }
    if (!isPurchasesAvailable()) {
      safeTrack('rc_restore_failed', { reason: 'module_unavailable' });
      return { success: false, error: 'Purchases module unavailable' };
    }

    const customerInfo = await Purchases.restorePurchases();
    const isProRestored = hasProEntitlement(customerInfo);
    safeTrack('rc_restore_succeeded', {
      is_pro_restored: isProRestored,
    });

    return {
      success: true,
      isProRestored,
      customerInfo,
      coinsRestored: 0,
    };
  } catch (error) {
    console.error('Restore error:', error);
    safeTrack('rc_restore_failed', { reason: error?.message || 'restore_failed' });
    return { success: false, error: error?.message || 'restore_failed' };
  }
}

/**
 * Show RevenueCat Paywall
 */
export async function presentPaywall() {
  try {
    safeTrack('rc_paywall_open_started');
    if (USE_MOCK) {
      Alert.alert('Mock Paywall', 'Select outcome:', [
        { text: 'Upgrade Success', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]);
      safeTrack('rc_paywall_open_succeeded', { mode: 'mock' });
      return true; // Simplified mock
    }
    if (Platform.OS === 'web') {
      console.warn('RevenueCat Paywalls are not supported on web environment.');
      safeTrack('rc_paywall_open_failed', { reason: 'web_unsupported' });
      return false;
    }

    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      console.warn('RevenueCat Paywalls are not supported in Expo Go. Use a development build (npx expo run:ios/android) to test Paywalls.');
      safeTrack('rc_paywall_open_failed', { reason: 'expo_go_unsupported' });
      return false;
    }

    if (!RevenueCatUI || !isPurchasesAvailable()) {
      console.warn('RevenueCatUI or Purchases module not available.');
      safeTrack('rc_paywall_open_failed', { reason: 'module_unavailable' });
      return false;
    }

    if (typeof RevenueCatUI.presentPaywall !== 'function') {
      console.warn('RevenueCatUI.presentPaywall is not a function.');
      safeTrack('rc_paywall_open_failed', { reason: 'missing_present_paywall' });
      return false;
    }

    await RevenueCatUI.presentPaywall();

    // Refresh customer info after paywall closes
    const customerInfo = await Purchases.getCustomerInfo();
    const isPro = hasProEntitlement(customerInfo);
    safeTrack('rc_paywall_open_succeeded', { upgraded: isPro });
    return isPro;
  } catch (e) {
    // Check for the specific "browser environment" error to provide better feedback
    if (e?.message?.includes('browser environment') || e?.message?.includes('document is not available')) {
      console.error('RevenueCat Error: The SDK is trying to use a web implementation in a native environment. This usually means native modules are not correctly linked or the bundler is misconfigured, or you are running in Expo Go.');
    } else {
      console.error('Paywall error:', e);
    }
    safeTrack('rc_paywall_open_failed', { reason: e?.message || 'paywall_error' });
    return false;
  }
}

/**
 * Show Customer Center (for subscription management)
 */
export async function presentCustomerCenter() {
  if (USE_MOCK) {
    Alert.alert('Mock Customer Center', 'This would show subscription management.');
    return;
  }
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      if (!RevenueCatUI) return;
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      console.error('Customer Center error:', e);
    }
  }
}

export async function getPurchaseHistory() {
  try {
    const history = await AsyncStorage.getItem(PURCHASES_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    return [];
  }
}
