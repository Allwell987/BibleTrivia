# Privacy Policy

**Bible Trivia App**
Version 1.0.0
Last Updated: August 2026

## 1. Introduction

Bible Trivia ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our mobile application ("Bible Trivia" or "App").

By using the Bible Trivia App, you agree to the collection and use of information in accordance with this policy.

## 2. Information We Collect

### 2.1 Information You Provide
- **Leaderboard Names**: When you voluntarily enter a name to save your quiz score, this name is stored locally on your device.
- **Quiz Preferences**: Settings you choose (such as sound preferences, theme selection, timer duration) are stored locally.

### 2.2 Sign-In Information (Optional)
Signing in is optional. If you choose to sign in with Google or Sign in with Apple, we use Firebase Authentication to process:
- **Name and email address** associated with your chosen account (Apple Sign-In allows you to hide your email).
- **A unique user ID**, used to sync your progress, coin balance, and purchases across devices and to identify you on the global leaderboard.

You can sign out at any time from the App's Settings screen, which stops any further cloud sync.

### 2.3 Automatically Collected Information
- **Advertising Identifier**: If ads are shown in the App, our ad partner (Google AdMob) may collect your device's advertising ID and related device/network information to serve and measure ads. See Section 4 for details.
- We do not otherwise collect personally identifiable information automatically. Core gameplay operates offline.

### 2.4 Local and Cloud Storage
Quiz data, statistics, and preferences are stored locally on your device using AsyncStorage. If you sign in, a subset of this data (progress, coin balance, purchase records, leaderboard entry) is also synced to our Firebase/Firestore backend so it can be restored on other devices.

## 3. How We Use Your Information

We use the information we collect solely to:
- Provide and maintain App functionality
- Track your quiz progress and statistics
- Display your high scores on the local leaderboard
- Remember your preferences between sessions

**We do not sell, trade, or otherwise transfer your information to third parties.**

## 4. Third-Party Services

The Bible Trivia App may include links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you use.

### Expo SDK
The App is built using React Native and Expo SDK, which may collect certain device information in accordance with their privacy policies:
- [Expo Privacy Policy](https://expo.io/privacy)
- [React Native Privacy Policy](https://reactnative.dev/privacy)

### Authentication Providers
If you sign in, your name, email, and a unique account identifier are shared with and processed by:
- [Firebase/Google Privacy Policy](https://policies.google.com/privacy)
- [Sign in with Apple Privacy Policy](https://www.apple.com/legal/privacy/)

### Advertising (Google AdMob)
The App may display ads (including rewarded and interstitial ads) served by Google AdMob. AdMob may collect your device's advertising identifier, IP address, and other device/usage information to serve ads, measure ad performance, and (subject to your consent/device settings) personalize ads. You can opt out of personalized advertising through your device's ad settings (e.g., "Limit Ad Tracking" on iOS or "Opt out of Ads Personalization" on Android).
- [Google AdMob Privacy Policy](https://policies.google.com/privacy)
- [How Google uses data](https://policies.google.com/technologies/partner-sites)

### In-App Purchases
The App offers optional in-app purchases for virtual coin packs used for gameplay features.

- **Payment Processing**: All payments are processed by Apple App Store or Google Play. We do not collect or store your card number, billing address, or payment credentials.
- **Purchase Data We Process**: We may process non-sensitive purchase metadata such as product identifier, transaction identifier, purchased coin amount, and timestamp to grant coins, restore purchases, and support customer service.
- **Storage**: Purchase records and coin balances may be stored locally on your device and synced with your app account data where applicable.
- **Third-Party Policies**:
- [Apple Media Services Terms](https://www.apple.com/legal/internet-services/itunes/)
- [Apple Privacy Policy](https://www.apple.com/legal/privacy/)
- [Google Play Payments Terms](https://play.google.com/about/play-terms/)
- [Google Privacy Policy](https://policies.google.com/privacy)

## 5. Data Security

We implement reasonable security measures to protect your personal information. However, no method of electronic storage or transmission over the Internet is 100% secure, and we cannot guarantee absolute security.

## 6. Children's Privacy

The Bible Trivia App is appropriate for users of all ages, including children. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.

## 7. International Users

If you are accessing the App from outside your country, please note that information may be transferred to and processed in countries with different data protection laws. By using the App, you consent to such transfer.

## 8. Your Rights and Data Deletion

Depending on your location, you may have certain rights regarding your personal information, including:
- The right to access your personal data
- The right to correct inaccurate data
- The right to delete your data
- The right to data portability

**If you never signed in**: all data is stored locally on your device. You can delete it at any time by uninstalling the App or clearing the App's data from your device settings.

**If you signed in with Google or Apple**: you can permanently delete your cloud account and all associated data (progress, coin balance, purchase history, leaderboard entry) directly in the App via **Settings > Account & Sync > Delete Account & Data**. Alternatively, use our [Data Deletion Request page](https://github.com/Allwell987/BibleTrivia/blob/main/DATA_DELETION.md), or email [support@bibletrivia.app](mailto:support@bibletrivia.app) with the subject "Delete My Data" from the email address associated with your account.

We will process deletion requests within 30 days. Local data on your device is not affected by cloud account deletion unless you also uninstall the App.

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy and posting the revised policy within the App (if applicable).

## 10. Contact Us

If you have any questions about this Privacy Policy or our privacy practices, please contact us:

**Email**: [support@bibletrivia.app](mailto:support@bibletrivia.app)
**Website**: [https://github.com/Allwell987/BibleTrivia](https://github.com/Allwell987/BibleTrivia)

---

## Summary

| Data Type | Stored Where | Shared | Purpose |
|-----------|-------------|--------|---------|
| Quiz Scores | Your device (+ cloud if signed in) | No | Leaderboard display |
| Statistics | Your device (+ cloud if signed in) | No | Progress tracking |
| Settings | Your device only | No | App preferences |
| Leaderboard Names | Your device (+ cloud if signed in) | No | Score identification |
| Name / Email | Cloud (only if signed in) | No | Account sign-in, cross-device sync |
| Purchase records | Your device (+ cloud if signed in) | No (processed via App Store/Play) | Restore purchases, coin balance |
| Advertising ID | Not stored by us | Yes, with Google AdMob | Serving/measuring ads |

---

*This Privacy Policy was last updated on August 27, 2026.*
