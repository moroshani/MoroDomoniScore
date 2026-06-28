# Native Android Product Plan - 2026-06-06

Status: active execution contract for rebuilding the Android app as a first-class native product.

## Decision

The Android app must be rebuilt as a real native Android product, not as a WebView, not as a PWA, and not as a lightly styled scaffold. The current Android UI should be treated as prototype code. Existing data, API, security, Room, Retrofit, DataStore, token, passkey, biometric, Gradle, and emulator foundations may be reused after review, but screen structure and visual direction must be redesigned from the stable product contract.

## Product Contract

Android must match the stable web/PWA contract for:

- signup
- login
- logout
- quick game setup
- quick game scoring
- quick game win/reset flow
- 2-player quick game
- 3-player quick game
- 4-player 2v2 quick game
- local quick-game continuation
- minimal profile: name, username, email, password change
- minimal settings: theme, sound, haptics

Android may exceed stable web only where the Android roadmap explicitly allows native capabilities:

- stronger offline quick-game continuity
- encrypted local token/session storage
- biometric local re-unlock
- passkey registration/login where supported
- Android notification support for approved low-frequency use cases

## Explicit Non-Goals

Do not add or depend on:

- WebView or PWA wrapper behavior
- persisted players CRUD
- history CRUD
- stats screens
- spectator or realtime sync
- alliance/shared-identity features
- chat/lobby surfaces
- AI/demo features
- broad account management beyond stable profile/password needs
- store/distribution UI beyond the release lane docs

## Source Of Truth

Stable web/PWA remains the behavior reference. Android implementation must consult:

- `components/Auth.tsx`
- `components/ModeSelector.tsx`
- `components/TeamNameSetup.tsx`
- `components/Scoreboard.tsx`
- `pages/PlayPage.tsx`
- `pages/ProfilePage.tsx`
- `pages/SettingsPage.tsx`
- `context/AuthContext.tsx`
- `context/GameContext.tsx`
- `lib/account.ts`
- `lib/preferences.ts`
- `android-native/contracts/auth-parity.json`
- `android-native/contracts/quick-game-parity.json`
- `android-native/contracts/preferences-parity.json`
- `android-native/specs/stable-web-parity-checklist.md`
- `android-native/specs/native-design-system.md`

## Architecture Target

Keep Android native and modular:

```text
app/src/main/java/com/morodomino/android/
  MainActivity.kt                  # activity wiring only
  data/                            # Room, Retrofit, DataStore, token store
  domain/                          # product models and game rules
  security/                        # biometric, passkey, secure storage helpers
  notifications/                   # notification channels and approved events
  ui/
    navigation/                    # native screen routing
    theme/                         # final visual system
    components/                    # shared Android-native components
    screens/
      auth/
      game/setup/
      game/scoring/
      game/result/
      profile/
      settings/
      shell/
```

`MainActivity.kt` must not own screen layout details after the rebuild. It should initialize app dependencies, collect state, host navigation, and delegate UI to screen modules.

## Visual Standard

The Android app must be phone-first and Persian-first. It should feel like the same product as the stable web app, but it does not need to mimic web layout. It should be at least as polished as the web app.

Required visual decisions before screen work continues:

- Persian RTL layout direction by default.
- A real Android typography strategy, including approved Persian font handling.
- Status bar and navigation bar colors integrated with the active screen.
- Light and dark theme support.
- Compact phone spacing scale.
- Touch targets at or above Android accessibility expectations.
- Distinct styles for primary actions, secondary actions, destructive actions, inputs, segmented controls, score panels, and settings rows.
- No default Material-only look unless it is intentionally customized.
- No oversized form-first pages that waste phone vertical space.
- No card-in-card layout.
- No clipped content at the bottom of the screen.

## Screen Inventory

### 1. App Shell

Purpose: provide native top-level structure and state boundaries.

Required:

- loading/bootstrap state
- unauthenticated auth route
- authenticated game route
- profile route
- settings route
- logout path
- offline/session warning surface
- native back behavior

### 2. Auth

Purpose: stable password-first signup/login continuity.

Required:

- login with email or username
- login with password
- signup with name, username, email, password
- clear 400/401/403/409 and network error messages
- password fallback always available
- passkey login where supported
- biometric local re-unlock where a saved session exists
- keyboard-safe layout

### 3. Quick Game Setup

Purpose: start approved quick game modes without saved-player dependencies.

Required:

- 2-player mode
- 3-player mode
- 4-player 2v2 mode
- disposable manual names/team names
- point caps from parity contract
- games-per-set and sets-per-night only if stable web requires them in the current contract
- no player CRUD

