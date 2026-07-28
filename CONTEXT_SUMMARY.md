# 📖 Bible Trivia — Session Handoff
_Last updated: April 2, 2026_

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo SDK 55) |
| Language | JavaScript |
| Navigation | React Navigation — Native Stack |
| State | React Context API (`AuthContext`, `ThemeContext`, `ProgressContext`) |
| Local persistence | AsyncStorage (`bible_trivia_*` keys) |
| Cloud sync | Firebase Auth + Firestore (gated by `isFirebaseConfigured`) |
| UI | `Animated` API, `expo-haptics`, `expo-audio` |
| IAP | `react-native-purchases` (mock-safe via `EXPO_PUBLIC_USE_MOCK_PURCHASES`) |
| Ads | AdMob rewarded ads (runtime `require`, degrades gracefully) |
| Analytics | Local event log in AsyncStorage (`src/utils/analytics.js`) |

---

## 🗺 Provider / Route Map

```
App.js
  AuthProvider → ThemeProvider → ProgressProvider → AppNavigator
```

All routes live in `App.js`. Onboarding gate (`isOnboarded()`) runs at startup and redirects to `Quiz` (not `Home`) on first launch — intentional, do not change.

---

## ✅ Completed work (by roadmap phase)

### Phase 1 — Foundation (complete)
- **1.1** Firebase Auth: Apple + Google Sign-In, JWT persistence.
- **1.2** Question DB: 100+ questions in `src/data/questions.js` and `src/data/additionalQuestions.js`, each tagged with `difficulty`, `era`, `bibleBook`, `category`, `insight`, `reflection`, `reference`.
- **1.3** Daily challenge engine: 5-question daily quiz, insight card after each answer, once-per-day lock, **30-day no-repeat dedup** (`seenDailyQuestions` array in `ProgressContext`).
- **1.4** Streak tracking: `currentStreak` / `highestStreak` in `ProgressContext`, Biblical milestone names (`STREAK_MILESTONES`), daily-reset detection.
- **1.5** Onboarding: knowledge-level selector, routes to `Quiz` on completion.

### Phase 2 — Engagement (complete)
- **2.1** Journey Mode / era progression: `ERA_ORDER`, `ERA_REQUIREMENTS`, `eraProgress` map, `unlockedEras` computed by `checkUnlocks()` in `ProgressContext`. UI in `JourneyScreen`.
- **2.2** Character & Bible-book unlocks: `CHARACTERS` / `BIBLE_BOOKS` collectibles, unlock logic inside `checkUnlocks()`, displayed in `CollectionScreen`.
- **2.3** Adaptive difficulty engine: `DifficultyRequirements` (80 % accuracy × 3 sessions → promote; < 40 % → demote), computed in `checkUnlocks()`. UI reads `isUnlocked()` / `getDifficultyInfo()` from context — difficulty lock logic **never** lives in screen code.
- **2.4** "Did You Know?" moment engine — **fully implemented and tested**:
  - `selectDidYouKnowCandidate()` exported from `QuizScreen.js` — pure function, deterministic ordering (wrong answers first, then all questions), deduplication, 30-day anti-repeat window.
  - `appendSeenEntry()` exported from `ProgressContext.js` — prepends fresh entry, prunes > 30-day entries, deduplicates by key, no-op on null key.
  - `seenDidYouKnow: [{key, date}]` array written by both `updateProgress()` and `completeDailyChallenge()`.
  - `ResultScreen` renders the `didYouKnow` card and forwards `fact` to `shareResults()`.
- **2.5** Reflection prompts: per-question `reflection` field, `isDaily` path shows journal input on `ResultScreen`, `saveReflection()` persists to `progress.reflections[]` (capped at 100 entries), viewable in `ReflectionsScreen`.

### IAP / Coin shop (in progress — see `IMPLEMENTATION_CHECKLIST.md`)
- `src/utils/purchases.js`: full IAP flow with mock-safe runtime `require`, 5 product IDs, purchase + restore.
- `src/screens/ShopScreen.js`: browsable coin packages, balance card, restore button.
- `ProgressContext`: `addCoins()`, `earnCoins()`, `spendCoins()` all stable.
- `app.json`: react-native-purchases plugin configured with all 5 SKUs.
- **Blocked**: store console setup (App Store Connect / Google Play Console) — developer action required.

---

## 🧪 Test suite status (April 2, 2026)

Run: `npm test -- --no-coverage`

| Suite | Tests | Status |
|---|---|---|
| `QuizFlow.test.js` | 10 | ✅ all pass |
| `ResultScreen.test.js` | 3 | ✅ all pass |
| `ProgressContext.test.js` | 16 | ✅ all pass |
| All other suites | — | ✅ all pass |

### What the Phase 2 "Did You Know" tests cover

