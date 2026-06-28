# Mini-Roadmap: Update and Offline Lifecycle

Last updated: 2026-02-23

## Problem
Forced updates and opaque offline behavior reduce trust and create data-loss risk perceptions.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial for advanced observability`

Evidence:
- SW update detection and waiting worker management:
  - `context/PwaContext.tsx`
- User-triggered update apply (`SKIP_WAITING`) and controlled reload:
  - `context/PwaContext.tsx`
  - `public/sw.js`
- Update banner with explicit apply/dismiss actions:
  - `components/UpdateBanner.tsx`
- Offline fallback route behavior:
  - `public/sw.js` + `public/offline.html`

## Source-Backed Constraints
### Must
- SW lifecycle should avoid uncontrolled refresh and race conditions.
  Source: https://web.dev/service-worker-lifecycle/
- Update UX should remain explicit and user-comprehensible.
  Source: https://web.dev/learn/pwa/update

### Should
- Keep offline navigation fallback deterministic.
  Source: https://web.dev/offline-cookbook/

### Could
- Segment updates by severity (security hotfix vs standard release).

## Gap Matrix
- Implemented:
  - Explicit apply update flow.
  - Manual update check in settings.
  - Offline fallback in navigation failures.
- Missing:
  - Update observability metrics.
  - "What changed" release-note hint at update time.
  - Retry/backoff message when update fetch fails.

## Delivery Plan
### P0
- Preserve explicit opt-in update apply behavior.
- Ensure install and web modes behave identically on update availability.

### P1
- Add update telemetry and outcome tracking.
- Add small changelog teaser in update banner/settings.

### P2
- Add staged client update policy (soft rollout messaging).
- Add version drift detector for long-idle clients.

## Verification
- New deployment does not auto-refresh active session without user action.
- `manifest.json`, `sw.js`, `offline.html` are healthy on local and VPS.
- Offline navigation falls back to `offline.html`.

## KPIs
- Update apply rate.
- Update dismissal rate.
- Offline failure rate per 1k sessions.

## Expansion Round 2 (2026-02-23)
- Add update-state machine documentation (`idle`, `available`, `dismissed`, `applied`, `failed`).
- Add user-visible fallback when update apply fails due worker state mismatch.
- Add release-note snippet handoff from deployment metadata to update banner.
- Add synthetic offline test run in release gates using navigation fallback assertions.

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
