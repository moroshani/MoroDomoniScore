> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Membership, Roles, Invitations, and Claims

Last updated: 2026-02-25

## Problem
Shared stats require safe group membership and identity-claim workflows, otherwise alliance data can be hijacked or fragmented.

## Current Implementation Snapshot
Status: `Implemented in Wave 2 (foundation phase)`

Evidence:
- Alliance role/status tables are in `prisma/schema.prisma`.
- Invitation and claim endpoints are implemented in `server/api/routes/alliances.js`.
- Invite and claim abuse limits are enforced with route-level limiters.

## Scope
- Role model for alliance membership.
- Invite acceptance and revocation.
- Non-user player claim to user account.
- Merge and conflict policy for duplicates.

## Recommended Baseline
- Roles:
  - `owner`: full control, ownership transfer.
  - `admin`: manage roster/members (except owner transfer).
  - `member`: can score and view alliance stats/history.
  - `viewer`: read-only.
- Invitations:
  - Time-limited, single-use tokens.
  - Token hash stored server-side.
  - Optional email-based invite, optional join-code flow.
- Claims:
  - Player can be created as non-user.
  - User can claim a player with alliance approval policy.
  - Claim produces immutable audit event.

## Source-Backed Constraints
- Authentication and membership actions must resist brute force and token abuse.
  Source: OWASP Authentication
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Sensitive sessions and revocation must be server-enforced.
  Source: OWASP Session Management
  https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Account linking is a valid model for merging identities over time.
  Source: Firebase account linking
  https://firebase.google.com/docs/auth/web/account-linking
- Organization-role and invitation models are proven collaboration pattern references.
  Source: GitHub org roles and invitations
  https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization
  https://docs.github.com/organizations/managing-membership-in-your-organization/inviting-users-to-join-your-organization

## Delivery Plan
### P0
- Add alliance role matrix and authorization checks.
- Add invitation create/list/revoke/accept endpoints.
- Add claim request + approve/reject flow.

### P1
- Add duplicate detection assistant (same name/metadata risk scoring).
- Add merge workflow with dry-run preview.

### P2
- Add optional policy-engine adapter for complex enterprise-like membership policies.

## Implementation Packet (API Draft)
- `POST /api/alliances` (create)
- `POST /api/alliances/:id/invitations` (create invite)
- `POST /api/alliances/invitations/accept` (accept invite token/code)
- `DELETE /api/alliances/:id/invitations/:inviteId` (revoke)
- `POST /api/alliances/:id/players/:playerId/claims` (request claim)
- `POST /api/alliances/:id/claims/:claimId/approve` (approve claim)
- `POST /api/alliances/:id/claims/:claimId/reject` (reject claim)
- `POST /api/alliances/:id/players/merge` (duplicate merge with preview token)

## Verification
- Unauthorized users cannot read/mutate alliance data.
- Invite token replay is blocked.
- Claims cannot rewire historical participants silently.

## KPIs
- Invite acceptance rate.
- Unauthorized access rejection rate.
- Claim/merge support incident rate.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Waves 2-5 (foundational to UX)
- Dependencies locked: Wave 1 security baseline, additive migrations, feature-flag infra
- Required feature flags: alliance_identity_v1, scope_world_alliance_v1, chat_surface_v1, sync_observability_v1
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
- Exit artifact required: Alliance/world rollout dossier with migration parity and non-regression proofs


## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
