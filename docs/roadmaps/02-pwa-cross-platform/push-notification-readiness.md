# Mini-Roadmap: Push Notification Readiness

Last updated: 2026-02-23

## Problem
Push can improve re-engagement and reliability signaling, but cross-platform support and permission UX vary significantly.

## Current Implementation Snapshot
Status: `Not implemented`

Evidence:
- No push subscription endpoints currently exposed.
- No service worker push handlers currently implemented.

## Source-Backed Constraints
### Must
- Push capability differs by platform/browser and may require installed app context on some systems.
  Source: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
  Source: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/

### Should
- Permission requests should be user-initiated and value-contextual.

### Could
- Add notification categories (system alerts vs product updates).

## Delivery Plan
### P0
- Define push scope limited to operational/important alerts.
- Build subscription lifecycle API design.

### P1
- Implement opt-in push flow with permission timing strategy.
- Add unsubscribe and preference controls in settings.

### P2
- Add segmented notification channels and quiet-hour rules.
- Add delivery reliability analytics.

## Verification
- Subscription, send, and unsubscribe flows pass on supported platforms.
- Unsupported platforms receive clear fallback messaging.

## KPI
- Opt-in rate.
- Delivery success rate.
- Unsubscribe rate.

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