### 4. Quick Game Scoring

Purpose: the primary repeated-use Android screen.

Required:

- readable scores at a glance
- round score entry
- immediate validation
- current game/set context where stable web uses it
- winner state
- reset/new game flow
- local continuation after app restart
- offline usability

### 5. Result / Reset

Purpose: finish quick game cleanly without persisted history scope.

Required:

- winner display
- final scores
- continue/new game action
- no broad history/stat persistence

### 6. Profile

Purpose: minimal account management.

Required:

- edit name
- edit username
- edit email
- change password
- clear protected-action feedback

### 7. Settings

Purpose: minimal local preferences.

Required:

- theme
- sound
- haptics
- optional biometric unlock preference if security roadmap keeps it
- notification preference only when approved notification behavior exists

## Implementation Phases

### Implementation Snapshot - 2026-06-07

Completed locally in the first native app pass:

- `MainActivity.kt` now owns dependency wiring and delegates UI to screen modules.
- Auth remains a native Compose route using the shared design system.
- Logged-in navigation is handled by `ui/screens/app/AppShell.kt`.
- Quick-game setup/scoring/reset is implemented in `ui/screens/quickgame/QuickGameScreen.kt`.
- Profile/password/security controls are implemented in `ui/screens/profile/ProfileScreen.kt`.
- Theme, sound, haptics, and notification settings are implemented in `ui/screens/settings/SettingsScreen.kt`.
- Active quick-game sessions and round scores are persisted through Room.

Release-hardening items remain:

- complete logged-in visual screenshot matrix
- manual Android form smoke or a debug-only UI test harness
- full scoring-rule parity review against `context/GameContext.tsx`
- small-phone and dark-mode visual pass
- production release signing/distribution checks

### Phase A: Planning Lock

Deliver:

- this plan
- parity checklist
- current scaffold assessment

Exit:

- user accepts Android rebuild direction
- no additional coding until contract is clear

### Phase B: Design System Foundation

Deliver:

- final Compose theme
- Persian font strategy
- components for buttons, inputs, cards, segmented controls, top shell, message panels
- status/nav bar integration
- screenshot baseline

Exit:

- auth shell screenshot is visually approved
- no clipped content on compact phone emulator
- unresolved font packaging decisions are documented before moving to full-screen rebuilds

### Phase C: Auth Rebuild

Deliver:

- native auth screen
- login/register flows
- passkey/biometric secondary flows
- error/loading/offline states

Exit:

- password login/register works
- fallback paths are visible and understandable
- emulator screenshots approved

### Phase D: Quick Game Rebuild

Deliver:

- setup screen
- scoring screen
- result/reset flow
- local continuation

Exit:

- 2P/3P/4P flows match parity contract
- quick game works offline after app start/session availability
- no saved-player/history/stat dependencies

### Phase E: Profile And Settings

Deliver:

- minimal profile screen
- password change
- minimal settings screen
- local preference persistence

Exit:

- stable web profile/settings contract matched
- no broad account-management scope added

### Phase F: Compatibility Hardening

Deliver:

- small phone screenshot
- normal phone screenshot
- large phone/tablet screenshot when available
- Persian RTL check
- English LTR check if an English path remains
- font scaling check
- offline/online/reconnect check

Exit:

- no public release until matrix defects are triaged

## Verification Gates

Every Android screen pass must run:

```powershell
cd .\android-native\android-app
.\gradlew.bat assembleDebug
```

Every UI pass must also run:

```powershell
.\scripts\dev\android_preview_windows.cmd
```

Required evidence:

- APK builds successfully
- app installs and launches
- focused activity is `com.morodomino.android/.MainActivity`
- filtered logcat contains no crash lines
- screenshot saved under `test-results/`
- no obvious clipping, overflow, or unreachable primary action
- keyboard behavior checked for form screens

## Current Scaffold Assessment

The current Android implementation proves that Gradle, Compose, Room, Retrofit, DataStore, encrypted token storage, biometric/passkey helpers, and emulator preview can run. It does not prove product-ready UI.

Treat as reusable only after review:

- backend API contracts
- repositories
- local database entities/DAO
- token storage
- passkey/biometric helpers
- notification channels
- Windows Android tooling scripts

Treat as disposable or rewrite-first:

- auth screen layout
- quick-game screen layout
- profile/settings layout if present
- generic Material-only styling
- `MainActivity.kt` screen ownership

## Guardrail

If a proposed Android task cannot be mapped to this plan, the stable web contract, or the Android roadmap files, do not implement it. Document it for demo/future review instead.
