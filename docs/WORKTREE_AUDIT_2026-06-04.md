# Worktree Audit - 2026-06-04

Purpose: classify the dirty working tree before new project work.

## Result

The dirty tree is not random. It is mostly a deliberate stable web/PWA plus backend plus Android-native expansion, with legacy single-screen/local-storage files removed.

No tracked source was reverted. No files were deleted.

## Counts After Ignore Cleanup

- Tracked dirty entries: 33
- Visible untracked entries: 242, including this audit report
- Generated/local-only entries hidden by `.gitignore`: Android Gradle cache/build output, Playwright `test-results/`, local env files, and the full licensed font source bundle.

## Keep: Active Product Work

Tracked modified files that belong to the current stable web/PWA rewrite:

- `App.tsx`
- `components/Auth.tsx`
- `components/ModeSelector.tsx`
- `components/RecapModal.tsx`
- `components/Scoreboard.tsx`
- `components/TeamNameSetup.tsx`
- `components/ThemeSwitcher.tsx`
- `components/icons.tsx`
- `constants.ts`
- `context/AuthContext.tsx`
- `context/GameContext.tsx`
- `index.html`
- `index.tsx`
- `package.json`
- `types.ts`
- `vite.config.ts`
- `README.md`
- `DOCUMENTATION.md`

Visible untracked files that belong to the active app surface:

- `components/AppHeader.tsx`
- `components/ConnectivityBanner.tsx`
- `components/ErrorBoundary.tsx`
- `components/PageHintsModal.tsx`
- `components/PwaInstallGuide.tsx`
- `components/ToastContainer.tsx`
- `components/UpdateBanner.tsx`
- `context/PwaContext.tsx`
- `context/ToastContext.tsx`
- `context/UIActionsContext.tsx`
- `hooks/usePullToRefresh.ts`
- `hooks/useWakeLock.ts`
- `lib/account.ts`
- `lib/api.ts`
- `lib/feedback.ts`
- `lib/preferences.ts`
- `pages/AccessPage.tsx`
- `pages/PlayPage.tsx`
- `pages/ProfilePage.tsx`
- `pages/SettingsPage.tsx`
- `styles.css`
- `vite-env.d.ts`
- `public/**`
- `tests/**`
- `playwright.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `package-lock.json`
- `.env.example`

Backend and database files to keep:

- `server/api/**`
- `prisma/schema.prisma`
- `prisma/migrations/**`

Ops and governance files to keep:

- `.github/workflows/roadmap-wave0.yml`
- `scripts/**`
- `docs/**`

Android-native source/docs to keep:

- `android-native/README.md`
- `android-native/android-app/README.md`
- `android-native/android-app/app/src/**`
- `android-native/android-app/*.gradle.kts`
- `android-native/android-app/gradle/**`
- `android-native/android-app/gradlew`
- `android-native/android-app/gradlew.bat`
- `android-native/compliance/**`
- `android-native/contracts/**`
- `android-native/specs/**`

## Retire: Legacy Tracked Files Deleted By Current Direction

These deleted tracked files match the stable web/PWA deletion plan and have no live source references after the rewrite:

- `components/AIAnalysisModal.tsx`
- `components/AIAvatarGeneratorModal.tsx`
- `components/History.tsx`
- `components/PlayerManagementModal.tsx`
- `components/ProfileManager.tsx`
- `components/Stats.tsx`
- `components/TrashTalkModal.tsx`
- `components/charts/BarChart.tsx`
- `lib/players.ts`
- `lib/stats.ts`
- `lib/storage.ts`
- `metadata.json`

Root PWA assets retired because the active Vite/public contract now serves them from `public/`:

- `manifest.json`
- `sw.js`

## Ignore: Generated Or Local-Only

Added ignore coverage for:

- `.env`, `.env.*`, while keeping `.env.example`
- `test-results/`
- `playwright-report/`
- `android-native/android-app/.gradle/`
- `android-native/android-app/**/build/`
- `android-native/android-app/local.properties`
- `Yekan Bakh - Pro/`

Added `.gitattributes` to normalize source files to LF and mark binary assets as binary.

## Verification

- `npm run build`: pass
- `npx prisma validate` with dummy `DATABASE_URL`: pass
- `git diff --check`: pass
- Live deployment-critical parity was already checked before this audit and passed.

## Remaining Decisions

- Stage/commit the stable web/PWA/backend/docs/Android source set as the new baseline.
- Keep the full `Yekan Bakh - Pro/` source bundle out of Git; only `public/fonts/YekanBakh-VF.woff*` should be tracked for runtime use.
- Do not restore deleted history/stats/AI/player-storage files unless the product scope changes.
- Treat Persian mojibake in visible UI text as a separate quality issue before release polish.
