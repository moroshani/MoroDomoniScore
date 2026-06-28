# Mini-Roadmap: Portfolio Prioritization and KPI Governance

Last updated: 2026-02-23

## Problem
With multiple strategic programs, delivery can fragment unless priorities are tied to measurable outcomes.

## Current Implementation Snapshot
Status: `Partial`

Evidence:
- Strategic programs are documented (Next.js, mdadmin, research backlog).
- No unified KPI governance matrix yet.

## Governance Model
- Every strategic item gets:
  - business/technical objective,
  - explicit KPI target,
  - effort/risk score,
  - exit criteria.

## Prioritization Framework
### Inputs
- User impact.
- Security/reliability risk reduction.
- Delivery complexity.
- Operational cost.

### Scoring
- Weighted score = impact + risk-reduction + strategic alignment - complexity.

## Delivery Plan
### P0
- Define strategic KPI matrix template.
- Apply score model to existing strategic backlog.

### P1
- Add quarterly strategic review cadence.
- Add stop/continue/pivot decision gates per initiative.

### P2
- Add live portfolio dashboard with burnup and risk indicators.

## Verification
- Each strategic item has owner, KPI, and next decision date.
- Low-value/high-risk items are explicitly deprioritized or archived.

## KPI
- Strategic initiative success rate.
- Percentage of initiatives with measurable outcome.

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

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
