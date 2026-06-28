> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Sync, Consistency, and Observability

Last updated: 2026-02-24

## Problem
Alliance sharing introduces concurrent writes across users/devices. Without explicit consistency and observability contracts, data drift and trust loss are likely.

## Current Implementation Snapshot
Status: `Partial baseline`

Evidence:
- Spectator sync server exists for live view.
  - `server/sync-server.js`
- No alliance-level write concurrency policy exists.
- No alliance-specific SLO/KPI instrumentation exists.

## Consistency Baseline
- Use optimistic concurrency (`version` column or conditional update token).
- Use idempotent mutation keys for retry-safe client operations.
- Emit immutable event records for critical domain transitions.
- Keep eventual read model refresh bounded and measurable.

## Realtime Strategy
- Use room/channel key by `alliance_id` for scoped fan-out.
- Add reconnect backoff and state rehydration contract.
- Add payload versioning to prevent stale client writes.

## Source-Backed Constraints
- Realtime room scoping and horizontal scale path:
  https://socket.io/docs/v4/rooms/
  https://socket.io/docs/v4/redis-adapter/
- Conditional request/update semantics for lost-update prevention:
  https://datatracker.ietf.org/doc/html/rfc7232
- Offline-client merge expectations (LWW baseline awareness):
  https://firebase.google.com/docs/firestore/manage-data/enable-offline
- Observability baseline:
  https://opentelemetry.io/docs/

## Delivery Plan
### P0
- Add concurrency token contract for alliance-write endpoints.
- Add structured conflict response shape in API.
- Add alliance-level event/audit stream and tracing tags.

### P1
- Add sync lag, reconnect, and conflict dashboards.
- Add dead-letter/retry policy for async projection jobs.

### P2
- Add chaos/fault drills for alliance sync degradation.
- Add predictive anomaly detection for data drift.

## Implementation Packet (Event Contracts)
- Required client mutation envelope:
  - `event_id`, `event_type`, `alliance_id`, `scope`, `entity_id`, `expected_version`, `payload`, `at`.
- Required server ack envelope:
  - `event_id`, `status`, `new_version`, `conflict_reason?`, `server_time`.
- Conflict response contract:
  - `409` + canonical latest state + actionable merge hints.

## Verification
- Concurrent edit tests produce deterministic outcomes.
- Reconnect flow restores correct state without silent overwrites.
- Observability dashboards can isolate alliance-level incidents.

## KPIs
- Conflict rate per 1k writes.
- Reconnect recovery time.
- Mean time to detect/resolve data drift incidents.

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
