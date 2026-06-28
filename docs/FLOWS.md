# User Flows
Last reviewed: 2026-04-25 UTC

## Authentication
1. User signs up with name, username, email, and password.
2. User logs in with email or username plus password.
3. Remember Me keeps session continuity using stored auth token behavior.
4. Logout revokes the current session on the backend when possible.

## Quick Game
1. User chooses one of the quick-game modes: 2-player, 3-player, or 4-player (2v2).
2. User enters only the names needed for that mode:
   - 2-player and 3-player: direct player names
   - 4-player: direct team names only
3. User configures point cap, games per set, and sets per night.
4. User starts scoring immediately.
5. Game state can continue locally if the browser is refreshed mid-session.
6. Quick game setup is disposable and does not create stored player records.

## Profile And Settings
1. Profile page allows name, username, and email update.
2. Password can be changed using the current password.
3. Settings page manages sound, haptics, PWA install guidance, and update checks.
4. Theme switching is available from the header and applies globally.

## Navigation
- Active routes are:
  - `/`
  - `/profile`
  - `/settings`
- Drawer navigation is the main route switcher.
- Page hints provide route-specific help.

## PWA
1. On Android/desktop browsers that support install prompts, the app can expose an install button.
2. On iOS Safari, the app provides manual install instructions instead of a true native install prompt.
3. Update checks are user-controlled from the settings/install surface.
4. Offline fallback and service-worker caching support installed-web usage.
