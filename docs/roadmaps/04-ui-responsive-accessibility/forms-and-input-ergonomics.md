# Mini-Roadmap: Forms and Input Ergonomics

Last updated: 2026-02-23

## Problem
Critical actions (especially score submit) must be close to inputs and reachable without repeated scrolling.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial for fast-entry workflows`

Evidence:
- Per-team inline submit buttons on mobile:
  - `components/Scoreboard.tsx`
- Desktop submit and undo/edit control group:
  - `components/Scoreboard.tsx`
- Explicit labels in profile/settings forms:
  - `pages/ProfilePage.tsx`
  - `pages/SettingsPage.tsx`
- Remember-me checkbox on login:
  - `components/Auth.tsx`

## Source-Backed Constraints
### Must
- Inputs must support accessible labeling and clear focus states.
  Source: WCAG 2.2 quickref

### Should
- Touch targets should remain comfortably tappable.
  Source: https://m1.material.io/usability/accessibility.html

### Could
- Keyboard-first shortcuts for rapid desktop score entry.

## Gap Matrix
- Implemented:
  - Mobile inline submit near each score input.
  - Form labels for profile/settings.
- Missing:
  - Error summary pattern for multi-field failures.
  - Keyboard shortcut and rapid-entry mode in desktop scoring.

## Delivery Plan
### P0
- Preserve inline submit behavior and prevent accidental hidden CTA states.
- Keep label coverage complete for all interactive forms.

### P1
- Add uniform inline validation messaging.
- Add desktop rapid entry shortcuts.

### P2
- Add optional one-handed mobile scoring mode (larger controls and tighter flow).

## Verification
- On 320/360 widths, score submit is accessible without excessive scrolling.
- Every settings/profile field has visible label and correct focus target.
- Login remember-me value persists and maps to session behavior.

## KPIs
- Score-entry completion time.
- Form error correction rate.

## Expansion Round 2 (2026-02-23)
- Add field-level validation taxonomy (blocking, warning, informational) for consistency.
- Add numeric keypad reliability matrix across Android/iOS/desktop browsers.
- Add high-velocity scoring mode experiment with minimal focus hops.
- Add mobile thumb-zone layout review for submit/undo/edit placement.

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
