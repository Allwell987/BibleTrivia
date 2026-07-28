import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

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
  key.includes('YOUR_');

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

const hasProEntitlement = (customerInfo) =>
  !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

const isPurchasesAvailable = () => USE_MOCK || !!Purchases;

/**
 * Initialize RevenueCat SDK
 */
export async function initializePurchases(userId) {
  try {
    if (USE_MOCK) {
      console.log('✨ RevenueCat initialized (MOCK MODE)');
      connectionInitialized = true;
      return true;
    }

    if (!isPurchasesAvailable()) return false;

    if (connectionInitialized) {
      if (userId) {
        await Purchases.logIn(String(userId));
      }
      return true;
    }

    if (!__DEV__ && isInvalidRevenueCatKey(REVENUECAT_API_KEY)) {
      console.error('⚠️ RevenueCat initialization blocked: missing production API key.');
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
    return true;
  } catch (error) {
    console.error('⚠️ Failed to initialize RevenueCat:', error?.message || error);
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
  } catch (e) {
    console.error('RevenueCat logIn failed:', e?.message || e);
  }
}

export async function clearPurchasesUser() {
  try {
    if (USE_MOCK) return;
    if (!isPurchasesAvailable()) return;
    if (!connectionInitialized) return;
    await Purchases.logOut();
  } catch (e) {
    console.error('RevenueCat logOut failed:', e?.message || e);
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
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (e) {
    console.error('Error fetching offerings:', e);
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
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages
        .filter(isProPackage)
        .map((pkg) => ({
          productId: pkg.product.identifier,
          title: pkg.product.title,
          price: pkg.product.priceString,
          packageId: pkg.identifier,
          package: pkg,
        }));
    }
    return [];
  } catch (e) {
    console.error('Error fetching pro offerings:', e);
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
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages
        .filter((pkg) => PRODUCT_CONFIG[pkg.product.identifier]?.coins)
        .map((pkg) => ({
          productId: pkg.product.identifier,
          title: pkg.product.title,
          price: pkg.product.priceString,
          coins: PRODUCT_CONFIG[pkg.product.identifier].coins,
          package: pkg,
        }));
    }
    return [];
  } catch (e) {
    console.error('Error fetching coin packages:', e);
    return [];
  }
}

/**
 * Purchase a package or product id
 */
export async function purchaseProduct(pkgOrId) {
  try {
    if (USE_MOCK) {
      const productId = typeof pkgOrId === 'string' ? pkgOrId : (pkgOrId?.productId || '');
      const config = PRODUCT_CONFIG[productId] || {};
      console.log('🛒 Mock purchase successful:', productId);
      return {
        success: true,
        isPro: !!config.isPro,
        coins: config.coins || 0,
        customerInfo: MOCK_CUSTOMER_INFO,
      };
    }
    if (!isPurchasesAvailable()) {
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

    const productId = typeof pkgOrId === 'string'
      ? pkgOrId
      : (pkgOrId?.productId || pkgOrId?.product?.identifier || '');
    const coins = PRODUCT_CONFIG[productId]?.coins || 0;

    return {
      success: true,
      isPro,
      coins,
      customerInfo,
    };
  } catch (error) {
    if (!error?.userCancelled) {
      console.error('Purchase error:', error);
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
      return {
        success: true,
        isProRestored: hasProEntitlement(MOCK_CUSTOMER_INFO),
        customerInfo: MOCK_CUSTOMER_INFO,
        coinsRestored: 0,
      };
    }
    if (!isPurchasesAvailable()) {
      return { success: false, error: 'Purchases module unavailable' };
    }

    const customerInfo = await Purchases.restorePurchases();
    const isProRestored = hasProEntitlement(customerInfo);

    return {
      success: true,
      isProRestored,
      customerInfo,
      coinsRestored: 0,
    };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error: error?.message || 'restore_failed' };
  }
}

/**
 * Show RevenueCat Paywall
 */
export async function presentPaywall() {
  try {
    if (USE_MOCK) {
      Alert.alert('Mock Paywall', 'Select outcome:', [
        { text: 'Upgrade Success', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return true; // Simplified mock
    }
    if (Platform.OS === 'web') {
      console.warn('RevenueCat Paywalls are not supported on web environment.');
      return false;
    }

    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      console.warn('RevenueCat Paywalls are not supported in Expo Go. Use a development build (npx expo run:ios/android) to test Paywalls.');
      return false;
    }

    if (!RevenueCatUI || !isPurchasesAvailable()) {
      console.warn('RevenueCatUI or Purchases module not available.');
      return false;
    }

    if (typeof RevenueCatUI.presentPaywall !== 'function') {
      console.warn('RevenueCatUI.presentPaywall is not a function.');
      return false;
    }

    await RevenueCatUI.presentPaywall();

    // Refresh customer info after paywall closes
    const customerInfo = await Purchases.getCustomerInfo();
    return hasProEntitlement(customerInfo);
  } catch (e) {
    // Check for the specific "browser environment" error to provide better feedback
    if (e?.message?.includes('browser environment') || e?.message?.includes('document is not available')) {
      console.error('RevenueCat Error: The SDK is trying to use a web implementation in a native environment. This usually means native modules are not correctly linked or the bundler is misconfigured, or you are running in Expo Go.');
    } else {
      console.error('Paywall error:', e);
    }
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
