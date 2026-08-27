# Bible Trivia - Production Launch Checklist

## Accounts Required

### Apple (iOS App Store)
- [ ] Sign up for Apple Developer Program ($99/year)
  - https://developer.apple.com/programs/
- [ ] Create App Store Connect listing
  - https://appstoreconnect.apple.com/

### Google (Android Play Store)
- [ ] Sign up for Google Play Developer Console ($25 one-time)
  - https://play.google.com/console/

## App Store Assets Needed

### iOS App Store
- [ ] **Screenshots** (required for each device size):
  - 6.7" (iPhone 14 Pro Max): 1290 x 2796 px
  - 6.5" (iPhone 11 Pro Max): 1242 x 2688 px
  - 5.5" (iPhone 8 Plus): 1242 x 2208 px
  - iPad Pro 12.9" (optional): 2048 x 2732 px
  
- [ ] **App Preview Video** (optional but recommended):
  - 15-30 seconds showing gameplay
  - 1920 x 1080 px (or any aspect ratio up to 1920x1080)

### Google Play Store
- [ ] **Screenshots** (minimum 2, max 8):
  - Phone: 1080 x 1920 px
  - 7" tablet: 1200 x 1920 px
  - 10" tablet: 2560 x 1800 px

### Both Stores
- [ ] **Privacy Policy URL** (required):
  - Create a privacy policy page on your website
  - Example: https://yourdomain.com/privacy.html
  
- [ ] **Support URL** (optional but recommended)

## Store Listings

### iOS App Store Connect
1. Go to App Store Connect → My Apps → + New App
2. Fill in:
   - Platforms: iOS
   - Name: Bible Trivia
   - Primary Language: English
  - Bundle ID: com.iguruapp.bibletrivia
   - SKU: bible-trivia-100
3. Fill in app information:
   - Description (170 chars shown, 4000 max)
   - Keywords (100 chars max)
   - Marketing URL (optional)
   - Support URL (optional)
   - Privacy Policy URL (required)
4. Set Age Rating (all ages - no special ratings needed)
5. Upload screenshots for each device
6. Set pricing and availability (free or paid)

### Google Play Console
1. Go to Play Console → All apps → Create app
2. Fill in:
   - App name: Bible Trivia
   - Default language: English
   - App type: Game
   - Category: Trivia
  - Android package name: com.iguruapp.bibletrivia
3. Complete Store Listing:
   - Short description (80 chars max)
   - Full description (4000 chars max)
   - Screenshots (phone + tablet)
   - Feature graphic (1024 x 500 px)
   - App icon (512 x 512 px)
4. Complete Content Rating questionnaire
5. Set pricing and distribution

## Build for Production

### iOS (via Xcode)
```bash
# Build for App Store
npx expo run:ios --configuration Release

# Or archive and upload via Xcode:
# 1. Open ios/BibleTrivia.xcworkspace in Xcode
# 2. Select "Any iOS Device" as target
# 3. Product → Archive
# 4. Distribute App Store
```

### Android (via Expo)
```bash
# Generate AAB for Play Store
eas build --platform android --profile production

# Or manually
cd android && ./gradlew bundleRelease
```


## Pre-Launch Final Checklist
- [x] Expo dependencies deduplicated and up-to-date
- [x] Unit tests for all major components (coverage >70%)
- [x] Firebase credentials and Auth client IDs configured
- [ ] RevenueCat production keys set for iOS and Android
- [ ] EXPO_PUBLIC_USE_MOCK_PURCHASES set to false for release
- [ ] RevenueCat offering created and marked current (includes Pro + coin products)
- [ ] Entitlement name exactly matches: Bible Trivia Pro
- [ ] iOS and Android product IDs in RevenueCat match store products exactly
- [ ] Test on physical devices (not just simulator/emulator)
- [ ] Test on iPhone (iOS 14+) and Android (API 21+)
- [ ] Review all text for typos
- [ ] Verify privacy policy link works
- [ ] Test in-app purchases (if any)
- [ ] Enable App Analytics (App Store Connect / Play Console)
- [ ] Set up Crashlytics (optional but recommended)
- [ ] Prepare App Store keywords for SEO
- [ ] Plan launch date and marketing

## Post-Launch

- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Plan for updates (bug fixes, new questions)
- [ ] Set up push notifications (optional)
- [ ] Enable ratings prompt (iOS: use `expo-apple-authentication` if needed)
