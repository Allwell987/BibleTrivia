import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import PurchasesHolder from 'react-native-purchases-ui';

// Configuration
const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || 'test_xtrPxefMVMPmKKIkehsdrglhlNZ',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || 'test_xtrPxefMVMPmKKIkehsdrglhlNZ',
});

const isInvalidRevenueCatKey = (key) =>
  !key ||
  typeof key !== 'string' ||
  key.startsWith('test_') ||
  key.includes('YOUR_');

const ENTITLEMENT_ID = 'Allwell Pro';
const PURCHASES_KEY = 'bible_trivia_purchases';

export const PRODUCT_CONFIG = {
  'com.iguruapp.bibletrivia.coins_250': { coins: 250 },
  'com.iguruapp.bibletrivia.coins_500': { coins: 500 },
  'com.iguruapp.bibletrivia.coins_1200': { coins: 1200 },
  'com.iguruapp.bibletrivia.coins_3000': { coins: 3000 },
  'com.iguruapp.bibletrivia.coins_7500': { coins: 7500 },
  // Pro versions
  'com.iguruapp.bibletrivia.pro_monthly': { isPro: true },
  'com.iguruapp.bibletrivia.pro_yearly': { isPro: true },
  'com.iguruapp.bibletrivia.pro_lifetime': { isPro: true },
};

let connectionInitialized = false;

/**
 * Initialize RevenueCat SDK
 */
export async function initializePurchases(userId) {
  try {
    if (connectionInitialized) return true;

    if (!__DEV__ && isInvalidRevenueCatKey(REVENUECAT_API_KEY)) {
      console.error('⚠️ RevenueCat initialization blocked: missing production API key.');
      return false;
    }

    // Configure RevenueCat
    Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId || null
    });

    // Enable debug logs in development
    if (__DEV__) {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    connectionInitialized = true;
    console.log('✅ RevenueCat initialized');
    return true;
  } catch (error) {
    console.error('⚠️ Failed to initialize RevenueCat:', error.message);
    return false;
  }
}

/**
 * Check if user has active "Allwell Pro" entitlement
 */
export async function checkProStatus() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (e) {
    console.error('Error checking pro status:', e);
    return false;
  }
}

/**
 * Fetch available offerings (Monthly, Yearly, Lifetime)
 */
export async function getOfferings() {
  try {
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

/**
 * Legacy/Helper for ShopScreen to get pro offerings specifically
 */
export async function getProOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      // Return packages that are marked as pro in our config
      return offerings.current.availablePackages
        .filter(pkg => PRODUCT_CONFIG[pkg.product.identifier]?.isPro)
        .map(pkg => ({
          productId: pkg.product.identifier,
          title: pkg.product.title,
          price: pkg.product.priceString,
          package: pkg
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
 * In RevenueCat, these can be in a separate offering or just products
 */
export async function getAvailableCoinPackages() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages
        .filter(pkg => PRODUCT_CONFIG[pkg.product.identifier]?.coins)
        .map(pkg => ({
          productId: pkg.product.identifier,
          title: pkg.product.title,
          price: pkg.product.priceString,
          coins: PRODUCT_CONFIG[pkg.product.identifier].coins,
          package: pkg
        }));
    }
    return [];
  } catch (e) {
    console.error('Error fetching coin packages:', e);
    return [];
  }
}

/**
 * Purchase a package
 */
export async function purchaseProduct(pkgOrId) {
  try {
    let purchaseResult;
    if (typeof pkgOrId === 'string') {
      // If it's just an ID, we need to find the package or use purchaseStoreProduct
      // For simplicity in ShopScreen, we usually pass the package object
      purchaseResult = await Purchases.purchaseStoreProduct(pkgOrId);
    } else if (pkgOrId.package) {
      purchaseResult = await Purchases.purchasePackage(pkgOrId.package);
    } else {
      purchaseResult = await Purchases.purchasePackage(pkgOrId);
    }

    const { customerInfo } = purchaseResult;
    const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];

    // Identify if it was a coin purchase
    const productId = typeof pkgOrId === 'string' ? pkgOrId : (pkgOrId.productId || pkgOrId.product.identifier);
    const coins = PRODUCT_CONFIG[productId]?.coins || 0;

    return {
      success: true,
      isPro,
      coins,
      customerInfo,
    };
  } catch (error) {
    if (!error.userCancelled) {
      console.error('Purchase error:', error);
    }
    return {
      success: false,
      error: error.message,
      cancelled: error.userCancelled
    };
  }
}

/**
 * Alias for purchaseProduct to match some older calls
 */
export async function purchaseCoinPackage(productId) {
  return purchaseProduct(productId);
}

/**
 * Restore previous purchases
 */
export async function restorePurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isProRestored = !!customerInfo.entitlements.active[ENTITLEMENT_ID];

    // For coins, RevenueCat doesn't "restore" consumables in the traditional sense
    // to the UI balance automatically, but we can check nonSubscriptionTransactions
    return {
      success: true,
      isProRestored,
      customerInfo,
      coinsRestored: 0 // Consumables are usually handled differently
    };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Show RevenueCat Paywall
 */
export async function presentPaywall() {
  try {
    // Returns true if purchase was successful
    await PurchasesHolder.presentPaywall();
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (e) {
    console.error('Paywall error:', e);
    return false;
  }
}

/**
 * Show Customer Center (for subscription management)
 */
export async function presentCustomerCenter() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      await PurchasesHolder.presentCustomerCenter();
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
