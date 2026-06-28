> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Household Subgroups and Cross-Family Play

Last updated: 2026-02-26

## Problem
One alliance is the correct shared boundary, but many real groups need smaller household/family clusters inside it. Without subgroups, roster management, stats context, moderation, and scheduling become noisy and fragile.

## Current Implementation Snapshot
Status: `Implemented baseline + household-vs-household matchup analytics + household invite shortcuts; advanced policy/recommendation tracks still pending`

Evidence:
- Dedicated household entities and mappings are live in `prisma/schema.prisma` (`AllianceHousehold`, `AllianceHouseholdUser`, `AllianceHouseholdPlayer`) with migration `20260226122000_wave5_household_subgroups`.
- Household CRUD and membership APIs are live in `server/api/routes/alliances.js`:
  - `GET/POST/PATCH /api/alliances/:id/households`
  - `POST/DELETE /api/alliances/:id/households/:householdId/users/:userId`
  - `POST/DELETE /api/alliances/:id/households/:householdId/players/:alliancePlayerId`
- Household filters are live for shared history/stats/teamups:
  - `GET /api/alliances/:id/history?householdId=...`
  - `GET /api/alliances/:id/stats?householdId=...`
- Household matchup analytics are live:
  - `GET /api/alliances/:id/matchups?dimension=household`
  - Matchup table is surfaced in alliance stats UI.
- Household invite shortcut is live:
  - `POST /api/alliances/:id/invitations` supports optional `householdId`
  - `POST /api/alliances/invitations/accept` auto-assigns accepted member to target household when valid/active
  - Invite list/UI includes target household visibility.
- Alliance UI wiring is live in `pages/AlliancePage.tsx`, `components/History.tsx`, and `components/Stats.tsx`.
- Remaining P1/P2 items (onboarding assistant, recommendation/merge tooling, advanced moderation segmentation/policy packs) are pending.

## Scope
- Add household/family subgroups inside one alliance.
- Define user and player membership in one or more households.
- Support cross-household games without forcing Quick Night.
- Keep one-alliance constraint while allowing multi-household membership.
- Add household-aware stats, filtering, moderation, and invites.

## Recommended Baseline
- Canonical hierarchy:
  - `Alliance` (single trust boundary)
  - `Household` (subgroup boundary inside alliance)
  - `AlliancePlayer` (canonical person identity)
- Membership model:
  - `AllianceHousehold` table (`id`, `allianceId`, `name`, `slug`, `isActive`, audit fields)
  - `AllianceHouseholdUser` table (`householdId`, `userId`, `role`, `isPrimary`)
  - `AllianceHouseholdPlayer` table (`householdId`, `alliancePlayerId`, `isPrimary`)
- Policy:
  - User can belong to multiple households in the same alliance.
  - Player can belong to multiple households in the same alliance.
  - Exactly one primary household per player (optional for users, required for ranking partitions).
- Match policy:
  - `alliance_internal` and `cross_alliance` matches remain normal standard matches.
  - Match metadata includes household context per participant/team when available.
  - Never coerce non-quick matches into Quick Night.

## Data and Stats Policy
- Keep player identity canonical (`alliancePlayerId`) for all aggregates.
- Add derived projections:
  - `household_personal`: player performance within selected household context.
  - `household_pairings`: best 2v2 pairings by household.
  - `household_vs_household`: cross-household matchup records.
- Ranking eligibility remains policy-gated and excludes ambiguous guest identities.

## API Contract Draft
- `GET /api/alliances/:id/households`
- `POST /api/alliances/:id/households`
- `PATCH /api/alliances/:id/households/:householdId`
- `POST /api/alliances/:id/households/:householdId/users`
- `POST /api/alliances/:id/households/:householdId/players`
- `DELETE /api/alliances/:id/households/:householdId/users/:userId`
- `DELETE /api/alliances/:id/households/:householdId/players/:alliancePlayerId`
- `GET /api/alliances/:id/stats?householdId=...`
- `GET /api/alliances/:id/teamups?householdId=...`
- `GET /api/alliances/:id/matchups?dimension=household`

## Security and Authorization
- All household operations require verified alliance membership first.
- Role checks:
  - `owner/admin`: create/edit/delete households and assign members.
  - `member`: read household views and own eligible actions.
  - `viewer`: read-only.
- Enforce server-side authorization matrix; never trust client-provided household IDs.
- Add audit events for household membership changes and sensitive reassignments.

## Source-Backed Constraints
- Relationship-based auth is recommended for hierarchical collaboration boundaries.
  Source: OpenFGA
  https://openfga.dev/docs/modeling/getting-started
- Consistent authorization at scale requires tuple-based relation evaluation.
  Source: Zanzibar
  https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/
- Data boundaries should be enforced in database policy for defense in depth.
  Source: PostgreSQL RLS
  https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Membership and identity actions must be hardened against abuse.
  Source: OWASP Authentication
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

## Delivery Plan
### P0
- Add household schema + additive migrations + backfill scaffolding.
- Add household CRUD and membership APIs with audit events.
- Add household filters for stats/history/teamups.
- Add non-regression tests for login/register, quick night, existing alliance flows.

### P1
- Add household-vs-household matchup analytics and trend cards.
- Add household invite shortcuts and onboarding assistant.
- Add moderation views scoped by household.

### P2
- Add policy engine adapter for advanced household governance (custom role packs).
- Add recommendation engine for likely duplicate households and merge suggestions.

## Verification
- User with no alliance membership cannot access household endpoints.
- Multi-household membership works for one user and one player without duplication.
- Household filters do not alter global canonical stats.
- Cross-household standard matches are stored as standard scope, not Quick Night.
- Existing Waves 0-4 functionality remains green after rollout.

## KPIs
- Household setup completion rate.
- Household filter usage rate in stats/history.
- Duplicate household merge/reassign support tickets.
- Cross-household match creation success rate.

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
- Exit artifact required: Household subgroup rollout dossier with parity, authZ, and non-regression proofs

## Scope
This roadmap item defines subgroup/family modeling inside a single alliance and how cross-family standard play remains first-class.

## Priority Tiers
### P0
- Deliver mandatory contract and non-regression outcomes for this scope.

### P1
- Deliver advanced reliability and automation improvements for this scope.

### P2
- Deliver frontier optimization once P0/P1 are stable.

## Verification Contract References
- C1, C2, C3, C4, C5, C6, C7, C8, C9, C10.

## Risk and Rollback Summary
- Primary risks: identity fragmentation, incorrect subgroup authorization, and stats double-counting.
- Rollback: disable household feature flag, keep alliance-level behavior, and re-run parity/backfill diff checks.
