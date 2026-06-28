# Roadmap System

Last updated: 2026-05-05
Research reset date: 2026-04-10

This folder is the planning source of truth for the current product direction.

## Mission
- Ship a stable web/PWA product with only verified safe features.
- Build a native offline-first Android product from that stable product contract.
- Use a separate demo web lane for feature incubation and risk-taking.
- Prevent older expansion research from silently driving near-term implementation.

## Direction Lock
The active program now has three tracks:
1. Stable web/PWA
2. Native Android
3. Demo web

The stable web/PWA track is the first shipping contract.
The Android track must be native and offline-first.
The demo web track is the only lane where unfinished features are allowed to evolve.

## Research Classification
### Active
- `03-auth-session-security`
- `04-ui-responsive-accessibility`
- `05-performance-reliability`
- `07-devops-release`
- `11-stable-web-pwa`
- `12-android-native`
- `13-demo-web`

### Supporting / Re-Scoped
- `02-pwa-cross-platform`
  Keep as platform research for iOS and installed-web behavior, but subordinate it to stable web/PWA.
- `06-product-surface`
  Keep only as evidence of current implementation and legacy scope.
- `09-strategy-future`
  Keep only as a deferred backlog source.

### Archived / Deferred
- `10-alliance-shared-identity`
- `_legacy`

These are preserved for traceability only. They are not approved for active execution in the current cycle.

## How To Execute
1. Start with `docs/roadmaps/IMPLEMENTATION_ORDER.md`.
2. Use `docs/roadmaps/IMPLEMENTATION_READINESS.md` to confirm readiness state.
3. Read the active track README for the relevant product lane.
4. Read the supporting mini-roadmap for the exact scope.
5. Compare code and VPS state before implementation.
6. Implement only against the active direction lock.
7. Record outcomes in `docs/PROJECT_LOG.md`.

## Active Topic Index
- `docs/roadmaps/03-auth-session-security/README.md`
- `docs/roadmaps/04-ui-responsive-accessibility/README.md`
- `docs/roadmaps/05-performance-reliability/README.md`
- `docs/roadmaps/07-devops-release/README.md`
- `docs/roadmaps/11-stable-web-pwa/README.md`
- `docs/roadmaps/11-stable-web-pwa/stable-scope-and-deletion-plan.md`
- `docs/roadmaps/11-stable-web-pwa/ios-pwa-maximum-coverage.md`
- `docs/roadmaps/12-android-native/README.md`
- `docs/roadmaps/12-android-native/offline-first-architecture.md`
- `docs/roadmaps/12-android-native/biometric-and-passkey-strategy.md`
- `docs/roadmaps/12-android-native/android-device-compatibility-hardening.md`
- `docs/roadmaps/12-android-native/notifications-strategy.md`
- `docs/roadmaps/12-android-native/iran-markets-release-readiness.md`
- `docs/roadmaps/13-demo-web/README.md`
- `docs/roadmaps/13-demo-web/promotion-policy.md`
- `docs/roadmaps/13-demo-web/experiment-governance.md`
- `docs/roadmaps/13-demo-web/distribution-and-promotion-hub.md`

## Supporting Topic Index
- `docs/roadmaps/02-pwa-cross-platform/README.md`
- `docs/roadmaps/06-product-surface/README.md`
- `docs/roadmaps/09-strategy-future/README.md`

## Archived Topic Index
- `docs/roadmaps/10-alliance-shared-identity/README.md`
- `docs/roadmaps/_legacy/ROADMAP_2026-02-22.md`

## Source Notes
Primary-source links from older topic files remain useful and are intentionally retained there. The reset did not discard source material; it changed which decisions are active.
