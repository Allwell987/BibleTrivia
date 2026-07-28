# Adding Coin Purchases to Bible Trivia

A complete implementation guide for in-app coin purchases.

## ✅ Completed

The following has been implemented:

1. **Purchase Logic** (`src/utils/purchases.js`)
   - `initializePurchases()` - Initialize IAP connection
   - `getAvailableCoinPackages()` - Fetch available coin packages
   - `purchaseProduct(productId)` - Process purchase
   - `restorePurchases()` - Restore previous purchases
   - `getPurchaseHistory()` - Get stored purchase records

2. **Shop Screen** (`src/screens/ShopScreen.js`)
   - Displays available coin packages
   - Handles purchase flow with loading states
   - Shows current coin balance
   - Restore purchases functionality
   - Info section about coins

3. **Navigation**
   - ShopScreen added to App.js stack
   - Shop button added to HomeScreen

4. **Context Updates**
   - Added `addCoins` function to ProgressContext
   - Syncs with Firebase and AsyncStorage

## 📦 Install Dependencies

Install the in-app purchase library:

```bash
npm install react-native-purchases
# or
yarn add react-native-purchases
```

For Expo projects, also run:
```bash
expo prebuild --clean
```

## 🔧 Configuration Steps

### 1. **App Store Connect (iOS)**

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Navigate to **Features > In-App Purchases**
4. Click + to add new In-App Purchases
5. Create **Consumable** products with these details:

| Product ID | Reference Name | Price Tier | Coins |
|---|---|---|---|
| `com.iguruapp.bibletrivia.coins_250` | 250 Coins | $0.50 | 250 |
| `com.iguruapp.bibletrivia.coins_500` | 500 Coins | $0.99 | 500 |
| `com.iguruapp.bibletrivia.coins_1200` | 1200 Coins | $2.99 | 1200 |
| `com.iguruapp.bibletrivia.coins_3000` | 3000 Coins | $4.99 | 3000 |
| `com.iguruapp.bibletrivia.coins_7500` | 7500 Coins | $9.99 | 7500 |

**Important Notes:**
- These must be **Consumable** (not Auto-Renewable Subscription)
- Product IDs must match exactly in the code
- Add localizations for each product (name, description)
- Set as "Ready to Submit" status

### 2. **Google Play Console (Android)**

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Navigate to **Monetize > Products > In-app products**
4. Create **Managed Products** with the same Product IDs and prices:

| Product ID | Name | Price | SKU |
|---|---|---|---|
| `com.iguruapp.bibletrivia.coins_250` | 250 Coins | $0.50 | coins_250 |
| `com.iguruapp.bibletrivia.coins_500` | 500 Coins | $0.99 | coins_500 |
| `com.iguruapp.bibletrivia.coins_1200` | 1200 Coins | $2.99 | coins_1200 |
| `com.iguruapp.bibletrivia.coins_3000` | 3000 Coins | $4.99 | coins_3000 |
| `com.iguruapp.bibletrivia.coins_7500` | 7500 Coins | $9.99 | coins_7500 |

**Important Notes:**
- These must be **Managed Products** (consumable)
- Status should be "Active"
- Product IDs must match iOS exactly

### 3. **Initialize Purchases in App.js**

Add the initialization code at app startup:

```javascript
import { initializePurchases } from './src/utils/purchases';

// In the useEffect of App component:
useEffect(() => {
  loadSounds();
  // Initialize purchases
  initializePurchases().catch(e => console.warn('Failed to init purchases:', e));
  
  loadSettings().then(settings => {
    setHapticsEnabled(settings.hapticEnabled);
  });

  return () => {
    unloadSounds();
  };
}, []);
```

### 4. **App.json Configuration**

