# Stable Scope And Deletion Plan

Last updated: 2026-04-10

## Purpose
Define exactly what survives in the stable web/PWA product and what must be removed or simplified before shipping.

## Keep
### Authentication
- signup
- login
- logout
- basic session continuation required for remember-me

### Quick Game
- quick-game setup
- quick-game scoring
- quick-game win flow
- quick-game recap if it remains stable and local

### Minimal Profile
- edit name
- edit username
- edit email
- change password

### Minimal Settings
- theme
- sound
- haptics
- PWA install/update/offline status needed for real usage

### Platform Basics
- responsive web shell
- PWA manifest
- service worker
- offline fallback required for non-Android users
- self-hosted assets only

## Remove Or Downgrade
### Frontend Routes And Screens
- history
- stats
- guide
- spectator
- alliance
- any screen that exists only for future or experimental scope

### Gameplay Surface
- 2-player standard
- 3-player standard
- 4-player standard
- player-management flow that exists only for standard modes
- guest share / QR spectator tools
- audit log tools if they are not essential to quick-game safety

### Profile Surface
- avatar upload
- session rename / trust / revoke UI
- security event timeline
- recovery request viewer
- account export
- account deletion if judged too risky for stable-v1 scope

### Settings Surface
- server-health diagnostics
- PWA help content beyond what is necessary
- anything tied to removed routes or removed release models

### Backend/API Surface
- players CRUD if quick game remains name-based only
- history CRUD
- spectator sync runtime
- realtime routes
- alliance routes
- export-heavy user endpoints not used by stable product
- recovery workflow if it is not explicitly retained

### Database Surface
- player/history tables if no longer required
- alliance/shared-identity tables
- lobby/chat/moderation tables
- snapshot tables tied to archived programs

## Two-Stage Deletion Policy
### Stage 1
- remove runtime use,
- remove UI entry points,
- remove route wiring,
- stop deploy/smoke reliance,
- preserve old data temporarily.

### Stage 2
- remove dead backend code,
- remove dead scripts,
- run cleanup migrations after stable signoff.

## Verification Requirements
- stable web/PWA must boot without references to removed routes,
- no runtime asset may load from third parties,
- local and VPS builds must match,
- PWA still installs and updates correctly,
- iOS/non-Android usage path remains valid.
