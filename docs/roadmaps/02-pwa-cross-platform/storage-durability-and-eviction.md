# Mini-Roadmap: Storage Durability and Eviction

Last updated: 2026-02-23

## Problem
Offline/PWA experiences degrade if browser storage is unexpectedly evicted or quota behavior is unknown.

## Current Implementation Snapshot
Status: `Partial`

Evidence:
- Preferences currently stored in local storage:
  - `lib/preferences.ts`
- Service-worker cache stores static/runtime content:
  - `public/sw.js`

Missing:
- No storage quota visibility in UI.
- No persisted-storage request strategy.
- No proactive cache pressure diagnostics.

## Source-Backed Constraints
### Must
- Browser storage persistence and quota vary by platform and policy.
  Source: https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
  Source: https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist

### Should
- Critical offline data should not rely on best-effort storage alone.

### Could
- Add storage pressure telemetry and cleanup hints.

## Delivery Plan
### P0
- Add storage health diagnostic function (`quota`, `usage`, `persisted`).
- Add safe cache pruning fallback for quota pressure.

### P1
- Add user-facing diagnostics in settings (storage status + cleanup action).
- Add optional persisted-storage request flow where supported.

### P2
- Add adaptive cache budgets by device class.
- Add large-asset lazy caching only after engagement threshold.

## Verification
- Storage diagnostics return sensible values on Android/Desktop.
- App remains functional after cache pruning and reload.

## KPIs
- Storage eviction incidents.
- Offline failure rate after extended inactivity.

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
