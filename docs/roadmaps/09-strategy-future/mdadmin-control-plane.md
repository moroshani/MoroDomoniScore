# Mini-Roadmap: mdadmin Control Plane

Last updated: 2026-02-23

## Goal
Create a dedicated control-plane app for support, operations, and audit actions without bloating the player-facing app.

## Current Implementation Snapshot
Status: `Planned`

Evidence:
- Current app includes account/session controls but no separate admin surface.
- Strategy references exist in roadmap and run history.

## Scope Candidates
- Release and health dashboard.
- User/session support tooling.
- Audit event exploration.
- Feature flag controls.
- Incident and diagnostics workspace.

## Security Requirements (Non-Negotiable)
- Strict RBAC and role-bound actions.
- Immutable audit trail for admin actions.
- Step-up verification for destructive operations.
- Separate session policy from user app sessions.

## Delivery Plan
### P0
- Define RBAC model and minimal module set.
- Define audit event schema and retention plan.

### P1
- Build internal-only MVP for superadmin/support.
- Add release/health/session tools with full action logging.

### P2
- Expand to full support and compliance workflows.
- Add policy engine and incident playbook integration.

## Verification
- No admin function leaks into player app surface.
- Every destructive admin action is logged and attributable.
- Access controls hold under negative tests.

## KPIs
- Support resolution time.
- Incident triage speed.
- Audit completeness score.

## Expansion Round 2 (2026-02-23)
- Add admin action taxonomy (read-only, corrective, destructive, emergency).
- Add immutable audit event schema proposal with retention tiers.
- Add support tooling UX model for safe high-volume operations.
- Add governance policy for admin feature rollout approvals.

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


## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
