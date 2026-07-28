# Launch Go/No-Go Report (2026-04-04)

## Decision
NO-GO for store submission today.

## Readiness Snapshot
- Engineering quality gates: PASS
- Runtime configuration safety: PARTIAL
- Store operations readiness: PARTIAL
- Data security policy: PASS (tightened)
- Release hygiene: PARTIAL (generated artifacts cleaned, working tree still not release-clean)

## Pass/Fail Checklist

### Build and Quality
- PASS: Lint passes.
- PASS: Tests pass (13/13 suites, 70/70 tests).
- PASS: Expo doctor passes (16/16 checks).

### App Configuration
- PASS: iOS and Android IDs defined in app config.
- PASS: AdMob configured through Expo plugin in app config.
- PASS: Doctor prebuild sync false-positive check is intentionally disabled for this prebuild repo.

### Environment and Secrets
- FAIL: Required production env keys missing in current .env:
  - EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID
  - EXPO_PUBLIC_REVENUECAT_IOS_KEY
  - EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
- PASS: .env.example documents all required keys.
- PASS: Startup config health checks include interstitial + RevenueCat keys.
- PASS: Purchases initialization blocks production startup when RevenueCat keys are invalid/test keys.

### Security
- PASS: Firestore rules restricted to authenticated user access on /users/{userId}.
- PASS: Catch-all read/write denied for other paths.

### Store Listing and Metadata
- PASS: Production checklist bundle/package IDs aligned with app config.
- NEEDS OWNER: Apple Developer and Google Play accounts confirmed and active.
- NEEDS OWNER: App privacy policy URL hosted publicly (document exists in repo, but hosted URL not verified).
- NEEDS OWNER: Store screenshots complete for all required device classes.
- NEEDS OWNER: IAP products configured and tested in App Store Connect / Play Console / RevenueCat.

### Release Hygiene
- FAIL: Working tree currently has extensive staged/unstaged/untracked changes.
- PASS: Generated Android Metro/assets noise removed from working tree.
- PASS: .gitignore now excludes Android generated assets and bundles.

## Required Actions Before GO
1. Set production env values for missing AdMob and RevenueCat keys.
2. Run real-device QA on iOS and Android, including login, ads, purchases, and daily challenge flow.
3. Host privacy policy publicly and place URL in both store consoles.
4. Verify IAP end-to-end in sandbox/TestFlight/internal testing tracks.
5. Clean release branch to only intended release changes.
6. Cut a release candidate from a clean commit, rerun lint/tests/expo-doctor, then build production binaries.

## Evidence Sources
- app.json
- package.json
- eas.json
- .env.example
- src/utils/configHealth.js
- src/utils/purchases.js
- firestore.rules
- PRODUCTION_CHECKLIST.md
- git status (local working tree)
