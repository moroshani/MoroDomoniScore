# Mini-Roadmap: Responsive Layouts

Last updated: 2026-02-23

## Problem
Layout can appear fine in one viewport while breaking usability in another, especially for dense gameplay and dashboard-style pages.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial automation`

Evidence:
- Main route shell spacing and safe-area handling:
  - `App.tsx`
- Gameplay responsive grid and fixed action bar behavior:
  - `components/Scoreboard.tsx`
- Header compact mode logic in scoring route:
  - `App.tsx` + `components/AppHeader.tsx`

## Source-Backed Constraints
### Must
- Responsive UX must preserve task completion on all target widths.
  Source: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design

### Should
- Prefer component-level adaptivity (container queries) for complex cards.
  Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries

### Could
- Add per-route visual snapshots and diff gating.

## Gap Matrix
- Implemented:
  - Core breakpoint support and compact gameplay handling.
  - Inline submit for mobile score entry.
- Missing:
  - Automated viewport screenshot diff suite.
  - Formal overflow regression gate in CI.

## Delivery Plan
### P0
- Keep 320..1920 no-overflow contract.
- Keep gameplay action path visible and scroll-light.

### P1
- Add automated visual snapshots for key routes and widths.
- Add overflow assertion tests for route containers.

### P2
- Adopt container-query strategy for dense sections.
- Add low-end device profile presets in QA matrix.

## Verification
- Width set: 320, 360, 375, 390, 430, 768, 1024, 1366, 1920.
- No clipping/overlap in header, score cards, forms, modals.
- Core actions usable in each width profile.

## KPIs
- Responsive regression count per release.
- Mobile task completion time for scoring flow.

## Expansion Round 2 (2026-02-23)
- Add foldable and ultra-wide display scenarios to exploratory QA matrix.
- Add text-scaling and browser zoom stress cases (125%, 150%, 200%).
- Add safe-area inset stress checks for notched devices and installed mode.
- Add overflow auto-detection helper for nightly visual QA runs.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 4
- Dependencies locked: Wave 1 security baseline and Wave 3 data contracts for new surfaces
- Required feature flags: responsive_shell_v2, desktop_nav_compact_v1, forms_labeling_v1
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
- Exit artifact required: Viewport regression pack (320-1920) + accessibility AA evidence


## Scope
This roadmap item defines execution boundaries and delivery policy for ui responsive accessibility.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
