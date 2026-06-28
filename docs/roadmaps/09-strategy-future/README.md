# 09 Strategy and Future Programs

Last updated: 2026-02-24

## Goal
Run long-term strategic initiatives without degrading production quality or blocking current roadmap execution.

## Current Programs
- Next.js migration strategy (parallel parity-first, no big-bang cutover).
- mdadmin control-plane strategy.
- Open research and experiment stream for UX/security/performance/ops.
- Future authoritative online gameplay engine research (rules remain unchanged until dedicated execution decision).

## Operating Principle
Strategic work is gated by the same contracts as feature work. No strategy item can bypass release, verification, or rollback discipline.

## Priority Tracks
### P0
- Keep current stack stable and fully verifiable.
- Build strategic parity matrices before any migration commits.

### P1
- Execute phased pilots with strict rollback gates.
- Add measurable success criteria per strategy stream.
- Add portfolio scoring and quarterly prioritization reviews.
- Run feasibility track for authoritative online match engine, anti-cheat, and fairness telemetry.

### P2
- Decide continuation/pause/rollback based on measured outcomes, not assumptions.
- Add strategic dashboard with value/risk/effort trendlines.

## Mini-Roadmaps
- `docs/roadmaps/09-strategy-future/nextjs-migration.md`
- `docs/roadmaps/09-strategy-future/mdadmin-control-plane.md`
- `docs/roadmaps/09-strategy-future/research-and-experiments.md`
- `docs/roadmaps/09-strategy-future/portfolio-prioritization-and-kpi-governance.md`

## Verification
Strategic steps must satisfy C1-C9 before production adoption.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 8
- Dependencies locked: All mandatory production waves (0-7) stable
- Required feature flags: strategy_track_gate_v1
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
- Exit artifact required: Strategy track charter with stop-loss and KPI thresholds


## Scope
This roadmap item defines execution boundaries and delivery policy for strategy future.

## Current Snapshot
Status: `Documented`

Evidence:
- Current behavior is described in this file and linked roadmap artifacts.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