**`QuizFlow.test.js` — `selectDidYouKnowCandidate`**
1. Prefers wrong answers and skips recently-seen keys
2. Falls back to first candidate when all are recently seen
3. Returns `null` when both arrays empty
4. Returns `null` when no valid question objects provided
5. Deduplicates: same question in both arrays counted once, at wrong-answer position
6. Wrong answer deterministically first over unseen correct question
7. Skips recently-seen wrong answer, picks unseen correct question
8. Expired history (> 30 days) is **not** blocked — question available again
9. `null` `seenDidYouKnow` handled gracefully
10. End-to-end: navigates to Result with correct `didYouKnow` payload

**`ProgressContext.test.js` — `appendSeenEntry`**
1. `null` key → no-op
2. `undefined` key → no-op
3. Prepends new entry with today's ISO date
4. New entry placed at front of list
5. Deduplicates by key — refreshes date, removes old copy
6. Prunes entries older than 30 days
7. Empty array input — no throw
8. `undefined` entries input — no throw

---

## 📁 Key file map

| File | Role |
|---|---|
| `App.js` | Provider stack, route registration, startup side-effects |
| `src/context/ProgressContext.js` | **Single source of truth** for coins, unlocks, streaks, era progress, seen-history. `checkUnlocks()`, `appendSeenEntry()` (exported), `updateProgress()`, `completeDailyChallenge()` |
| `src/context/AuthContext.js` | Firebase Auth, Apple/Google sign-in |
| `src/context/ThemeContext.js` | Dark/light theme, `createStyles(colors)` pattern |
| `src/screens/QuizScreen.js` | Quiz loop + `selectDidYouKnowCandidate()` (exported pure fn) |
| `src/screens/ResultScreen.js` | Score, Did You Know card, reflection journal, share |
| `src/screens/HomeScreen.js` | Dashboard, streak, daily challenge entry, Shop button |
| `src/screens/JourneyScreen.js` | Era progression map UI |
| `src/screens/CollectionScreen.js` | Character & Bible book unlock display |
| `src/data/questions.js` | All questions + `QUESTIONS`, `ERAS`, `shuffleArray`, `CATEGORIES` |
| `src/utils/storage.js` | AsyncStorage helpers, `bible_trivia_*` key namespace |
| `src/utils/purchases.js` | IAP logic, mock-safe, 5 product IDs |
| `src/utils/analytics.js` | Local event log |
| `src/utils/configHealth.js` | Startup config warnings |
| `src/components/index.js` | Barrel export for all shared components |
| `firestore.rules` | Auth-gated read/write rules |

---

## 🔜 Next logical tasks (by priority)

### Highest priority
1. **Store console setup** (developer action): create IAP products in App Store Connect + Google Play Console — see `IMPLEMENTATION_CHECKLIST.md` Phases 2 & 3.
2. **Build + device test**: `expo run:ios` / `expo run:android` blocked by missing code-signing certs; resolve or use EAS preview build (`eas build --platform ios --profile preview`).

### Phase 3 — Intelligence (not started)
- **3.1** AI question generation pipeline (Claude API + nightly cron + admin review queue).
- **3.2** Personalized content feed (weighted selection: era 40 %, weak areas 30 %, discovery 30 %).
- **3.3** Weekly themed content packs.

### Phase 4 — Social (not started)
- 4.1 Friends challenge system (async 1-on-1 battles, shareable link).
- 4.2 Weekly leaderboard / battle mode (same 10 Qs for all, resets Monday).
- 4.3 Church groups + group leaderboards.
- 4.4 Shareable result image cards (PNG generation, client-side).

### Phase 5 / ongoing
- Push notifications (`expo-notifications`, FCM).
- Store listing copy updates (mention coin shop feature).
- Accessibility / localization (Yoruba, Igbo, Pidgin).

---

## ⚙️ Dev workflow

```bash
npm install           # install deps
npm test              # run all tests (Jest)
npm run lint          # ESLint
npm start             # Expo Metro bundler

# Native builds (require signing setup)
npm run ios           # expo run:ios
npm run android       # expo run:android

# EAS cloud builds
eas build --platform ios --profile preview
eas build --platform android --profile preview

# After any app.json plugin change
expo prebuild --clean
```

Environment toggles (`.env`):
- `EXPO_PUBLIC_USE_MOCK_PURCHASES=true` — use mock IAP (safe for Expo Go / simulators)
- `EXPO_PUBLIC_*` Firebase keys — see `src/config/firebase.js`

---

## 🔒 Conventions to maintain

- **Theme-aware styles**: every screen uses `createStyles(colors)` + `useTheme()`.
- **AsyncStorage keys**: always prefixed `bible_trivia_*` — never change existing keys.
- **Context-first state**: coins, unlocks, streaks, auth, theme all live in context — no ad-hoc local state for these.
- **Difficulty lock logic lives in `checkUnlocks()`** only — screen code calls `isUnlocked()` / `getDifficultyInfo()`.
- **New screen**: register route in `App.js` + add navigation entry in `HomeScreen` or `SettingsScreen`.
- **New progress field**: update `DEFAULT_PROGRESS`, `mergeProgress`, and all write paths in `ProgressContext`.
- **New env key**: add to `src/utils/configHealth.js` so startup warns on missing config.
- **Tests**: mock contexts/hooks at the top of each test file, mirror style of `QuizFlow.test.js`.
