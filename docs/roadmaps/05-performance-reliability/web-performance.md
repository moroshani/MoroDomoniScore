# Mini-Roadmap: Web Performance

Last updated: 2026-02-23

## Problem
Bundle growth and interaction cost can degrade the gameplay loop on low-power devices.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial optimization depth`

Evidence:
- Lazy route loading for non-core pages:
  - `App.tsx`
- Build pipeline active via Vite:
  - `vite.config.ts`

## Source-Backed Constraints
### Must
- Track and optimize Core Web Vitals (LCP, INP, CLS).
  Source: https://web.dev/articles/vitals
- Follow practical optimization strategies for each metric.
  Source: https://web.dev/articles/optimize-lcp
  Source: https://web.dev/articles/optimize-inp
  Source: https://web.dev/articles/optimize-cls

### Should
- Optimize media delivery and rendering cost.
  Source: https://web.dev/learn/performance/image-performance

### Could
- Add Lighthouse CI budgets in PR/deploy pipeline.
  Source: https://github.com/marketplace/actions/lighthouse-ci-action

## Gap Matrix
- Implemented:
  - Route splitting for major route components.
- Missing:
  - Budget thresholds and automated regressions checks.
  - Performance marks around gameplay-critical interactions.

## Delivery Plan
### P0
- Keep main gameplay interaction smooth and low-latency.
- Avoid unnecessary bundle inflation.

### P1
- Add Lighthouse CI budgets and regression fail thresholds.
- Add user timing marks for login, mode select, round submit.

### P2
- Evaluate granular code splitting for heavy score/history/stat logic.
- Consider prefetch/predictive loading for adjacent routes.

## Verification
- Lighthouse and CWV trend checks per release.
- Manual low-end device profile run for scoring loop.

## KPIs
- LCP p75, INP p75, CLS p75.
- First interactive scoring action latency.

## Expansion Round 2 (2026-02-23)
- Add route-level performance budgets (boot, interactive, action response).
- Add memory usage checkpoints for long gameplay sessions.
- Add script-evaluation cost tracking for top routes.
- Add low-end Android profile as mandatory perf benchmark before release.

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
