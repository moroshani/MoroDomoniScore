# Mini-Roadmap: Sessions and Remember-Me

Last updated: 2026-02-23

## Problem
Users need seamless multi-device continuity and explicit control over active sessions, without weakening security.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Implemented advanced session intelligence (Wave 1)`

Evidence:
- Remember-me checkbox and preference persistence:
  - `components/Auth.tsx`
  - `lib/api.ts`
- Token/session TTL split (7d vs 30d):
  - `server/api/routes/auth.js`
- Session table and revocation APIs:
  - `prisma/schema.prisma`
  - `server/api/routes/users.js`
- Session middleware verification and last-seen touch:
  - `server/api/middleware/auth.js`
- Profile session management UI:
  - `pages/ProfilePage.tsx`

## Source-Backed Constraints
### Must
- Session invalidation must be immediate and authoritative server-side.
  Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Brute-force and rate limiting should protect login path.
  Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

### Should
- Display session metadata users can act on (device, IP, last activity).
  Source: OWASP session management guidance.

### Could
- Add anomaly scoring and contextual warnings (new region/IP drift).

## Gap Matrix
- Implemented:
  - Remember-me control and split TTL.
  - Session listing + revoke one + revoke others.
  - Password change revokes other sessions.
- Missing:
  - No Wave 1 gap remains in this item; P2 enhancements are optional.

## Delivery Plan
### P0
- Keep session controls and revocation paths stable.
- Keep middleware check strict (`sid`, `jti`, expiry, revoke state).

### P1
- Add session alias/name field and trust marker.
- Add suspicious-session toast/email on unusual fingerprints.

### P2
- Add self-service session risk dashboard.
- Add user-initiated forced re-auth policy toggles.

## Verification
- Login with remember-me off creates shorter session expiration.
- Login with remember-me on creates extended session expiration.
- Revoked session token returns `401` on protected endpoints.
- Revoking current session logs user out immediately.

## KPIs
- Session management success rate.
- Unauthorized access attempts blocked.
- Session-support incidents per 1k active users.

## Expansion Round 2 (2026-02-23)
- Add explicit session naming format proposal (`platform + browser + first_seen`).
- Add silent session-expiry UX proposal with preserved unsaved form warning where relevant.
- Add optional session fingerprint entropy scoring for suspicious re-use patterns.
- Add monthly session-table hygiene task (cleanup/reporting) in operations backlog.

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
