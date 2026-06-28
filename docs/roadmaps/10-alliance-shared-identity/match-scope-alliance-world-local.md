> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Match Scope (Alliance, World, Local)

Last updated: 2026-02-25

## Problem
Users need standard games with both alliance members and external players; forcing external games into Quick Night corrupts product semantics.

## Current Implementation Snapshot
Status: `Implemented in Wave 2 (foundation phase)`

Evidence:
- `MatchScope` enum is implemented in `prisma/schema.prisma`.
- Scope-aware writes exist on `POST /api/alliances/:allianceId/history` in `server/api/routes/alliances.js`.
- Legacy `POST /api/history` is still supported and mirrored to alliance records.

## Scope Contract
Add explicit `match_scope` without changing gameplay rules:
- `alliance_internal`
- `cross_alliance`
- `world_open`
- `local_standard`
- `quick_night` (existing path)

## Must / Should / Could
### Must
- Keep login/register and Quick Night unchanged.
- Store outside-alliance games as standard matches with scope metadata.
- Define stat update matrix per scope.

### Should
- Add ranking eligibility rules by scope.
- Add scope filters in history/stats UI.

### Could
- Add tournament/event scopes later.

## Data Contract (Implementation Ready)
- `GameNight` replacement/addition fields:
  - `scope`, `host_alliance_id`, `visibility`, `eligibility_flags`, `created_by_user_id`.
- Participant model:
  - immutable `participant_player_id` references.
- Stats projections:
  - `personal_projection`, `alliance_projection`, optional `world_projection`.

## Source-Backed Constraints
- Matchmaking service decomposition reference:
  https://open-match.dev/site/docs/
- Authorization and tenancy isolation:
  https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Conditional updates for conflicting scope edits:
  https://datatracker.ietf.org/doc/html/rfc7232

## Delivery Plan
### P0
- Finalize scope taxonomy and stats matrix.
- Add schema and API contracts for scope-aware writes/reads.

### P1
- Add ranking-eligibility service checks and anti-abuse safeguards.

### P2
- Add dynamic scope policy by region/season/event.

## Verification
- Cross-alliance games persist as standard history records (not Quick Night).
- Scope filters produce deterministic stats partitions.
- Legacy users remain unaffected until feature flags are enabled.

## KPIs
- % of external games correctly classified by scope.
- Stats mismatch rate across projections.

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
