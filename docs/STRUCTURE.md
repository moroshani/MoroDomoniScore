# Project Structure
Last reviewed: 2026-04-25 UTC

## Root
- `App.tsx` - app shell and route composition.
- `components/` - active UI surface for stable web/PWA.
- `context/` - state providers.
- `lib/` - frontend utilities and API helpers.
- `pages/` - active route components.
- `public/` - self-hosted static assets, manifest, service worker, and offline page.
- `server/` - active API runtime.
- `prisma/` - schema and migrations.
- `scripts/` - deploy and ops automation.
- `tests/` - automated verification specs.
- `docs/` - living documentation.
- `android-native/` - Android foundation contracts and future native implementation lane.

## Planning Structure
- `docs/roadmaps/` - active planning system.
- `docs/roadmaps/11-stable-web-pwa/` - stable web/PWA product track.
- `docs/roadmaps/12-android-native/` - native Android product track.
- `docs/roadmaps/13-demo-web/` - demo web experimentation track.

## Historical Planning Structure
- `docs/roadmaps/10-alliance-shared-identity/` - archived.
- `docs/roadmaps/_legacy/` - historical snapshots.

## Current Direction
- Stable web/PWA is the current shipping lane.
- Native Android is the next product lane.
- Demo web is the future experimentation lane.
- Older alliance/realtime/shared-identity work remains as historical context, not as active implementation scope.
