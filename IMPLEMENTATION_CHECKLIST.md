# ✅ Coin Purchase Implementation Checklist

Use this checklist to track your progress implementing the coin purchase system.

## Phase 1: Installation & Setup 🔧

### Dependencies
- [x] Run `npm install react-native-iap`
- [x] Run `npm install` to ensure all dependencies updated
- [x] Verify no peer dependency warnings

### Code Review
- [ ] Review `src/utils/purchases.js` - understand purchase flow
- [ ] Review `src/screens/ShopScreen.js` - understand UI
- [ ] Review changes to `App.js` - purchase initialization
- [ ] Review changes to `ProgressContext.js` - addCoins export
- [ ] Review changes to `HomeScreen.js` - Shop button

### Local Build
- [x] Run `npm run lint` - fix any linting issues
- [ ] Build app locally: `expo run:ios` or `expo run:android`
- [ ] Verify no build errors
- [ ] Verify Shop button appears on HomeScreen

Build notes (Mar 31, 2026):
- `expo run:ios --no-install` blocked by missing iOS code-signing certificates.
- `expo run:android --no-install` blocked by no connected Android device/emulator.

## Phase 2: iOS Configuration (App Store) 🍎

### Account Setup
- [ ] Log into [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Select your Bible Trivia app
- [ ] Verify app information is complete

### Create In-App Purchases
- [ ] Navigate to: Features → In-App Purchases
- [ ] Click "+" to add new In-App Purchase

#### Product 1: 250 Coins
- [ ] Type: **Consumable**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_250`
- [ ] Reference Name: `250 Coins`
- [ ] Price Tier: $0.50 (or tier equivalent)
- [ ] Add localized name and description
- [ ] Set status to "Ready to Submit"
- [ ] Save

#### Product 2: 500 Coins
- [ ] Type: **Consumable**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_500`
- [ ] Reference Name: `500 Coins`
- [ ] Price Tier: $0.99 (or tier equivalent)
- [ ] Add localized name and description
- [ ] Set status to "Ready to Submit"
- [ ] Save

#### Product 3: 1200 Coins
- [ ] Type: **Consumable**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_1200`
- [ ] Reference Name: `1200 Coins`
- [ ] Price Tier: $2.99
- [ ] Add localized name and description
- [ ] Set status to "Ready to Submit"
- [ ] Save

#### Product 4: 3000 Coins
- [ ] Type: **Consumable**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_3000`
- [ ] Reference Name: `3000 Coins`
- [ ] Price Tier: $4.99
- [ ] Add localized name and description
- [ ] Set status to "Ready to Submit"
- [ ] Save

#### Product 5: 7500 Coins
- [ ] Type: **Consumable**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_7500`
- [ ] Reference Name: `7500 Coins`
- [ ] Price Tier: $9.99
- [ ] Add localized name and description
- [ ] Set status to "Ready to Submit"
- [ ] Save

### TestFlight Setup
- [ ] Create test user account (Users and Access → Sandbox)
- [ ] Email: _________________ (write your test email)
- [ ] Password: _________________ (keep secure)

## Phase 3: Android Configuration (Google Play) 🤖

### Account Setup
- [ ] Log into [Google Play Console](https://play.google.com/console)
- [ ] Select your Bible Trivia app
- [ ] Verify app information is complete

### Create In-App Products
- [ ] Navigate to: Monetize → Products → In-app products
- [ ] Click "Create product"

#### Product 1: 250 Coins
- [ ] Product type: **Managed Product**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_250`
- [ ] Name: `250 Coins`
- [ ] Price: $0.50
- [ ] Description: `Purchase 250 coins for using hints`
- [ ] Save

#### Product 2: 500 Coins
- [ ] Product type: **Managed Product**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_500`
- [ ] Name: `500 Coins`
- [ ] Price: $0.99
- [ ] Description: `Purchase 500 coins`
- [ ] Save

#### Product 3: 1200 Coins
- [ ] Product type: **Managed Product**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_1200`
- [ ] Name: `1200 Coins`
- [ ] Price: $2.99
- [ ] Description: `Purchase 1200 coins`
- [ ] Save

#### Product 4: 3000 Coins
- [ ] Product type: **Managed Product**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_3000`
- [ ] Name: `3000 Coins`
- [ ] Price: $4.99
- [ ] Description: `Purchase 3000 coins`
- [ ] Save

#### Product 5: 7500 Coins
- [ ] Product type: **Managed Product**
- [ ] Product ID: `com.iguruapp.bibletrivia.coins_7500`
- [ ] Name: `7500 Coins`
- [ ] Price: $9.99
- [ ] Description: `Purchase 7500 coins`
- [ ] Save

### Test Setup
- [ ] Go to Settings → License Testing
- [ ] Add your test email address
- [ ] Create internal test track
- [ ] Upload test build to internal testing

## Phase 4: App Configuration 📱

### Update app.json
- [x] Add the following plugin config:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-iap",
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

- [x] Run `expo prebuild --clean` (if not already done)
- [x] Verify no prebuild errors
- [x] Add `eas.json` with `preview` and `production` build profiles
- [x] Switch purchase mock mode to env toggle (`EXPO_PUBLIC_USE_MOCK_PURCHASES=true` for local mocks)

## Phase 5: Testing 🧪

### Local Testing with Simulator

#### iOS Simulator
- [ ] Run `expo run:ios`
- [ ] Open Shop screen
- [ ] Verify 5 coin packages visible
- [ ] Verify prices showing correctly
- [ ] Tap "Buy" button (will fail in simulator - expected)
- [ ] Verify error handled gracefully
- [ ] Verify "Restore Purchases" button exists

#### Android Emulator
- [ ] Run `expo run:android`
- [ ] Open Shop screen
- [ ] Verify 5 coin packages visible
- [ ] Verify prices showing correctly
- [ ] Tap "Buy" button (will fail in emulator - expected)
- [ ] Verify error handled gracefully
- [ ] Verify "Restore Purchases" button exists

### TestFlight Testing (iOS)

- [ ] Build for TestFlight: `eas build --platform ios --profile preview`
- [ ] Upload to TestFlight
- [ ] Wait for processing (~30 minutes)
- [ ] Install on test device
- [ ] Log in with test credentials
- [ ] Open Shop
- [ ] Verify all products showing with Store prices
- [ ] **IMPORTANT**: Wait 24 hours for products to appear in sandbox
- [ ] Tap "Buy" on each package:
  - [ ] 500 coins
  - [ ] 1200 coins
  - [ ] 3000 coins
  - [ ] 7500 coins
- [ ] Complete payment (won't charge test account)
- [ ] Verify coins added to account
- [ ] Go back to HomeScreen, verify balance updated
- [ ] Return to Shop, restart app, verify coins persisted
- [ ] Test "Restore Purchases" button

### Google Play Internal Testing (Android)

- [ ] Build for testing: `eas build --platform android --profile preview`
- [ ] Upload to internal test track in Play Console
- [ ] Wait for processing (~15 minutes)
- [ ] Install on test device with test email
- [ ] Log in with test credentials
- [ ] Open Shop
- [ ] Verify all products showing with Store prices
- [ ] Tap "Buy" on each package:
  - [ ] 500 coins
  - [ ] 1200 coins
  - [ ] 3000 coins
  - [ ] 7500 coins
- [ ] Complete payment with test method
- [ ] Verify coins added to account
- [ ] Go back to HomeScreen, verify balance updated
- [ ] Restart app, verify coins persisted
- [ ] Test "Restore Purchases" button

### Error Testing

- [ ] Test with network disabled:
  - [ ] Disable WiFi/Cellular
  - [ ] Try to open Shop
  - [ ] Verify error handling
  - [ ] Re-enable network
  
- [ ] Test purchase cancellation:
  - [ ] Start purchase
  - [ ] Cancel in payment dialog
  - [ ] Verify no coins added
  
- [ ] Test background/foreground transitions:
  - [ ] Start purchase
  - [ ] Press home button
  - [ ] Reopen app
  - [ ] Verify purchase state preserved

## Phase 6: Documentation & Privacy 📚

### Documentation
- [ ] Read COIN_PURCHASES_SETUP.md completely
- [ ] Read COIN_PURCHASES_QUICK_START.md
- [ ] Read COIN_PURCHASES_TESTING.md
- [ ] Review ARCHITECTURE.md
- [ ] File location: `/memories/session/coin_purchase_implementation.md`

### Privacy & Legal
- [x] Update PRIVACY_POLICY.md to mention in-app purchases
- [ ] Include section on:
  - [x] What data is collected during purchases
  - [x] How payment data is handled
  - [x] Links to Apple/Google privacy policies
- [ ] Update app description to mention coins
- [ ] Review app rating appropriateness

### Store Listings
- [ ] Update App Store description:
  - [ ] Mention coin shop feature
  - [ ] Mention optional purchases
  - [ ] Explain coin use (hints)
  
- [ ] Update Google Play description:
  - [ ] Mention coin shop feature
  - [ ] Mention optional purchases
  - [ ] Explain coin use

## Phase 7: Production Deployment 🚀

### Final Checks
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Product IDs match exactly (case-sensitive)
- [ ] Prices correct on both platforms
- [ ] Privacy policy updated
- [ ] Analytics events tracking correctly

### Build for Production

#### iOS Production Build
- [ ] Create production build: `eas build --platform ios --profile production`
- [ ] Wait for completion
- [ ] Test build on device one more time
- [ ] Submit to App Store

#### Android Production Build
- [ ] Create production build: `eas build --platform android --profile production`
- [ ] Wait for completion
- [ ] Test APK on device one more time
- [ ] Upload to Google Play production track

### App Store Review
- [ ] Monitor App Store submission status
- [ ] Monitor Google Play submission status
- [ ] Address any review concerns
- [ ] Expected review time:
  - [ ] iOS: 24-48 hours
  - [ ] Android: 2-4 hours

### Post-Launch (First 24 hours)
- [ ] Monitor crash reports
- [ ] Watch analytics dashboard
- [ ] Check for user complaints
- [ ] Verify purchases are processing
- [ ] Monitor Revenue/ARPPU

## Phase 8: Ongoing Maintenance 📊

### Daily (First Week)
- [ ] Monitor crash dashboard
- [ ] Check purchase success rate (target: >95%)
- [ ] Read user reviews/feedback
- [ ] Monitor payment failures
- [ ] Check Firebase coin updates

### Weekly
- [ ] Review purchase metrics
- [ ] Analyze user purchase patterns
- [ ] Check for any payment issues
- [ ] Review error logs
- [ ] Monitor ARPPU trends

### Monthly
- [ ] Analyze purchase data trends
- [ ] Optimize coin package pricing if needed
- [ ] Review marketing effectiveness
- [ ] Plan future monetization features
- [ ] Update documentation if needed

## Common Issues & Solutions 🐛

### Issue: Products not showing in app
- [ ] Verify product IDs match exactly (case-sensitive)
- [ ] Wait 24 hours for iOS products to appear
- [ ] Restart app after 15 min on Android
- [ ] Clear app cache
- [ ] Rebuild and deploy

### Issue: "Product not found" error
- [ ] Double-check product IDs in code vs stores
- [ ] Ensure products are "Active" on store
- [ ] For iOS, wait 24 hours from creation
- [ ] Verify plugin config in app.json

### Issue: Purchases fail silently
- [ ] Check network connectivity
- [ ] Verify test account is whitelisted
- [ ] Check console logs for detailed errors
- [ ] Restart app
- [ ] Try on physical device (not simulator/emulator)

### Issue: Coins not persisting
- [ ] Verify AsyncStorage not cleared
- [ ] Check Firebase rules allow write
- [ ] Check user is logged in
- [ ] Verify earnCoins is being called

### Issue: Restore purchases not working
- [ ] Ensure previous purchase was in sandbox
- [ ] Verify same app bundle ID / package name
- [ ] Check Android acknowledges purchases
- [ ] Restart app before restore

## Success Metrics ✅

Once live, track these metrics:

- [ ] **Conversion Rate**: % of users who make at least 1 purchase (target: 5-10%)
- [ ] **ARPPU**: Average Revenue Per Paying User (target: $2-5)
- [ ] **Purchase Success Rate**: % of completed purchases (target: >95%)
- [ ] **Retention**: Users still making purchases after 7 days (target: >50%)
- [ ] **Error Rate**: % of failed transactions (target: <5%)
- [ ] **LTV**: Lifetime Value per user (track monthly)

## Sign-Off ✨

Once completed, mark final checkboxes:

- [ ] All code implemented
- [ ] Stores configured correctly
- [ ] Testing completed successfully
- [ ] Documentation reviewed
- [ ] Privacy policy updated
- [ ] Production builds created
- [ ] Submitted to app stores
- [ ] **LIVE AND EARNING REVENUE! 🎉**

---

## Quick Reference

**Command Cheatsheet:**
```bash
# Install dependencies
npm install react-native-iap

# Rebuild for plugins
expo prebuild --clean

# Build for iOS TestFlight
eas build --platform ios --profile preview

# Build for Android internal testing
eas build --platform android --profile preview

# Build for iOS production
eas build --platform ios --profile production

# Build for Android production
eas build --platform android --profile production

# Run locally
expo run:ios
expo run:android
```

**File Locations:**
- Purchase logic: `src/utils/purchases.js`
- Shop UI: `src/screens/ShopScreen.js`
- Setup guide: `COIN_PURCHASES_SETUP.md`
- Quick start: `COIN_PURCHASES_QUICK_START.md`
- Testing guide: `COIN_PURCHASES_TESTING.md`
- Architecture: `ARCHITECTURE.md`

---

**Created**: March 31, 2026
**Last Updated**: March 31, 2026 (code/config progress synced)
**Status**: In Progress
