# Files Index
Last reviewed: 2026-04-25 UTC

Key files for the active product direction.

## Current Runtime Hotspots
### Frontend
- `App.tsx` - app shell and active route wiring.
- `components/Auth.tsx` - signup/login surface.
- `components/AppHeader.tsx` - drawer navigation, install entry point, and quick tools.
- `components/ModeSelector.tsx` - quick-game mode entry.
- `components/TeamNameSetup.tsx` - disposable quick-game setup.
- `components/Scoreboard.tsx` - scoring surface.
- `components/PwaInstallGuide.tsx` - install/update guidance, including iOS manual steps.
- `components/PageHintsModal.tsx` - route-aware help content.
- `pages/PlayPage.tsx` - gameplay route.
- `pages/ProfilePage.tsx` - minimal profile surface.
- `pages/SettingsPage.tsx` - settings and install/update surface.
- `context/AuthContext.tsx` - auth/session state.
- `context/GameContext.tsx` - quick-game rules, continuity, and scoring state.
- `context/PwaContext.tsx` - install/update/offline state and platform detection.
- `lib/api.ts` - API client and token helpers.
- `lib/account.ts` - profile/password helpers.
- `lib/preferences.ts` - local settings persistence.

### Backend
- `server/api/index.js` - API entry and active router composition.
- `server/api/routes/auth.js` - auth flow.
- `server/api/routes/users.js` - profile and password APIs.
- `server/api/bootstrap/ensureImmortalUser.js` - protected admin bootstrap.

### Data
- `prisma/schema.prisma` - current schema, including active and legacy tables.

### Web Platform
- `public/manifest.json` - install metadata.
- `public/sw.js` - service worker and update lifecycle.
- `public/offline.html` - offline fallback.
- `public/fonts/` - self-hosted YekanBakh4 Pro web runtime font assets.
- `public/icons/` - self-hosted icon assets.

### Native Android Planning
- `android-native/README.md` - Android foundation overview.
- `android-native/contracts/auth-parity.json` - auth parity contract.
- `android-native/contracts/preferences-parity.json` - settings parity contract.
- `android-native/contracts/quick-game-parity.json` - quick-game parity contract.
- `android-native/specs/stable-web-parity-checklist.md` - Android stable web parity checklist.
- `android-native/specs/native-design-system.md` - Android native design-system baseline.
- `android-native/android-app/app/src/main/res/font/` - native Android YekanBakh4 Pro runtime font assets.
- `android-native/android-app/app/src/main/java/com/morodomino/android/MainActivity.kt` - Android activity wiring.
- `android-native/android-app/app/src/main/java/com/morodomino/android/ui/screens/app/AppShell.kt` - native Android logged-in shell.
- `android-native/android-app/app/src/main/java/com/morodomino/android/ui/screens/quickgame/QuickGameScreen.kt` - native quick-game setup/scoring surface.
- `android-native/android-app/app/src/main/java/com/morodomino/android/ui/screens/profile/ProfileScreen.kt` - native profile/password/security surface.
- `android-native/android-app/app/src/main/java/com/morodomino/android/ui/screens/settings/SettingsScreen.kt` - native settings surface.

## Current Planning Source Of Truth
- `docs/ROADMAP.md`
- `docs/roadmaps/README.md`
- `docs/roadmaps/IMPLEMENTATION_ORDER.md`
- `docs/roadmaps/IMPLEMENTATION_READINESS.md`
- `docs/roadmaps/11-stable-web-pwa/README.md`
- `docs/roadmaps/11-stable-web-pwa/stable-scope-and-deletion-plan.md`
- `docs/roadmaps/12-android-native/README.md`
- `docs/roadmaps/12-android-native/native-product-plan-2026-06-06.md`
- `docs/roadmaps/12-android-native/offline-first-architecture.md`
- `docs/roadmaps/13-demo-web/README.md`

## Historical / Archived Context
- `docs/roadmaps/10-alliance-shared-identity/README.md`
- `docs/roadmaps/_legacy/ROADMAP_2026-02-22.md`

These remain available for history and future reference, but they are not the active execution inputs for the current shipping plan.
