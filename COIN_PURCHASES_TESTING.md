# Coin Purchases - Testing Guide

## Quick Test Checklist

- [ ] Shop button visible on HomeScreen
- [ ] Shop screen loads without errors
- [ ] Coin balance displays correctly
- [ ] All 4 coin packages are visible
- [ ] Prices matching store configuration
- [ ] Purchase button responds to tap
- [ ] Loading state appears during purchase
- [ ] Purchase can be completed (in test environment)
- [ ] Coins added after purchase
- [ ] Coin balance updates on HomeScreen
- [ ] Restore purchases button works
- [ ] Error messages display properly
- [ ] Back button works on Shop screen
- [ ] Coin balance persists after app restart

## Local Testing Without App Store

### 1. Mock Setup (For Development)

Create a mock file to test without real App Store:

```javascript
// src/utils/purchases.mock.js
export const MOCK_PACKAGES = [
  { productId: 'coins_250', coins: 250, price: '$0.50' },
  { productId: 'coins_500', coins: 500, price: '$0.99' },
  { productId: 'coins_1200', coins: 1200, price: '$2.99' },
  { productId: 'coins_3000', coins: 3000, price: '$4.99' },
  { productId: 'coins_7500', coins: 7500, price: '$9.99' },
];

export async function mockPurchase(productId) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const pkg = MOCK_PACKAGES.find(p => p.productId === productId);
  if (!pkg) throw new Error('Product not found');
  
  // Randomly succeed/fail for testing
  if (Math.random() > 0.1) {
    return { success: true, coins: pkg.coins };
  } else {
    throw new Error('Simulated purchase error');
  }
}
```

### 2. Device Testing

#### iOS (Physical Device)
```bash
# Build for device
expo run:ios --device

# TestFlight (requires provisioning)
eas build --platform ios --profile preview
```

#### Android (Physical Device)
```bash

# Build for device
expo run:android --device

# Create APK for manual install
eas build --platform android --profile preview
```

### 3. Sandbox Testing

#### App Store Sandbox (iOS)

1. In App Store Connect, create test users:
   - Users and Access → Sandbox Testers
   - Create new tester with unique email
   
2. Build TestFlight build:
   ```bash
   eas build --platform ios --profile preview
   ```

3. Invite self to TestFlight
   - Can now test purchases without real charges

4. In app, log in with sandbox tester account

5. Test purchases:
   - Make payment
   - Money won't be charged
   - Coins should be added

#### Google Play Sandbox (Android)

1. Add test account to Play Console:
   - Settings → License Testing
   - Add email address as tester

2. Build and upload to internal test track:
   ```bash
   eas build --platform android --profile preview
   ```

3. Open Play Console link on device with test account

4. Install app from Play Store for that account

5. Test purchases:
   - Uses test payment method
   - No real charges
   - Check logs for success

## Manual Testing Scenarios

### Scenario 1: Normal Purchase Flow
1. Open Shop from HomeScreen
2. Tap on a coin package (e.g., 1200 Coins)
3. Confirm purchase in native payment dialog
4. Watch for success alert
5. Verify coins were added to HomeScreen balance
6. Check Firebase Console for updated progress

**Expected Result:** ✅ Coins added, balance updates

### Scenario 2: Failed Purchase
1. In sandbox, tap "Refunded" item (Android: `android.test.refunded`)
2. Observe error alert
3. Verify coins were NOT added
4. Verify balance unchanged

**Expected Result:** ✅ Error shown, no coins added

### Scenario 3: Restore Purchases
1. Make a purchase (note the amount)
2. Force restart app: kill and reopen
3. Tap "Restore Purchases" on Shop
4. Verify same amount is restored

**Expected Result:** ✅ Previous purchase restored

### Scenario 4: Offline Then Online
1. Put device in airplane mode
2. Try to purchase
3. Observe error (network unavailable)
4. Disable airplane mode
5. Retry purchase

**Expected Result:** ✅ Purchase works when online

### Scenario 5: Multiple Packages
1. Purchase 500 coins (balance: 200 + 500 = 700)
2. Purchase 1200 coins (balance: 700 + 1200 = 1900)
3. Check HomeScreen balance is 1900

**Expected Result:** ✅ Balances accumulate

## Testing Coin Spending

### Verify "Spend Coins" Works

Open QuizScreen (where hints are used):

```javascript
// In QuizScreen, test handleUseHint
const handleUseHint = async () => {
  const hintCost = 50;
  if (await spendCoins(hintCost)) {
    // Show hint
    showHint();
  } else {
    Alert.alert('Not Enough Coins', `Need ${hintCost} coins for a hint`);
  }
};
```

**Test:**
1. Purchase 500 coins (check balance = 700)
2. Use hint (costs 50) - balance should be 650
3. Use hint 13 more times (50 × 13 = 650) - balance should be 0
4. Try to use hint - error should show

