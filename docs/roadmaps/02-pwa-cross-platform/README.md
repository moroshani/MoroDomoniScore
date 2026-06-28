# 02 PWA Cross-Platform Roadmap

Last updated: 2026-02-24

## Goal
Deliver predictable install, update, and offline behavior across Android, iOS, desktop, and legacy browsers while preserving parity between browser mode and installed mode.

## Cross-Program Requirement
- Installed PWA must keep core local gameplay usable during backend outages.
- Login/register and Quick Night behavior cannot regress while alliance/world features are introduced.

## Current Implementation Snapshot
Status: `Implemented (strong baseline)`, `Partial (telemetry and platform QA depth)`

Evidence:
- PWA lifecycle management:
  - `context/PwaContext.tsx`
- Update banner with explicit user action:
  - `components/UpdateBanner.tsx`
- Install guidance component:
  - `components/PwaInstallGuide.tsx`
- Service worker caching/offline/update flow:
  - `public/sw.js`
- Manifest and icons/shortcuts:
  - `public/manifest.json`
- iOS web-app tags:
  - `index.html`

## Key Research Constraints
- `beforeinstallprompt` is non-standard/limited availability.
  Source: MDN + caniuse
- iOS install behavior differs from Chromium prompt model.
  Source: web.dev installation prompt, WebKit docs
- Update should remain user-controlled to avoid trust breaks.
  Source: web.dev update lifecycle and SW lifecycle

## Priority Tracks
### P0 (must)
- Preserve explicit user-controlled update apply path.
- Maintain cross-platform fallback install instructions.
- Keep parity checks for browser-installed behavior in release gates.
- Guarantee offline-local continuity for scoring routes already cached on device.

### P1 (advanced)
- Add install/update telemetry and funnel metrics.
- Add physical device matrix test runs (Android + iOS + desktop).
- Add offline coverage matrix by route group.
- Add storage durability diagnostics (quota/persist/eviction visibility).

### P2 (frontier)
- Add background sync queue for safe deferred actions where supported.
- Add adaptive update UX messaging (critical vs optional updates).
- Add push-notification readiness with platform-safe capability fallback.

## Mini-Roadmaps
- `docs/roadmaps/02-pwa-cross-platform/install-android-desktop.md`
- `docs/roadmaps/02-pwa-cross-platform/install-ios.md`
- `docs/roadmaps/02-pwa-cross-platform/update-and-offline-lifecycle.md`
- `docs/roadmaps/02-pwa-cross-platform/storage-durability-and-eviction.md`
- `docs/roadmaps/02-pwa-cross-platform/push-notification-readiness.md`

## Verification Contracts
Use: C2, C3, C4, C6, C8.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 5
- Dependencies locked: Wave 1 auth/session hardening and Wave 4 responsive shell stable
- Required feature flags: pwa_install_v2, pwa_update_control_v2, offline_continuity_v1
- Non-regression constraints (mandatory):
  - Login/register remains available in all phases.
  - Quick Night remains available and unchanged.
  - No gameplay-rule changes in this roadmap batch.
  - Zero-downtime rollout only (expand, backfill, cutover, cleanup).
  - Web and installed PWA parity is required.
- Delivery checklist:
  - API contracts are frozen before implementation starts.
  - Data migration/backfill plan includes rollback and parity checks.
  - Security controls and abuse-path checks are mapped to verification contracts.
  - Responsive behavior validated from 320px to 1920px before release gate pass.
  - Observability events/metrics are defined before rollout.
- Verification checklist:
  - Unit + integration + end-to-end coverage for this roadmap item.
  - Contract checks C1-C11 and release gates G0-G6 applied where relevant.
  - Local vs VPS behavior parity snapshot captured before closing.
- Exit artifact required: Cross-platform install matrix report (Android/iOS/Desktop + installed/web parity)


## Scope
This roadmap item defines execution boundaries and delivery policy for pwa cross platform.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
