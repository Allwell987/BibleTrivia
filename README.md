
# 📖 Bible Trivia — React Native (Expo SDK 55)

A feature-rich, beautifully designed Bible trivia mobile app with 3 difficulty levels, real-time cloud sync, and a gamified experience.

---

## 📁 Folder Structure

```
BibleTrivia/
├── App.js                          ← Entry point & navigation
├── app.json                        ← Expo app config (SDK 55)
├── package.json                    ← All dependencies (Auth, Firebase, Audio)
└── src/
    ├── config/
    │   └── firebase.js             ← Firebase initializeApp & Firestore
    ├── context/
    │   ├── AuthContext.js          ← Apple & Google Sign-In with Firebase
    │   ├── ProgressContext.js      ← Wisdom Economy & Cloud Sync
    │   └── ThemeContext.js         ← Dark/Light mode management
    ├── data/
    │   └── questions.js            ← 100+ categorized Bible questions
    ├── utils/
    │   └── ads.js                  ← Rewarded Ad logic (AdMob)
    └── screens/
        ├── HomeScreen.js           ← Dashboard with Verse of the Day & Ads
        ├── QuizScreen.js           ← Gamified quiz with Hint System
        ├── ResultScreen.js         ← Score assessment & answer review
        ├── SettingsScreen.js       ← Login, sound, haptic & theme toggles
        └── ...                     ← Stats, Achievements, Leaderboard
```

---

## 🛠 Features

### **Gameplay & UI**
- **3 Difficulty Levels**: Easy, Medium, and Hard (Medium/Hard are locked until you score 70%+ on the previous level).
- **100+ Questions**: Categorized into Gospels, OT, NT, Wisdom, and History with full scripture references and explanations.
- **Dynamic Timer**: Encourages fast thinking while keeping the game engaging.
- **Rich Animations**: Smooth transitions, shaking for errors, and success particles.
- **Haptics & Audio**: Integrated `expo-haptics` and `expo-audio` for a premium feel.

### **Monetization & Economy**
- **Wisdom Coins**: Earn coins by playing, claiming daily rewards, or watching videos.
- **Hint System**: Use your coins to get a **50/50** or see the **Scripture Reference**.
- **Rewarded Ads**: integrated Google AdMob for "Get Free Wisdom" rewards.
- **Daily Blessings**: Encourages daily retention with 24-hour reward cycles.

### **Personalization & Cloud**
- **Authentication**: Seamless Apple ID and Google Sign-In via `expo-auth-session`.
- **Cloud Sync**: Automatically uploads your progress to **Firebase Firestore**.
- **Verse of the Day**: A fresh scripture every time you open the app.
- **Dark/Light Mode**: Full theme customization in the Settings screen.

---

## 🚀 Setup & Run

```bash
# 1. Clone & Enter
cd BibleTrivia

# 2. Install
npm install


# 3. Configure Firebase & Auth
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In your project settings, add a new web app and copy the config object.
3. Replace the placeholder values in `src/config/firebase.js` with your real credentials:
    - `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`
4. For Google Sign-In:
    - Go to Firebase > Authentication > Sign-in method > Google > Enable
    - Add your iOS and Android OAuth client IDs to `GOOGLE_CLIENT_IDS` in `src/context/AuthContext.js`
    - [Guide: Get Google OAuth Client IDs](https://developers.google.com/identity/sign-in/ios/start-integrating)
5. For Apple Sign-In:
    - Go to Firebase > Authentication > Sign-in method > Apple > Enable
    - Follow [Expo Apple Auth guide](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)


# 4. Start
npx expo start
```

---

## 🧠 Tech Stack

| Technology | Usage |
|---|---|
| **React Native (Expo)** | Mobile framework |
| **Firebase Auth** | User management (Apple & Google) |
| **Firestore** | Real-time cloud synchronization |
| **Google AdMob** | Monetization via Rewarded Ads |
| **Context API** | State management (Auth, Theme, Progress) |
| **Animated API** | UI polish and feedback |
| **AsyncStorage** | Local persistence for offline play |

---


## 🏆 Production Checklist (2026)
- [x] Expo dependencies deduplicated and up-to-date
- [x] Unit tests for all major components (coverage >70%)
- [x] Firebase credentials and Auth client IDs configured
- [ ] Final feature graphic & device screenshots
- [ ] Privacy Policy and Support URLs set
- [ ] Test on real iOS & Android devices
- [ ] App Store & Play Store submission

See `PRODUCTION_CHECKLIST.md` for a full launch guide.

## Automated Store Release

After the store listings, production credentials, and EAS project credentials are configured, run:

```bash
npm run release
```

This waits for production iOS and Android builds, then submits the latest artifact for each platform. The current EAS profile sends Android to the `internal` track; change `submit.production.android.track` in `eas.json` to `production` when the app is ready for public rollout.

For CI, provide `EXPO_TOKEN` and configure the Apple and Google Play credentials required by EAS. The release commands are non-interactive by design, so missing credentials stop the release instead of waiting for input.
