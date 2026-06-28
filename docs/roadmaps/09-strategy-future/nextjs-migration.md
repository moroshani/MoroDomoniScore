# Mini-Roadmap: Next.js Migration

Last updated: 2026-02-23

## Goal
Evaluate and execute a parity-preserving migration path from Vite + React SPA to Next.js architecture with zero regression in gameplay-critical behavior.

## Current Implementation Snapshot
Status: `Planned`

Evidence:
- Existing frontend architecture is Vite + React SPA (`App.tsx`, `vite.config.ts`).
- Core behavior is tightly coupled to current client-side state and PWA flow (`context/GameContext.tsx`, `context/PwaContext.tsx`).

## Source-Backed Constraints
- App Router migration should be staged with route parity and behavior contracts.
  Source: https://nextjs.org/docs/app/guides/migrating/app-router-migration
- Deployment model and runtime implications should be explicit before cutover.
  Source: https://nextjs.org/docs/app/building-your-application/deploying

## Migration Design
### Contract-first migration principles
- Freeze behavior contracts for scoring/auth/PWA/session before migration starts.
- Migrate route clusters incrementally, not by full rewrite.
- Keep rollback path to current Vite deployment at all times.

### Phase Plan
1. Build parity matrix and acceptance tests.
2. Bootstrap Next.js shell with Persian RTL and design-token parity.
3. Migrate low-risk routes (guide/settings/profile) first.
4. Migrate history/stats and spectator surface.
5. Migrate gameplay flow last with high-coverage regression suite.
6. Re-harden PWA and update lifecycle in Next context.
7. Controlled canary and rollback rehearsal.

## Risks
- Gameplay behavior drift.
- PWA lifecycle regressions.
- Session/auth parity drift.

## Mitigations
- Fixture-driven gameplay tests.
- PWA contract suite before and after each phase.
- Side-by-side smoke checks and live canarying.

## Verification
- All critical flows pass parity matrix before traffic migration.
- Rollback can restore previous production behavior quickly.

## Decision Gate
Proceed only if measurable gains justify migration cost:
- performance gains,
- operational simplification,
- developer velocity improvement.

## Expansion Round 2 (2026-02-23)
- Add route-by-route migration heatmap (risk, complexity, dependency).
- Add compatibility matrix for PWA/service worker behavior in Next architecture.
- Add migration rehearsal environment with mirrored production traffic samples.
- Add explicit stop-loss criteria if parity goals are not met.

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

## Priority Tiers
### P0
- Deliver mandatory contract and non-regression outcomes for this scope.

### P1
- Deliver advanced reliability and automation improvements for this scope.

### P2
- Deliver frontier optimization once P0/P1 are stable.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
