# Implement Upgrade to Pro Functionality

This plan outlines the steps to complete the "Bible Trivia Pro" integration across the app, ensuring that the Pro features (Ad-free, Unlimited Hints, and Exclusive Journey Eras) are fully functional and accessible through the UI as shown in the provided screenshots.

## User Review Required

> [!NOTE]
> Pro users will get "Unlimited Hints" for free. This means the 50/50 and Verse Reveal power-ups will no longer deduct coins from their balance.

## Proposed Changes

### [Settings Component]

#### [MODIFY] [SettingsScreen.js](file:///Users/media/Desktop/BibleTrivia/src/screens/SettingsScreen.js)
- Update the "Upgrade to Pro" row to trigger the RevenueCat Paywall directly via `presentPaywall`.
- Update the "Manage" action to open the RevenueCat Customer Center via `presentCustomerCenter`.

### [Quiz Component]

#### [MODIFY] [QuizScreen.js](file:///Users/media/Desktop/BibleTrivia/src/screens/QuizScreen.js)
- Update `handleFiftyFifty` and `handleRevealVerse` logic to skip coin deduction if `progress.isPro` is true.
- Update the power-up button UI to display "FREE" instead of coin costs for Pro users.

### [Purchases Utility]

#### [MODIFY] [purchases.js](file:///Users/media/Desktop/BibleTrivia/src/utils/purchases.js)
- Ensure `presentPaywall` returns a boolean representing the upgrade success state more reliably.

## Verification Plan

### Automated Tests
- N/A (Manual verification on device/simulator is required for IAP).

### Manual Verification
- **Settings Screen**: Tap "Upgrade" and verify the RevenueCat Paywall (or fallback Upgrade Wall) appears.
- **Shop Screen**: Purchase a Pro package and verify `isPro` status updates in `ProgressContext`.
- **Quiz Screen**: As a Pro user, use 50/50 and Verse Reveal and verify coins are not deducted.
- **Journey Screen**: Verify that clicking a "Pro Era" (e.g., Parables) opens the Upgrade Wall for non-Pro users.
