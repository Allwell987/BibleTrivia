# AGENTS.md

## Project map (source of truth)
- Entry point is `App.js`: provider stack is `AuthProvider -> ThemeProvider -> ProgressProvider` and all routes are registered in `AppNavigator`.
- Core state lives in `src/context/ProgressContext.js` (`progress` object + unlock/streak/coin logic). Most gameplay changes eventually touch this file.
- Cloud/auth boundaries are `src/context/AuthContext.js` + `src/config/firebase.js`; local-first persistence is AsyncStorage via `src/utils/storage.js`.
- Primary user loop: `HomeScreen -> QuizScreen -> ResultScreen`, with onboarding gate from `isOnboarded()` in `App.js`.

## Runtime flow and cross-file coupling
- Quiz completion updates progress in bulk (`updateProgress` / `completeDailyChallenge`) from `src/screens/QuizScreen.js`; these write to AsyncStorage and optionally Firestore.
- Difficulty locks are computed in `checkUnlocks()` (`ProgressContext`), not in screen code; UI calls `isUnlocked()` from context.
- Onboarding completion currently routes to `Quiz` (not `Home`) in `src/screens/OnboardingScreen.js`; preserve this unless product intent changes.
- Startup side effects in `App.js` are important: `loadSounds()`, `initAds()`, `initializePurchases()`, `logStartupConfigHealth()`, settings->`setHapticsEnabled()`.

## Integrations and guardrails
- Firebase config uses `EXPO_PUBLIC_*` env keys with placeholders in `src/config/firebase.js`; cloud sync is gated by `isFirebaseConfigured`.
- Firestore rules (`firestore.rules`) require authenticated users for all reads/writes; unauthenticated cloud calls will fail.
- Purchases in `src/utils/purchases.js` support mock mode with `EXPO_PUBLIC_USE_MOCK_PURCHASES=true`; real IAP is optional runtime `require`.
- Rewarded ads in `src/utils/ads.js` also use runtime `require`; if module or ad unit is missing, flows degrade gracefully.
- Analytics are local event logs in AsyncStorage (`src/utils/analytics.js`), not external telemetry.

## Dev workflows that matter here
- Install/start/test/lint:
  - `npm install`
  - `npm test`
  - `npm run lint`
  - `npm start`
- Native modules (`react-native-iap`, AdMob) require native runs, not Expo Go. Use `npm run ios` / `npm run android`.
- If plugin config in `app.json` changes, regenerate native projects (`expo prebuild --clean`) before validating iOS/Android behavior.

## Project conventions to follow
- Theme-aware styling pattern: each screen builds styles with `createStyles(colors)` and reads colors from `useTheme()`.
- Keep persistence keys stable (`bible_trivia_*` namespace in `src/utils/storage.js` and `ProgressContext`).
- Prefer context APIs over ad-hoc state for coins/unlocks/streak/auth/theme.
- Component imports commonly come from barrel file `src/components/index.js`.
- Tests mock contexts/hooks heavily (see `__tests__/QuizFlow.test.js`, `__tests__/OnboardingFlow.test.js`); mirror this style for new screen tests.

## When editing, also check
- New screen/flow: update route registration in `App.js` and any navigation entry points (usually `HomeScreen`/`SettingsScreen`).
- New progress fields: update `DEFAULT_PROGRESS`, `mergeProgress`, and write paths (`saveProgress`, update functions) in `src/context/ProgressContext.js`.
- New env-dependent integration: add key to `src/utils/configHealth.js` so startup warns on missing config.

