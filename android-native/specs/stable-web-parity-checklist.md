# Android Stable Web Parity Checklist

Status: active implementation checklist.

Purpose: make Android screen work traceable to the stable web/PWA contract without adding archived or demo scope.

## Implementation Status - 2026-06-07

Implemented in the first native app pass:

- native auth route
- logged-in app shell with Game/Profile/Settings routes
- quick-game setup for 2-player, 3-player, and 4-player 2v2
- quick-game score entry, winner detection, and reset
- Room-backed active quick-game continuation
- profile update and password change actions
- settings for theme, sound, haptics, and notifications
- YekanBakh4 Pro runtime fonts on web and Android
- debug-only preview activity for deterministic emulator screenshots of logged-in routes
- restored active quick games preserve stored mode and round count

Still requiring hardening before release:

- production-session manual smoke for login/register/profile/password on a real device or stable emulator input harness
- deeper scoring parity review against the web context
- small-screen screenshots beyond the default Pixel emulator

## Auth

Stable source:

- `components/Auth.tsx`
- `context/AuthContext.tsx`
- `lib/api.ts`
- `android-native/contracts/auth-parity.json`

Android must support:

- login by email
- login by username
- password login
- signup with name, username, email, password
- logout
- session bootstrap from saved token
- invalid login feedback
- duplicate/invalid signup feedback
- network/offline feedback
- password fallback even when passkey/biometric exist

Android must not add:

- recovery admin tools
- broad session management UI
- account deletion unless stable web explicitly retains it
- avatar upload

## Quick Game

Stable source:

- `components/ModeSelector.tsx`
- `components/TeamNameSetup.tsx`
- `components/Scoreboard.tsx`
- `context/GameContext.tsx`
- `android-native/contracts/quick-game-parity.json`

Android must support:

- 2-player quick game
- 3-player quick game
- 4-player 2v2 quick game
- manual disposable player names
- manual disposable team names for 4-player 2v2
- approved point caps
- score entry
- score validation
- winner detection
- reset/new game flow
- local continuation
- offline play once the app is available

Android must not add:

- saved player CRUD
- broad persisted history
- stats screens
- spectator links
- realtime sync

## Profile

Stable source:

- `pages/ProfilePage.tsx`
- `lib/account.ts`
- `server/api/routes/users.js`

Android must support:

- view current profile
- edit name
- edit username
- edit email
- change password
- protected endpoint error feedback

Android must not add:

- avatar management
- account export
- recovery request viewer
- broad security event timeline

## Settings

Stable source:

- `pages/SettingsPage.tsx`
- `lib/preferences.ts`
- `android-native/contracts/preferences-parity.json`

Android must support:

- theme preference
- sound preference
- haptics preference
- local persistence through DataStore

Android may support only if roadmap-approved:

- biometric unlock preference
- notification preference

Android must not add:

- web PWA install/update controls
- server diagnostics panels
- removed-route settings

## Native-Only Additions

Allowed when implemented with fallback and verification:

- encrypted token storage
- biometric local re-unlock
- passkey login/register
- notification channels for approved reminders/security events
- offline local quick-game continuation

## UI Quality Checklist

Each screen must pass:

- Persian RTL layout
- no clipped content
- no horizontal overflow
- primary action reachable
- visible focus/field labels
- keyboard-safe form behavior
- touch targets suitable for phone use
- light/dark theme support
- status/navigation bars integrated
- compact phone screenshot captured
- filtered logcat has no crash lines

## Release Blockers

Block Android release if:

- any archived feature is required for runtime
- any stable web parity requirement is missing without documented exception
- quick game cannot run offline after setup/session availability
- auth fallback is unavailable
- core screens have clipped content or unreachable primary actions
- compatibility matrix defects are untriaged
