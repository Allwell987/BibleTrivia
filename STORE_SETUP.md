# Store setup checklist

## App Store / Google Play
- Create Apple Developer and Google Play accounts if not already present.
- Create App Store Connect and Play Console listings for Bible Trivia.
- Upload screenshots, feature graphics, and app icons.
- Set privacy policy and support URLs.
- Configure RevenueCat products and entitlements to match the app identifiers.
- Verify the app bundle IDs:
  - iOS: com.iguruapp.bibletrivia
  - Android: com.bibletrivia.app

## Release values
- Keep mock purchases disabled for production builds.
- Use production RevenueCat keys and real store product IDs.
- The app currently expects these RevenueCat product identifiers:
  - Pro monthly: com.iguruapp.bibletrivia.pro_monthly
  - Pro yearly: com.iguruapp.bibletrivia.pro_yearly
  - Pro lifetime: com.iguruapp.bibletrivia.pro_lifetime
  - Coin packs: com.iguruapp.bibletrivia.coins_250, com.iguruapp.bibletrivia.coins_500, com.iguruapp.bibletrivia.coins_1200, com.iguruapp.bibletrivia.coins_3000, com.iguruapp.bibletrivia.coins_7500
- Existing screenshots for submission are already present in the screenshots folder.
