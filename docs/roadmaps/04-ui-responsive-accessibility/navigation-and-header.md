# Mini-Roadmap: Navigation and Header

Last updated: 2026-02-23

## Problem
Overloaded headers degrade discoverability and consume critical vertical space on mobile and compact desktop layouts.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial discoverability optimization`

Evidence:
- Drawer-first navigation and compact-mode support:
  - `components/AppHeader.tsx`
  - `App.tsx`
- In-game tools moved into menu to reduce top-bar clutter:
  - `components/AppHeader.tsx`

## Source-Backed Constraints
### Must
- Menu button behavior should be keyboard and screen-reader friendly.
  Source: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

### Should
- Navigation density should adapt by context (scoring vs non-scoring routes).

### Could
- Desktop quick-jump palettes if user tests show route discoverability drops.

## Gap Matrix
- Implemented:
  - Reduced header noise and drawer-centric nav.
  - Compact mode active in scoring screen.
- Missing:
  - Formal focus trap and aria-expanded/aria-controls audit.
  - Measured discoverability tests for desktop quick actions.

## Delivery Plan
### P0
- Keep compact scoring header and drawer navigation stable.
- Ensure no overflow or clipped labels at all target widths.

### P1
- Add menu-button accessibility hardening checks.
- Add optional desktop quick-jump dropdown behind feature flag.

### P2
- Add command-palette style navigation for power desktop users.

## Verification
- Keyboard path from header button to drawer links and back.
- Screen reader announces menu state and route links correctly.
- No route becomes undiscoverable after header simplification.

## KPIs
- Navigation error rate.
- Time-to-route metric for profile/settings/history paths.

## Expansion Round 2 (2026-02-23)
- Add route-context nav profiles (`gameplay`, `analysis`, `account`, `settings`).
- Add menu interaction timing KPI (open-to-target route latency).
- Add desktop shortcut legend for power users if keyboard mode is enabled.
- Add fallback navigation anchors for reduced-motion and accessibility preference profiles.

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
