# Mini-Roadmap: API and Runtime Performance

Last updated: 2026-02-23

## Problem
Network variability and API latency spikes can look like functional failure when not surfaced clearly and measured consistently.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial observability`

Evidence:
- Compression middleware enabled:
  - `server/api/index.js`
- Timeout-aware API request handling and Persian error messaging:
  - `lib/api.ts`
- Health endpoint available:
  - `server/api/index.js`

## Source-Backed Constraints
### Must
- Reliability needs measurable SLO-oriented signals, not only anecdotal checks.
  Source: Google SRE launch reliability/canary guidance.

### Should
- Request behavior under failures should degrade predictably.
  Source: OWASP + reliability practice (timeouts, retries, idempotency discipline).

### Could
- Introduce OpenTelemetry traces/metrics for endpoint latency.
  Source: https://opentelemetry.io/docs/

## Gap Matrix
- Implemented:
  - Basic health endpoint and client-side timeout messaging.
- Missing:
  - Endpoint percentile metrics (p95/p99).
  - Error budget/SLO dashboard.
  - Idempotent request retry strategy for safe read endpoints.

## Delivery Plan
### P0
- Keep current timeout transparency.
- Ensure key APIs maintain acceptable p95 under nominal load.

### P1
- Add per-route latency metrics and error counters.
- Add controlled retries for idempotent GET endpoints.

### P2
- Add canary analysis for runtime latency regressions.
- Add adaptive throttling strategy under burst load.

## Verification
- p95 and p99 metrics available for auth/history/users endpoints.
- No silent hang on failed API calls.

## KPIs
- Endpoint p95 latency.
- Error rate by route.
- Timeout-trigger frequency.

## Expansion Round 2 (2026-02-23)
- Add endpoint SLA classes (`critical`, `standard`, `background`).
- Add timeout/retry matrix by endpoint idempotency profile.
- Add slow-query feedback path into Prisma/Postgres tuning backlog.
- Add anti-regression benchmark script for auth/history/users APIs.

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
