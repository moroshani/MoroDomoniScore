> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Offline Survivability and Continuity

Last updated: 2026-02-24

## Problem
The app must remain playable locally in PWA mode even if backend services are unavailable, without harming current users.

## Current Implementation Snapshot
Status: `Partial baseline`

Evidence:
- Service worker/offline page exists:
  - `public/sw.js`
  - `public/offline.html`
- History/profiles currently depend on API availability for full sync.

## Continuity Guarantees
### Must
- Quick Night remains fully local.
- Standard local scoring remains usable offline.
- App shell and core scoring routes load from cache when previously installed.

### Should
- Queue syncable writes for later upload with idempotency keys.
- Show clear offline/sync state in UI.

### Could
- Add encrypted local backup/export package for disaster continuity.

## Architectural Decisions
- Local-first write queue in IndexedDB.
- Service worker route strategy for app shell + offline fallback.
- Explicit conflict handling when reconnect uploads collide with server state.

## Source-Backed Constraints
- Offline cookbook and fallback strategy:
  https://web.dev/offline-cookbook/
  https://web.dev/articles/offline-fallback-page
- Storage persistence and eviction behavior:
  https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
  https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- Background sync support caveats:
  https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API

## Delivery Plan
### P0
- Formalize offline capability matrix per feature.
- Add durable local queue and replay contract.
- Add user-visible offline/sync diagnostics.

### P1
- Add queue compaction and retry policies with dead-letter handling.
- Add encrypted export/import for local continuity.

### P2
- Add multi-device offline merge assistant UX.

## Verification
- Installed PWA can start and score locally with backend unavailable.
- Reconnect replay does not duplicate writes.
- User can export local data before uninstall/reset.

## KPIs
- Offline session completion rate.
- Sync replay success rate.
- Data-loss incidents under offline conditions.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Waves 2-5 (foundational to UX)
- Dependencies locked: Wave 1 security baseline, additive migrations, feature-flag infra
- Required feature flags: alliance_identity_v1, scope_world_alliance_v1, chat_surface_v1, sync_observability_v1
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
- Exit artifact required: Alliance/world rollout dossier with migration parity and non-regression proofs


## Scope
This roadmap item defines execution boundaries and delivery policy for alliance shared identity.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
