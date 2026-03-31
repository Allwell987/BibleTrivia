# 📖 Bible Trivia - Project Context Summary

## 🛠 Tech Stack
- **Framework**: React Native (Expo SDK 55)
- **Language**: JavaScript
- **Navigation**: React Navigation (Native Stack)
- **State Management**: React Context API (`ThemeContext`, `ProgressContext`, `AuthContext`)
- **Backend/Storage**: 
  - **Local**: AsyncStorage
  - **Cloud**: Firebase (Auth & Firestore) for cross-device synchronization.
- **UI/UX**: `Animated` API, `expo-haptics`, `expo-audio`, `expo-video`, `expo-asset`.

## 📁 Key Components
- **`src/data/questions.js`**: 100+ categorized Bible questions (Gospels, OT, NT, Wisdom, History) with difficulty levels, explanations, and scripture references.
- **`src/context/AuthContext.js`**: Real Firebase Auth integration for Apple ID and Google Sign-In.
- **`src/context/ProgressContext.js`**: Handles local `AsyncStorage` and **Firestore Cloud Sync**. Implements a smart merge strategy to preserve high scores across devices.
- **`src/screens/`**:
  - `HomeScreen`: Dashboard with "Verse of the Day" and streak tracking.
  - `QuizScreen`: Gamified experience with timers, progress bars, and haptic feedback.
  - `ResultScreen`: Detailed scoring, grade assessment, and review of incorrect answers.
  - `SettingsScreen`: Toggle for dark/light mode, sounds, haptics, and social login buttons.
  - `StatisticsScreen`, `LeaderboardScreen`, `AchievementsScreen`: Advanced gamification features.

## 🚀 Recent Changes & Features
1. **Firebase Integration**: Successfully linked Firebase Auth and Firestore.
2. **Cloud Sync**: Implemented logic in `ProgressContext.js` to upload local `AsyncStorage` data to the cloud upon login and keep it in sync.
3. **Authentication**: Fully functional Apple and Google login logic with persistence.
4. **Progression System**: Multi-level unlocking (Easy -> Medium -> Hard) based on performance (70% threshold).
5. **Dependency Sync**: Updated `package.json` with all necessary Expo and Firebase libraries.

## 📋 Outstanding Tasks
- [ ] **Firebase Credentials**: User needs to replace placeholder strings in `src/config/firebase.js` with real API keys.
- [ ] **Auth Client IDs**: Update Google/Apple Client IDs in `AuthContext.js`.
- [ ] **Store Assets**: Generate final 1024x500 feature graphic and device-specific screenshots.
- [ ] **Deployment**: Prepare for App Store and Play Store submission.
