# 03 Auth, Session, Security Roadmap

Last updated: 2026-02-24

## Goal
Maintain robust password-based authentication with transparent session control and hardened account protections, while preparing optional future layers without compromising simplicity.

## Cross-Program Requirement
- Any alliance/world/chat rollout must preserve current login/register semantics.
- Quick Night and existing auth flows cannot be degraded during migration.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Wave 1 hardening complete`

Evidence:
- Auth routes with remember-me TTL split and rate limit:
  - `server/api/routes/auth.js`
- Session binding and middleware enforcement:
  - `server/api/middleware/auth.js`
  - `prisma/schema.prisma` (`Session` model)
- Session controls, profile edit, password change:
  - `server/api/routes/users.js`
  - `pages/ProfilePage.tsx`
- Remember-me UI and client storage strategy:
  - `components/Auth.tsx`
  - `lib/api.ts`
- Immortal account protection (server + UI-scoped warning):
  - `server/api/routes/users.js`
  - `pages/ProfilePage.tsx`
- Security event stream and suspicious login detection:
  - `server/api/security.js`
  - `prisma/schema.prisma` (`SecurityEvent` model)
- Recovery workflow with throttled request endpoint:
  - `server/api/routes/auth.js`
  - `prisma/schema.prisma` (`RecoveryRequest` model)
- API security headers baseline:
  - `server/api/index.js`

## Research Constraints
- Session revocation and session lifecycle must be server-enforced.
  Source: OWASP Session Management
- Authentication flows require brute-force protections and strong error strategy.
  Source: OWASP Authentication
- Password hashes must be resistant and policy-backed.
  Source: OWASP Password Storage
- JWT usage should follow BCP to avoid misuse.
  Source: RFC 8725

## Priority Tracks
### P0 (must)
- Keep auth/session safeguards reliable in all modes.
- Preserve server-side immortal account controls.
- Keep remember-me semantics explicit and testable.
- Add alliance/world authorization boundary checks to auth middleware contracts.

### P1 (advanced)
- Add risk signals (new device/IP/location anomaly indicators).
- Add stronger password policy controls and breach-check option.
- Add audit event stream for sensitive account actions.
- Add adaptive abuse detection and suspicious session workflows.
- Add privileged-action step-up path for alliance ownership transfer and high-risk moderation actions.

### P2 (frontier)
- Optional step-up verification for destructive actions.
- Optional cookie-mode security variant evaluation.
- Optional risk-adaptive authentication policies.

## Mini-Roadmaps
- `docs/roadmaps/03-auth-session-security/sessions-and-remember-me.md`
- `docs/roadmaps/03-auth-session-security/account-protection-and-recovery.md`
- `docs/roadmaps/03-auth-session-security/transport-and-browser-security.md`
- `docs/roadmaps/03-auth-session-security/abuse-prevention-and-anomaly-detection.md`

## Verification Contracts
Use: C1, C2, C5, C6, C8.

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
