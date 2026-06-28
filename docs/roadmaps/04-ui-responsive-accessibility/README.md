# 04 UI, Responsive, Accessibility Roadmap

Last updated: 2026-02-24

## Goal
Provide consistent, high-clarity Persian RTL UX across smallest phones to large desktops in web and installed modes.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial for deep AA hardening and visual regression automation`

Evidence:
- Drawer-first header architecture:
  - `components/AppHeader.tsx`
- Responsive gameplay card layout and inline mobile submit:
  - `components/Scoreboard.tsx`
- Profile/settings labels and secure actions:
  - `pages/ProfilePage.tsx`
  - `pages/SettingsPage.tsx`
- Route shell and lazy pages:
  - `App.tsx`

## Research Constraints
- Responsive decisions should be flow-first, not breakpoint-only.
  Source: MDN responsive design
- Accessibility target should align with WCAG 2.2 AA.
  Source: W3C WCAG 2.2
- Menu button behavior should follow APG semantics.
  Source: WAI-ARIA APG menu button pattern

## Priority Tracks
### P0 (must)
- Zero horizontal overflow on core routes.
- Critical actions always reachable on mobile.
- Labels and focus states intact on all forms.
- Alliance switch/scope indicators and chat entry points must remain clear on all target widths.

### P1 (advanced)
- Add route-level visual regression checks.
- Add keyboard interaction map for gameplay/profile/settings.
- Improve dense desktop spacing and information hierarchy.
- Add design-system governance for consistent visual language.
- Add responsive patterns for direct/alliance/match chat surfaces.

### P2 (frontier)
- Container-query driven adaptive components.
- Motion/accessibility preference variants.
- Component maturity and token-governance contracts.

## Mini-Roadmaps
- `docs/roadmaps/04-ui-responsive-accessibility/responsive-layouts.md`
- `docs/roadmaps/04-ui-responsive-accessibility/navigation-and-header.md`
- `docs/roadmaps/04-ui-responsive-accessibility/forms-and-input-ergonomics.md`
- `docs/roadmaps/04-ui-responsive-accessibility/accessibility-aa.md`
- `docs/roadmaps/04-ui-responsive-accessibility/design-system-and-visual-governance.md`

## Verification Contracts
Use: C2, C3, C4, C5, C8.

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
