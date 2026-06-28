# Mini-Roadmap: Caching and Observability

Last updated: 2026-02-23

## Problem
Caching boosts speed but can cause stale behavior and hard-to-diagnose update issues without observability.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial diagnostics`

Evidence:
- Static/runtime cache split with cache trimming:
  - `public/sw.js`
- Timestamped SW cache entries:
  - `public/sw.js`
- Offline fallback and update handling:
  - `public/sw.js`
  - `context/PwaContext.tsx`

## Source-Backed Constraints
### Must
- SW lifecycle and update state should be explicit and controlled.
  Source: https://web.dev/service-worker-lifecycle/
- Offline fallback strategy should follow documented patterns.
  Source: https://web.dev/offline-cookbook/

### Should
- Cache behavior and age policy should be measurable.
  Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control

### Could
- Add runtime cache diagnostics mode and release-version tagging.

## Gap Matrix
- Implemented:
  - Cache versioning and aging metadata.
  - Runtime/static cache separation.
- Missing:
  - User-facing diagnostics for stale cache edge cases.
  - Metrics on cache hit/miss/update apply outcomes.

## Delivery Plan
### P0
- Keep deterministic cache invalidation by version.
- Keep update apply path user-controlled.

### P1
- Add non-production cache diagnostics panel.
- Add telemetry for update and cache outcomes.

### P2
- Add server/client version parity check endpoint and UI indicator.
- Add automated stale-client detection notifications.

## Verification
- Cache version bump correctly invalidates old cache sets.
- Offline fallback remains functional.
- Update path remains explicit and recoverable.

## KPIs
- Cache hit ratio by route group.
- Stale client incidents.
- Update loop regressions.

## Expansion Round 2 (2026-02-23)
- Add cache-key versioning policy for assets vs navigations.
- Add stale asset detection checks across service-worker version upgrades.
- Add client-visible diagnostics export for support triage.
- Add runtime cache saturation alert threshold for large-session users.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 6
- Dependencies locked: Waves 2-5 landed behind flags; telemetry schema frozen
- Required feature flags: perf_budget_enforced_v1, observability_slo_v1
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
- Exit artifact required: CWV/SLO baseline vs post-change benchmark and regression gates


## Scope
This roadmap item defines execution boundaries and delivery policy for performance reliability.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
