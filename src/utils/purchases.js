import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Set EXPO_PUBLIC_USE_MOCK_PURCHASES=true in .env for local-only mock flows.
const USE_MOCK_PURCHASES = process.env.EXPO_PUBLIC_USE_MOCK_PURCHASES === 'true';

let iapAvailable = false;

// Only import react-native-iap if not in mock mode
let iapModule = null;
if (!USE_MOCK_PURCHASES) {
  try {
    iapModule = require('react-native-iap');
  } catch (error) {
    console.warn('react-native-iap not available, falling back to mock mode');
  }
}

export const COIN_PRODUCTS = {
  ios: [
    'com.iguruapp.bibletrivia.coins_250',
    'com.iguruapp.bibletrivia.coins_500',
    'com.iguruapp.bibletrivia.coins_1200',
    'com.iguruapp.bibletrivia.coins_3000',
    'com.iguruapp.bibletrivia.coins_7500',
  ],
  android: [
    'com.iguruapp.bibletrivia.coins_250',
    'com.iguruapp.bibletrivia.coins_500',
    'com.iguruapp.bibletrivia.coins_1200',
    'com.iguruapp.bibletrivia.coins_3000',
    'com.iguruapp.bibletrivia.coins_7500',
  ],
};

// Mapping of product IDs to coin amounts and prices
export const PRODUCT_CONFIG = {
  'com.iguruapp.bibletrivia.coins_250': { coins: 250, price: '$0.50', title: '250 Coins' },
  'com.iguruapp.bibletrivia.coins_500': { coins: 500, price: '$0.99', title: '500 Coins' },
  'com.iguruapp.bibletrivia.coins_1200': { coins: 1200, price: '$2.99', title: '1,200 Coins' },
  'com.iguruapp.bibletrivia.coins_3000': { coins: 3000, price: '$4.99', title: '3,000 Coins' },
  'com.iguruapp.bibletrivia.coins_7500': { coins: 7500, price: '$9.99', title: '7,500 Coins' },
};

const PURCHASES_KEY = 'bible_trivia_purchases';

let connectionInitialized = false;

/**
 * Get mock product data for development
 */
function getMockProducts() {
  return COIN_PRODUCTS[Platform.OS].map(productId => ({
    productId,
    title: PRODUCT_CONFIG[productId].title,
    description: `Get ${PRODUCT_CONFIG[productId].coins} coins`,
    price: PRODUCT_CONFIG[productId].price,
    currency: 'USD',
    localizedPrice: PRODUCT_CONFIG[productId].price,
  }));
}

/**
 * Initialize the IAP connection (or mock purchases)
 */
export async function initializePurchases() {
  try {
    if (connectionInitialized) return true;

    if (USE_MOCK_PURCHASES) {
      console.log('🧪 Mock purchases enabled (development mode)');
      connectionInitialized = true;
      return true;
    }

    if (!iapModule) {
      console.log('🧪 react-native-iap not available, using mock purchases');
      connectionInitialized = true;
      return true;
    }

    const { initConnection } = iapModule;
    await initConnection();
    iapAvailable = true;
    connectionInitialized = true;
    console.log('✅ Real IAP connection initialized');
    return true;
  } catch (error) {
    console.warn('⚠️ Failed to initialize real purchases, falling back to mock:', error.message);
    connectionInitialized = true;
    return true;
  }
}

/**
 * Get available coin packages
 */
export async function getAvailableCoinPackages() {
  try {
    // Use mock products in development mode or if real IAP unavailable
    if (USE_MOCK_PURCHASES || !iapAvailable || !iapModule) {
      return getMockProducts().map(product => ({
        productId: product.productId,
        title: product.title,
        description: product.description,
        price: product.price,
        coins: PRODUCT_CONFIG[product.productId]?.coins || 0,
        currencyCode: 'USD',
        currency: 'USD',
      }));
    }

    const { getProducts } = iapModule;
    const platformProducts = COIN_PRODUCTS[Platform.OS] || COIN_PRODUCTS.ios;
    const products = await getProducts({ skus: platformProducts });

    return products
      .map(product => ({
        productId: product.productId,
        title: product.title,
        description: product.description,
        price: product.localizedPrice,
        coins: PRODUCT_CONFIG[product.productId]?.coins || 0,
        currencyCode: product.currencyCode,
        currency: product.currency,
      }))
      .sort((a, b) => a.coins - b.coins);
  } catch (error) {
    console.error('Failed to get coin packages:', error);
    // Fall back to mock products
    return getMockProducts();
  }
}

