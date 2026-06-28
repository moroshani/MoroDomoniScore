# Architecture
Last reviewed: 2026-06-28 UTC

## Codebase Memory MCP Integration
- Binary: `C:/Users/moros/.local/bin/codebase-memory-mcp.exe` (v0.8.1)
- MCP settings: `mcp_settings.json`
- Agent rules: `.kilo/agent/codebase-memory-mcp.md` and `~/.kilocode/rules/codebase-memory-mcp.md`
- Provides 14 tools for code intelligence: `index_repository`, `search_graph`, `query_graph`, `trace_path`, `get_code_snippet`, `get_architecture`, `detect_changes`, `manage_adr`
- Cache directory: `%USERPROFILE%\.cache\codebase-memory-mcp\`

## Frontend
- Vite + React 19 + TypeScript.
- App state is centered on `GameContext`, `AuthContext`, `PwaContext`, `ToastContext`, and `UIActionsContext`.
- Active routes are play, profile, settings, and access/distribution hub.
- Quick game is the main shipped gameplay surface.
- PWA install, update, and offline behavior are handled by `context/PwaContext.tsx` and `public/sw.js`.
- Offline-first continuity for installed web app includes cached auth-profile fallback for offline startup.
- Persian RTL UI is the default experience across the app.

## Backend
- Express API serves auth and minimal user/profile operations.
- Active API runtime is composed in `server/api/index.js`.
- Active route families are:
  - `/api/auth`
  - `/api/users`
  - `/api/health`
- Auth route family now includes passkey/WebAuthn endpoints:
  - `/api/auth/passkey/register/options`
  - `/api/auth/passkey/register/verify`
  - `/api/auth/passkey/login/options`
  - `/api/auth/passkey/login/verify`
- Prisma runs on PostgreSQL.
- Passkey persistence is active in Prisma schema (`Passkey`, `PasskeyChallenge`).
- SMTP is used for login and registration notifications.
- One protected immortal superadmin account is upserted from `IMMORTAL_*` environment values.
- Security headers are applied at app level and are verified in deploy probes.

## Product Surface
- Stable web/PWA currently ships:
  - signup/login/logout
  - quick game modes: 2-player, 3-player, 4-player (2v2)
  - minimal profile
  - minimal settings
  - PWA install/update/offline support
- Quick game setup is disposable and does not require saved players.
- Unfinished or archived surfaces such as history, stats, guide, spectator, alliance, chat, and realtime sync are not part of the active stable runtime contract.

## Data
- The current stable runtime does not depend on persisted player management for quick game.
- Some legacy schema tables still exist for traceability and later cleanup, but they are outside the active stable contract.
- Local browser storage is used for:
  - auth token continuity
  - theme preference
  - sound/haptics preference
  - unfinished quick-game continuation

## Platform Notes
- Android and desktop browsers may expose install prompts through `beforeinstallprompt`.
- iOS Safari does not expose a native install prompt event, so the app must provide manual install guidance instead of a true install button.
- Installed iOS/offline behavior now preserves access to quick-game flows through local cached session continuity after first successful online auth.
- The stable web/PWA remains the reference behavior for the native Android track.

## Android Distribution And Store Integration
- Primary Android store lane is Myket.
- Public web access page (`pages/AccessPage.tsx`) exposes:
  - Myket listing URL (`VITE_MYKET_APP_URL`)
  - controlled direct-download fallback (`VITE_DIRECT_DOWNLOAD_URL`)
  - direct-release integrity metadata (`VITE_ANDROID_RELEASE_VERSION`, `VITE_ANDROID_RELEASE_DATE`, `VITE_ANDROID_RELEASE_SHA256`)
- Android build bootstrap/dependency resolution is pinned to Myket Maven mirror for in-Iran stability:
  - `https://maven.myket.ir/`
  - `https://maven.myket.ir/gradle/distributions/gradle-8.10.2-bin.zip`

## Myket Server-to-Server Automation Contract
- Release and billing partner APIs are treated as server-only integrations.
- API authentication model uses `X-Access-Token` and must never be exposed in client code.
- Release automation uses release-bundle lifecycle APIs (create/edit metadata, upload artifact, commit for review, optional revert).
- Operational constraints for release automation include:
  - staged rollout support via rollout percentage field
  - API pagination for listing release bundles
  - artifact upload size guardrail (large uploads should fallback to panel/manual path)
- In-app purchase validation follows backend verification and consume endpoints (never client-trusted).