**Expected Result:** ✅ Coins properly deducted

## Testing Purchase History

### Verify Storage & Sync

```javascript
// In console or test file
import { getPurchaseHistory } from './src/utils/purchases';
import { useProgress } from './src/context/ProgressContext';

// Test local storage
const history = await getPurchaseHistory();
console.log('Purchase history:', history);

// Test Firebase sync
const { progress } = useProgress();
console.log('Current coins:', progress.coins);

// Check Firebase Console
// firestore.googleapis.com → users → [userId] → progress → coins
```

**Expected Results:**
- ✅ Local AsyncStorage has purchase records
- ✅ Firebase has updated coin count
- ✅ Timestamps are recorded for each purchase
- ✅ Transaction IDs present

## Testing Error Scenarios

### Network Error
```javascript
// Disable network temporarily
// iOS: Simulator → Debug → Disconnect
// Android: adb shell "cmd connectivity airplane-mode enable"

// Try purchase → should error
// Re-enable network
// Retry → should work
```

### Invalid Product
```javascript
// Modify productId to non-existent product
const result = await purchaseCoinPackage('invalid.product.id');
// Should error with "Product not found"
```

### Duplicate Purchase Prevention
```javascript
// Start purchase
// Don't close dialog, navigate away
// Return to ShopScreen
// Try to purchase same product again
// Should prevent duplicate charge
```

## Performance Testing

### Load Time
```javascript
// Measure time to load Shop
console.time('shop-load');
navigation.navigate('Shop');
// Time should be < 1 second

console.timeEnd('shop-load');
```

### Purchase Processing
```javascript
// Measure time to processed purchased
console.time('purchase');
const result = await purchaseCoinPackage(productId);
// Time should be < 3 seconds

console.timeEnd('purchase');
```

## Debugging Tips

### Enable Verbose Logging
```javascript
// In src/utils/purchases.js
const DEBUG = true;

export async function purchaseCoinPackage(productId) {
  if (DEBUG) console.log('🛒 Attempting purchase:', productId);
  try {
    const result = await requestPurchase({ sku: productId });
    if (DEBUG) console.log('✅ Purchase successful:', result);
    return { success: true, coins: PRODUCT_CONFIG[productId].coins };
  } catch (error) {
    if (DEBUG) console.error('❌ Purchase failed:', error);
    return { success: false, error: error.message };
  }
}
```

### Monitor Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Firestore Database → users collection
4. Find your test user document
5. Expand `progress` object
6. Watch `coins` field update after purchase

### Check AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// View all stored data
async function debugStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const allData = await AsyncStorage.multiGet(keys);
  allData.forEach(([key, value]) => {
    console.log(key, JSON.parse(value));
  });
}

// Call in React Native Debugger
debugStorage();
```

## Cross-Platform Testing

### iOS Specific
- [ ] Works on iPhone X, 12, 14, 15
- [ ] Works on iPad
- [ ] TestFlight works
- [ ] Sandbox purchases work
- [ ] Receipt validation works

### Android Specific
- [ ] Works on various Android versions (8, 11, 13+)
- [ ] Works on Google Play
- [ ] Works with Play Billing Library
- [ ] Managed products work
- [ ] Skipping license check works in development

## Post-Launch Testing

After shipping to production:

### Daily Checks
- [ ] Purchase success rate > 95%
- [ ] No error reports in crash analytics
- [ ] Coins syncing to Firebase properly
- [ ] Purchase history correct

### Weekly Checks
- [ ] Review crash reports
- [ ] Check failed transaction logs
- [ ] Verify revenue reporting
- [ ] Test restore purchases functionality

### Monthly Reviews
- [ ] Analyze purchase patterns
- [ ] Monitor churn rates
- [ ] Check ARPPU (Average Revenue Per Paying User)
- [ ] Review user feedback

## Sample Test Data

### Test Purchases to Make
```javascript
const testPurchases = [
  { productId: 'coins_500', expectedCoins: 500, forType: 'trial' },
  { productId: 'coins_1200', expectedCoins: 1200, forType: 'casual' },
  { productId: 'coins_3000', expectedCoins: 3000, forType: 'value' },
  { productId: 'coins_7500', expectedCoins: 7500, forType: 'bulk' },
];
```

### Expected Behavior
- Each purchase adds exact coin amount
- Cannot duplicate charge for same purchase
- Restore retrieves all previous purchases
- Sync happens within 5 seconds
- Offline purchases sync when online

---

**Happy testing! 🎮**

If you encounter issues:
1. Check `COIN_PURCHASES_SETUP.md` for configuration
2. Review `COIN_PURCHASES_QUICK_START.md` for overview
3. Check console logs for detailed errors
4. Verify product IDs match exactly
5. Try clearing app cache and testing again
