# Android Native Design System

Status: active foundation baseline.

Purpose: define the native Android visual system before rebuilding all screens.

## Principles

- Phone-first, Persian-first, RTL-first.
- Native Compose UI, not web layout translated into Android.
- Stable web behavior parity, not visual copying.
- Compact, reachable controls for repeated game use.
- No default Material-only look as final product direction.
- No card-in-card screen structures.
- No clipped content or unreachable primary action.

## Current Foundation

- `ui/theme/DominoyarTheme.kt`
  - app color scheme
  - typography scale
  - shape scale
  - RTL composition
  - status/navigation bar integration
- `ui/components/DominoyarComponents.kt`
  - `DominoPanel`
  - `DominoTextField`
  - `DominoPrimaryButton`
  - `DominoSecondaryButton`
  - `DominoSegmentedControl`
  - `DominoMessagePanel`
- `ui/screens/auth/AuthScreen.kt`
  - auth consumer of the design system
- `ui/screens/app/AppShell.kt`
  - logged-in shell and bottom navigation
- `ui/screens/quickgame/QuickGameScreen.kt`
  - quick-game setup, scoring, result/reset surface
- `ui/screens/profile/ProfileScreen.kt`
  - profile, password, passkey/security surface
- `ui/screens/settings/SettingsScreen.kt`
  - local settings surface

## Font Strategy

The stable web app uses the YekanBakh4 Pro variable runtime subset from:

- `public/fonts/YekanBakh-VF.woff2`
- `public/fonts/YekanBakh-VF.woff`

The native Android app uses the YekanBakh4 Pro TTF runtime subset from:

- `app/src/main/res/font/yekanbakh_light.ttf`
- `app/src/main/res/font/yekanbakh_regular.ttf`
- `app/src/main/res/font/yekanbakh_semibold.ttf`
- `app/src/main/res/font/yekanbakh_bold.ttf`
- `app/src/main/res/font/yekanbakh_extrabold.ttf`

Do not add external downloadable font providers. Do not copy the full licensed source font bundle into the Android app or web deployment; only the runtime subsets above belong in app surfaces.

## Component Rules

- Primary button: single strongest action per panel.
- Secondary button: passkey, biometric, cancel, or non-primary movement.
- Segmented control: mode switch, auth switch, game mode selection where options are mutually exclusive.
- Text fields: labels must always be visible; form screens must be keyboard-safe.
- Message panel: user-facing error/status text, not raw debug output.
- Panels: only top-level functional grouping. Do not nest panels inside panels.

## Verification

Every visual pass must produce:

- debug build
- emulator install/open
- preview matrix from `scripts/dev/android_preview_matrix_windows.cmd`
- screenshot for login/auth baseline
- screenshot for any alternate state changed in the pass
- focused activity confirmation
- filtered logcat crash check

Current screenshots:

- `test-results/android-design-system-foundation.png`
- `test-results/android-design-system-register.png`
- `test-results/android-native-app-auth.png`
- `test-results/android-preview-auth-register.png`
- `test-results/android-preview-shell-light.png`
- `test-results/android-preview-shell-dark.png`
- `test-results/android-preview-game-scoring.png`
- `test-results/android-preview-profile.png`
- `test-results/android-preview-settings-dark.png`
- `test-results/android-preview-compact-auth-register.png`
