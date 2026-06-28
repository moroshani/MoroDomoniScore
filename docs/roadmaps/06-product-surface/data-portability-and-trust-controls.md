# Mini-Roadmap: Data Portability and Trust Controls

Last updated: 2026-02-24

## Problem
Users need confidence that their data is portable, understandable, and controllable.

## Current Implementation Snapshot
Status: `Partial`

Evidence:
- Account deletion exists.
- History and stats are visible in-app.

Missing:
- No user-facing data export package.
- No account data transparency dashboard.

## Source-Backed Constraints
### Must
- Destructive actions must be explicit and safeguarded.
  Source: OWASP auth/session guidance.

### Should
- Users should be able to export their own account data safely.

### Could
- Add privacy-level controls for local-only or sync-enabled modes.

## Delivery Plan
### P0
- Define export schema for profile, sessions metadata, and game history.
- Define data deletion report confirmation artifact.
- Include alliance/world scope metadata and chat export policy definitions.

### P1
- Implement on-demand export endpoint + UI download flow.
- Add transparency panel for retained account data categories.

### P2
- Add selective data retention preferences for non-critical analytics.
- Add signed export integrity checksum.

## Verification
- Export package matches documented schema.
- Deletion and export workflows are understandable and recoverable where applicable.

## KPI
- Export success rate.
- Data-trust support requests per 1k users.

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


## Scope
This roadmap item defines execution boundaries and delivery policy for product surface.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
