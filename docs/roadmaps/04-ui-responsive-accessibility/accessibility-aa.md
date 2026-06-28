# Mini-Roadmap: Accessibility (WCAG 2.2 AA)

Last updated: 2026-02-23

## Problem
A visually responsive UI can still exclude keyboard and assistive-technology users if accessibility is not explicitly validated.

## Current Implementation Snapshot
Status: `Partial`

Evidence:
- Form labels in key account pages:
  - `pages/ProfilePage.tsx`
  - `pages/SettingsPage.tsx`
- Some aria labels already present for sensitive controls:
  - `components/Auth.tsx`

Gaps:
- No full keyboard/screen-reader audit documented.
- No systematic contrast/focus verification artifact.

## Source-Backed Constraints
### Must
- Meet WCAG 2.2 AA outcomes for key journeys.
  Source: https://www.w3.org/WAI/WCAG22/quickref/

### Should
- Align custom menu interactions with APG patterns.
  Source: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

### Could
- Add accessibility regression checks in CI (axe + Lighthouse).

## Delivery Plan
### P0
- Keyboard route for auth, gameplay submit/edit/undo, profile save, settings actions.
- Focus-visible consistency and no focus traps.

### P1
- Screen-reader smoke checks on core routes.
- Contrast audit pass and documented fixes.

### P2
- Accessibility lint + CI gate integration.
- Reduced-motion and high-contrast preference profile improvements.

## Verification
- Keyboard-only completion of core tasks.
- Screen reader announcements for headings/buttons/inputs are meaningful.
- Contrast ratios meet AA for primary text and action components.

## KPIs
- Accessibility audit critical issue count.
- Keyboard path breakage rate per release.

## Expansion Round 2 (2026-02-23)
- Add live-region strategy for score updates and critical toast announcements.
- Add SR-only helper text for complex controls in gameplay and session management.
- Add accessibility defect severity model (critical/high/medium/low) to release gates.
- Add quarterly full accessibility regression audit cadence.

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