/**
 * Purchase a coin package
 */
export async function purchaseCoinPackage(productId) {
  try {
    const coins = PRODUCT_CONFIG[productId]?.coins || 0;

    if (!coins) {
      return {
        success: false,
        error: 'Invalid product',
      };
    }

    // Mock purchase flow
    if (USE_MOCK_PURCHASES || !iapAvailable || !iapModule) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store purchase record
      await storePurchase({
        productId,
        transactionId: `mock_${Date.now()}`,
        purchaseTime: new Date().toISOString(),
        coins,
        isMock: true,
      });

      console.log(`🧪 Mock purchase: ${coins} coins added`);
      return {
        success: true,
        coins,
        isMock: true,
      };
    }

    // Real IAP purchase flow
    const { requestPurchase, acknowledgePurchaseAndroid } = iapModule;

    const purchase = await requestPurchase({
      sku: productId,
      andDangerouslyFinishTransactionAutomatically: false,
    });

    // Store purchase record
    await storePurchase({
      productId,
      transactionId: purchase.transactionId,
      purchaseTime: new Date().toISOString(),
      coins,
    });

    // Handle platform-specific acknowledgment
    if (Platform.OS === 'android' && iapModule.acknowledgePurchaseAndroid) {
      await iapModule.acknowledgePurchaseAndroid({ token: purchase.purchaseToken });
    }

    console.log(`✅ Real purchase: ${coins} coins added`);
    return {
      success: true,
      coins,
      purchase,
    };
  } catch (error) {
    console.error('Purchase failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get purchase history
 */
export async function getPurchaseHistory() {
  try {
    const history = await AsyncStorage.getItem(PURCHASES_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get purchase history:', error);
    return [];
  }
}

/**
 * Store a purchase record
 */
async function storePurchase(purchaseData) {
  try {
    const history = await getPurchaseHistory();
    history.push(purchaseData);
    await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to store purchase:', error);
  }
}

/**
 * Restore purchases (for users who reinstalled app)
 */
export async function restorePurchases() {
  try {
    // Mock restore (just return stored purchases)
    if (USE_MOCK_PURCHASES || !iapAvailable || !iapModule) {
      const history = await getPurchaseHistory();
      const totalCoins = history.reduce((sum, p) => sum + (p.coins || 0), 0);
      
      console.log(`🧪 Mock restore: ${totalCoins} coins from ${history.length} purchases`);
      return {
        success: true,
        coinsRestored: totalCoins,
        purchaseCount: history.length,
        isMock: true,
      };
    }

    // Real IAP restore
    const { getAvailablePurchases, acknowledgePurchaseAndroid } = iapModule;
    const purchases = await getAvailablePurchases();
    let totalCoinsRestored = 0;

    for (const purchase of purchases) {
      if (PRODUCT_CONFIG[purchase.productId]) {
        totalCoinsRestored += PRODUCT_CONFIG[purchase.productId].coins;
      }

      // Acknowledge on Android
      if (Platform.OS === 'android' && iapModule.acknowledgePurchaseAndroid) {
        try {
          await iapModule.acknowledgePurchaseAndroid({ token: purchase.purchaseToken });
        } catch (e) {
          console.warn('Failed to acknowledge purchase:', e);
        }
      }
    }

    console.log(`✅ Real restore: ${totalCoinsRestored} coins from ${purchases.length} purchases`);
    return {
      success: true,
      coinsRestored: totalCoinsRestored,
      purchaseCount: purchases.length,
    };
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export const COIN_PACKAGES = PRODUCT_CONFIG;

