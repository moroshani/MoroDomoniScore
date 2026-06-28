# 05 Performance and Reliability Roadmap

Last updated: 2026-02-24

## Goal
Improve speed and resilience for low-end mobile and desktop users while preserving gameplay correctness and deployment safety.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial advanced instrumentation`

Evidence:
- Route-level lazy loading:
  - `App.tsx`
- API compression enabled:
  - `server/api/index.js`
- Service worker caching and offline fallback:
  - `public/sw.js`
- Timeout-aware API fetch path:
  - `lib/api.ts`

## Research Constraints
- Performance should be measured by user-centric metrics (CWV).
  Source: web.dev vitals docs
- SW caching policy needs explicit lifecycle and stale handling.
  Source: web.dev SW lifecycle, offline cookbook
- Caching headers and HTTP cache semantics must be explicit.
  Source: MDN Cache-Control

## Priority Tracks
### P0 (must)
- Maintain stable performance baseline across core user flows.
- Keep offline and update behavior predictable.
- Keep API latency failures user-visible, not silent.
- Add baseline SLOs for realtime alliance sync and chat delivery latency.

### P1 (advanced)
- Add CWV budgets and CI perf guardrails.
- Add API p95/p99 instrumentation and dashboarding.
- Add cache observability hooks.
- Add edge/network delivery policy and diagnostics matrix.
- Add websocket throughput/backpressure monitoring and room fan-out budgets.

### P2 (frontier)
- Adaptive prefetching and route-level predictive loading.
- Advanced edge/static strategy with risk-controlled rollout.
- Regional delivery optimization experiments with rollback contracts.

## Mini-Roadmaps
- `docs/roadmaps/05-performance-reliability/web-performance.md`
- `docs/roadmaps/05-performance-reliability/api-runtime-performance.md`
- `docs/roadmaps/05-performance-reliability/caching-observability.md`
- `docs/roadmaps/05-performance-reliability/network-delivery-and-edge.md`

## Verification Contracts
Use: C1, C2, C3, C6, C8.

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
