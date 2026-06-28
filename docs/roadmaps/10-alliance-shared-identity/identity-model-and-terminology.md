> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Identity Model and Terminology

Last updated: 2026-02-25

## Problem
Current identity is account-scoped and cannot represent a shared human identity across multiple household accounts.

## Current Implementation Snapshot
Status: `Implemented in Wave 2 (foundation phase)`

Evidence:
- Canonical alliance entities are now in `prisma/schema.prisma`:
  - `Alliance`, `AllianceMembership`, `AlliancePlayer`, `AlliancePlayerLink`
  - `AllianceGameNight`, `AllianceGameParticipant`
- Legacy per-user continuity remains active while new model runs in parallel:
  - `server/api/routes/players.js`
  - `server/api/routes/history.js`

## Recommended Model (No Rule Changes)
- Keep gameplay rules unchanged.
- Introduce these entities:
  - `Alliance` (shared boundary)
  - `AllianceMembership` (`owner`, `admin`, `member`, `viewer`)
  - `AlliancePlayer` (canonical person identity in alliance)
  - `AlliancePlayerLink` (optional link to `User`)
  - `AllianceGameNight` (same gameplay payload, alliance-scoped)
  - `AllianceGameParticipant` (join table, immutable references)

## Gap Matrix
- Implemented:
  - User accounts, per-user players, per-user history.
- Missing:
  - Canonical person identity independent of account.
  - Shared-group ownership boundary.
  - Immutable participant references for historical correctness.

## Source-Backed Constraints
- Tenant/owner isolation should be enforced in DB and API layers.
  Source: PostgreSQL RLS
  https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- IDs should support globally unique, scalable generation.
  Source: RFC 9562 (UUIDv7)
  https://www.rfc-editor.org/rfc/rfc9562
- Authorization graph should support future policy complexity.
  Source: OpenFGA + Zanzibar
  https://openfga.dev/docs/modeling/getting-started
  https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/

## Delivery Plan
### P0
- Define canonical terminology in docs and API contracts:
  - `user` (account), `player` (person identity), `alliance` (group).
- Add schema draft and ERD for alliance entities.
- Add migration design from per-user model to alliance model.

### P1
- Add duplicate detection/merge policy for same real person in one alliance.
- Add `player claim` states (`unclaimed`, `pending`, `claimed`).

### P2
- Evaluate ReBAC engine integration (`openfga` or `spicedb`) if policy complexity grows.

## Implementation Packet (Schema Draft)
- `Alliance(id, name, slug, created_by_user_id, created_at)`
- `AllianceMembership(id, alliance_id, user_id, role, status, joined_at)`
- `AlliancePlayer(id, alliance_id, display_name, avatar, claim_state, created_at)`
- `AlliancePlayerLink(id, alliance_player_id, user_id, linked_at, linked_by)`
- `AllianceGameNight(id, alliance_id, scope, data, created_by_user_id, created_at, version)`
- `AllianceGameParticipant(id, game_night_id, alliance_player_id, team_slot, role_snapshot)`

## Verification
- Every stat aggregate references `player_id` (not player name).
- Every mutable entity includes `alliance_id` boundary.
- Old per-user data is mappable to new model without loss.

## KPIs
- Duplicate-player creation rate per alliance.
- Claim success rate.
- Post-migration stats mismatch rate.

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


## Scope
This roadmap item defines execution boundaries and delivery policy for alliance shared identity.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
