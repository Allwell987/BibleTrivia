# Walkthrough: RevenueCat Configuration Fix

This artifact documents the resolution for RevenueCat **Error 23** (Invalid Store Registration) and the necessary steps to validate the fix in native builds.

## 🛠️ Changes Applied

1.  **`app.json` updated**: Added explicit `skuAndroidList` and `skuIosList` to the `react-native-purchases` plugin configuration. This is required for Expo's RevenueCat plugin to correctly register the product IDs with the native store modules during the prebuild process.
2.  **`package.json` updated**: Added a convenience script `"prebuild:clean": "npx expo prebuild --clean"` to streamline the recovery process.
3.  **`FIXES_SUMMARY.md` updated**: Documented the root cause and solution for Error 23.
4.  **`IMPLEMENTATION_CHECKLIST.md` updated**: Marked the configuration task as needing verification.

## 🚀 Next Steps

To apply these changes to your native iOS and Android projects, follow these steps in order:

### 1. Clean Native Projects
Run the new clean script to delete existing `ios/` and `android/` folders and regenerate them with the corrected configuration:
```bash
npm run prebuild:clean
```

### 2. Rebuild Native Apps
Trigger a fresh build to ensure the native code matches the new configuration:

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

### 3. Verify in Native Runtime
1.  Navigate to the **Shop** screen.
2.  Attempt to purchase a coin package (e.g., 500 Coins).
3.  Confirm that the native payment sheet appears without **Error 23**.
4.  Verify that products are fetched correctly from the store (prices should be localized).

---

**Note:** Error 23 is often caused by a mismatch between the product IDs in the code and the Store dashboards, or by the native SDK not being aware of these IDs at build time. The `app.json` update ensures the SDK is aware of them.