Update `app.json` with IAP plugin for Expo:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-purchases",
        {
          "skuAndroidList": [
            "com.iguruapp.bibletrivia.coins_250",
            "com.iguruapp.bibletrivia.coins_500",
            "com.iguruapp.bibletrivia.coins_1200",
            "com.iguruapp.bibletrivia.coins_3000",
            "com.iguruapp.bibletrivia.coins_7500"
          ],
          "skuIosList": [
            "com.iguruapp.bibletrivia.coins_250",
            "com.iguruapp.bibletrivia.coins_500",
            "com.iguruapp.bibletrivia.coins_1200",
            "com.iguruapp.bibletrivia.coins_3000",
            "com.iguruapp.bibletrivia.coins_7500"
          ]
        }
      ]
    ]
  }
}
```

## 💡 Code Usage

### From ShopScreen (Already Implemented)

```javascript
import { useProgress } from '../context/ProgressContext';
import { purchaseProduct } from '../utils/purchases';

export default function ShopScreen({ navigation }) {
  const { progress, addCoins } = useProgress();
  
  const handlePurchase = async (productId) => {
    const result = await purchaseProduct(productId);
    if (result.success) {
      await addCoins(result.coins);
      // Show success message
    }
  };
}
```

### Spending Coins (For Hints)

```javascript
import { useProgress } from '../context/ProgressContext';

export default function QuizScreen() {
  const { progress, spendCoins } = useProgress();
  
  const useHint = async () => {
    const hintCost = 50;
    if (await spendCoins(hintCost)) {
      // Show hint
    } else {
      // Not enough coins
    }
  };
}
```

## 📊 Coin Packages

Current pricing (customizable):

- **500 Coins** - $0.99 (1 coin = $0.00198)
- **1200 Coins** - $2.99 (1 coin = $0.00249) ← Best value
- **3000 Coins** - $4.99 (1 coin = $0.00166) ← BEST VALUE
- **7500 Coins** - $9.99 (1 coin = $0.00133) ← BEST VALUE

To adjust pricing:
1. Update App Store Connect and Google Play Console
2. Update `PRODUCT_CONFIG` in `src/utils/purchases.js`
3. The ShopScreen will display the real prices from the stores

## 🧪 Testing

### Sandbox Testing

**iOS TestFlight:**
- Use test user accounts created in App Store Connect
- Purchases won't actually charge

**Android Sandbox/Beta:**
- Use Gmail account added as tester
- Use `android.test.purchased` to simulate successful purchase
- Use `android.test.canceled` to simulate cancellation

### Local Testing (Expo)

```bash
expo run:ios
# or
expo run:android
```

## 🐛 Troubleshooting

### "Failed to initialize purchases"
- Ensure network connection is active
- Check that app is built (not Expo Go)
- Verify product IDs match Shop Console exactly

### "Products not found"
- Verify SKUs match exactly (case-sensitive)
- Ensure products are "Active" on Play Console
- For iOS, ensure they're "Ready to Submit"
- Products can take 24-48 hours to appear

### Purchases not working on Android
- Ensure you've signed the APK/AAB
- Verify app is published (at least internal test)
- Check Google Play Services version

### "Not enough coins" showing incorrectly
- Check AsyncStorage is working
- Verify Firebase sync is functioning
- Clear app cache and retry

## 📝 Analytics Events

The following events are tracked:
- `coin_purchase` - User purchased coins
  - `product_id` - Which package
  - `coins_purchased` - Number of coins
  - `coins_total` - Total after purchase

## 🔐 Security Notes

1. **Never trust client-side receipts** - For production, validate receipts server-side
2. **Store purchases securely** - already stored in AsyncStorage and Firebase
3. **Rate limiting** - Consider adding cooldown between purchases
4. **Fraud detection** - Monitor for unusual purchase patterns

## 🚀 Production Checklist

Before launching:

- [ ] Test purchases in TestFlight (iOS)
- [ ] Test purchases in Beta track (Android)
- [ ] Verify coin amounts are syncing to Firebase
- [ ] Test on multiple devices
- [ ] Verify restore purchases works
- [ ] Test with poor network connection
- [ ] Ensure privacy policy mentions IAP
- [ ] Set up server-side receipt validation
- [ ] Monitor purchase success rates
- [ ] Create support docs for users

## 📚 Additional Resources

- [react-native-purchases Documentation](https://github.com/dooboo-community/react-native-purchases)
- [Apple App Store Connect Help](https://help.apple.com/app-store-connect)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
