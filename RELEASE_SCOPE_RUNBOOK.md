# Release Scope Runbook (2026-04-04)

This runbook prepares a clean release-candidate (RC) commit without deleting any work.

## Current Risk
- The index already contains staged files while many additional files are unstaged.
- If you commit now, the staged subset is likely incomplete and inconsistent.

## Safe Strategy
1. Clear the staged index only (no working-tree data loss).
2. Stage a minimal RC scope with production blockers fixed.
3. Verify with lint/tests/doctor.
4. Commit only that scoped set.

## Step 1: Clear Staged Index (Safe)
```bash
git restore --staged .
```

## Step 2: Stage Minimal RC Scope
Use this first-pass scope to ship hardening and readiness updates.

```bash
git add \
  .env.example \
  .gitignore \
  PRODUCTION_CHECKLIST.md \
  LAUNCH_GO_NO_GO.md \
  app.json \
  package.json \
  package-lock.json \
  .firebaserc \
  firebase.json \
  firestore.indexes.json \
  firestore.rules \
  src/utils/configHealth.js \
  src/utils/purchases.js
```

## Optional Additions (Only If Intended For This RC)
If this RC also includes gameplay and monetization UI changes, additionally stage:

```bash
git add \
  App.js \
  src/screens/QuizScreen.js \
  src/screens/ResultScreen.js \
  src/utils/ads.js \
  src/utils/share.js \
  src/utils/sounds.js
```

If this RC includes only bugfix tests, additionally stage:

```bash
git add \
  __tests__/QuizFlow.test.js \
  __tests__/ResultScreen.test.js
```

## Explicitly Defer For Now
Keep these out of the release commit unless intentionally shipping those features now:
- `src/screens/CustomQuizScreen.js`
- `src/screens/CollectionScreen.js`
- `src/screens/ReflectionsScreen.js`
- `src/data/additionalQuestions.js`
- `bible-app-roadmap.md`
- `CONTEXT_SUMMARY.md`
- `IMPLEMENTATION_CHECKLIST.md`
- `AGENTS.md`
- `FIXES_SUMMARY.md`

## Step 3: Verify Staged Scope
```bash
git diff --name-only --cached
```

Expected: only files intentionally included in RC.

## Step 4: Run Gates On Current Workspace
```bash
npm run lint
npm test
npx expo-doctor
```

## Step 5: Commit Scoped RC
```bash
git commit -m "chore(release): production hardening and launch readiness"
```

## Notes
- This runbook never uses hard reset or destructive git commands.
- Unstaged work remains intact for follow-up commits.
