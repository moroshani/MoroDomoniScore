# Mini-Roadmap: Abuse Prevention and Anomaly Detection

Last updated: 2026-02-23

## Problem
Static rate limits alone may not detect targeted abuse patterns or suspicious account activity over time.

## Current Implementation Snapshot
Status: `Implemented Wave 1 baseline`

Evidence:
- Login limiter and lockout map exist:
  - `server/api/routes/auth.js`
- Session metadata includes IP and user agent:
  - `prisma/schema.prisma`
  - `server/api/routes/auth.js`

Wave 1 implementation evidence:
- Suspicious login risk scoring and event logging in `server/api/security.js`.
- Security event retrieval endpoint in `server/api/routes/users.js`.
- User security alert email hook in `server/api/mailer.js` (when SMTP configured).

## Source-Backed Constraints
### Must
- Authentication attack surface needs layered controls.
  Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

### Should
- Session metadata should be used for suspicious behavior detection.
  Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

### Could
- Add risk scoring by IP drift, UA shift, and impossible travel heuristics.

## Delivery Plan
### P0
- Add server-side suspicious login event logging.
- Add user notification for high-risk session events.

### P1
- Add configurable risk thresholds and session trust states.
- Add temporary step-up checks for high-risk actions.

### P2
- Add anomaly model tuning loop with false-positive controls.

## Verification
- Simulated suspicious events are detected and logged.
- Normal users are not blocked excessively.

## KPI
- Abuse detection precision.
- False-positive enforcement rate.

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
