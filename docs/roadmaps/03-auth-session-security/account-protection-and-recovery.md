# Mini-Roadmap: Account Protection and Recovery

Last updated: 2026-02-23

## Problem
Critical account protections must be enforced in backend logic and accompanied by safe recovery operations.

## Current Implementation Snapshot
Status: `Implemented protection baseline`, `Recovery workflow implemented (Wave 1)`

Evidence:
- Immortal account protection for delete and identity immutability:
  - `server/api/routes/users.js`
  - `server/api/routes/auth.js`
- UI warning only for immortal account:
  - `pages/ProfilePage.tsx`
- Account deletion confirmation phrase:
  - `pages/ProfilePage.tsx`

## Source-Backed Constraints
### Must
- Privilege and destructive action checks must be server-side.
  Source: OWASP authentication/session cheat sheets.

### Should
- Recovery workflow should require auditable support-safe process.
  Source: OWASP account lifecycle best-practice framing.

### Could
- Introduce step-up verification for destructive account operations.

## Gap Matrix
- Implemented:
  - Immortal account cannot be deleted.
  - Immortal username/email cannot be changed.
  - Immortal warning not shown to non-immortal users.
- Missing:
  - No Wave 1 gap remains in this item; step-up/cooling-period remains optional P2.

## Delivery Plan
### P0
- Preserve current immortal constraints and UI scoping.
- Ensure delete flow always requires explicit typed confirmation.

### P1
- Add audited recovery ticket flow for locked-out users.
- Add recovery throttling and support action logging.

### P2
- Add optional step-up verification for delete or email change.
- Add account-cooling period option before permanent deletion.

## Verification
- Immortal delete request returns `403`.
- Non-immortal delete flow removes account data as designed.
- Non-immortal users never see immortal-specific warning text.

## KPIs
- Recovery request resolution time.
- Unauthorized recovery attempts blocked.
- False-positive lockout events.

## Expansion Round 2 (2026-02-23)
- Add protected-account mutation audit log requirement (attempt + reason + actor).
- Add recovery conflict policy when account deletion was recently requested.
- Add recovery cooldown and appeal workflow to reduce social-engineering risk.
- Add immutable account policy documentation endpoint for support tooling parity.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 1
- Dependencies locked: Wave 0 governance; DB session tables and revocation contracts
- Required feature flags: auth_session_v2, remember_me_ui_v1, passkey_fallback_v1
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
- Exit artifact required: Auth/session security verification report with revocation and fallback coverage


## Scope
This roadmap item defines execution boundaries and delivery policy for auth session security.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
