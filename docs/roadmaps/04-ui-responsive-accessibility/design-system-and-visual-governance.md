# Mini-Roadmap: Design System and Visual Governance

Last updated: 2026-02-23

## Problem
Without visual governance, iterative UI fixes can create drift across pages, modes, and devices.

## Current Implementation Snapshot
Status: `Partial`

Evidence:
- Shared utility classes and design tokens exist in CSS/Tailwind config.
- Common UI patterns are present but not fully codified as component contracts.

## Source-Backed Constraints
### Must
- Consistency and accessibility must remain stable across routes and states.
  Source: WCAG 2.2 quickref

### Should
- Visual regressions should be caught before release.

### Could
- Add component-level design contract snapshots.

## Delivery Plan
### P0
- Define canonical style contracts for buttons, form fields, cards, and banners.
- Define RTL spacing/typography rules for each density profile.

### P1
- Add visual regression baseline suite for key components and routes.
- Add dark/light theme parity checklist with contrast assertions.

### P2
- Add token governance and semantic color-state mapping docs.
- Add component maturity levels (experimental/stable/locked).

## Verification
- Component snapshots remain stable across viewport matrix.
- Theme parity and contrast checks pass.

## KPI
- Visual regression count per release.
- Design-system contract coverage.

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
