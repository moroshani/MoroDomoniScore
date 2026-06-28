# Mini-Roadmap: Gameplay and Scoring

Last updated: 2026-02-24

## Problem
Gameplay scoring is the highest-frequency user action. Small friction or correctness bugs have outsized impact.

## Scope Constraint
- Gameplay rules remain unchanged.
- Any alliance/world rollout must reuse current scoring semantics.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial stress hardening`

Evidence:
- Team cards with in-place numeric input and inline submit:
  - `components/Scoreboard.tsx`
- Undo/edit and end-set controls:
  - `components/Scoreboard.tsx`
- Compact header in scoring route:
  - `App.tsx` + `components/AppHeader.tsx`

## Gap Matrix
- Implemented:
  - Inline mobile submit near inputs.
  - Desktop action bar and edit/undo controls.
  - Numeric input constraints.
- Missing:
  - High-frequency interaction stress tests.
  - Keyboard-first fast entry mode for desktop operators.

## Source-Backed Considerations
- Interaction latency and responsiveness should align with INP targets.
  Source: https://web.dev/articles/optimize-inp
- Form ergonomics and action proximity are critical for mobile completion rates.
  Source: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
  Source: https://www.w3.org/WAI/WCAG22/quickref/

## Delivery Plan
### P0
- Preserve score integrity under rapid repeated input/submit/edit.
- Ensure no hidden required action due layout changes.

### P1
- Add gameplay stress test harness:
  - fast sequential submissions,
  - repeated undo/edit cycles,
  - long night sessions.
- Add optional desktop keyboard shortcuts.

### P2
- Add optional compact "one-hand" mode for mobile operators.
- Add advanced anti-mistap safeguards (undo window or confirm mode by preference).

## Verification
- Smallest mobile widths complete round entry without critical scroll friction.
- No state corruption in rapid interaction tests.
- Desktop and mobile parity for core scoring actions.

## KPIs
- Round submit time.
- Scoring correction (undo/edit) rate.
- Scoring bug incident rate.

## Expansion Round 2 (2026-02-23)
- Add scoring integrity test matrix for tie-break and edit-heavy nights.
- Add temporary autosave checkpoint design for round-entry resilience.
- Add optional desktop numpad mode with explicit enable toggle.
- Add in-context mistake recovery UX (single-tap correction path).

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 4
- Dependencies locked: Wave 2 identity model and Wave 3 realtime contracts
- Required feature flags: profile_settings_v2, scoring_entry_ux_v2, history_scope_filters_v1
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
- Exit artifact required: Product surface acceptance report (web + PWA, all supported sizes)


## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
