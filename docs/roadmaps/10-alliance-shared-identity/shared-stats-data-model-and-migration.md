> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Shared Stats Data Model and Migration

Last updated: 2026-02-26

## Problem
Stats are currently derived by player name in per-user history, which cannot produce trusted shared statistics across households.

## Current Implementation Snapshot
Status: `Implemented in Wave 2/Wave 5 (foundation + snapshot materialization + parity tooling)`

Evidence:
- Alliance-scoped history and participants are implemented:
  - `AllianceGameNight`, `AllianceGameParticipant` in `prisma/schema.prisma`
  - `/api/alliances/:allianceId/history` and `/api/alliances/:allianceId/stats` routes
- Snapshot materialization for teamup and teamup-matchup aggregates is implemented:
  - `AllianceTeamupSnapshot`, `AllianceTeamupMatchupSnapshot` in `prisma/schema.prisma`
  - migration: `prisma/migrations/20260226111000_wave5_teamup_snapshots/migration.sql`
  - calculator/refresh runtime: `server/api/teamupSnapshots.js`
  - write-path refresh hooks: `server/api/routes/alliances.js`, `server/api/routes/history.js`
  - snapshot-first read fallback: `GET /api/alliances/:allianceId/stats`, `GET /api/alliances/:allianceId/teamups/matchups`
- Ops automation for snapshot lifecycle is implemented:
  - `scripts/ops/wave5_backfill_teamups.mjs`
  - `scripts/ops/wave5_smoke.mjs`
- Backfill and strict parity tooling is implemented:
  - `scripts/ops/wave2_backfill_alliance.mjs`
  - `scripts/ops/wave2_parity_report.mjs`
- Validation artifacts are green:
  - `docs/roadmaps/artifacts/wave2-backfill-apply.json`
  - `docs/roadmaps/artifacts/wave2-parity-report.json`

## Target Model
- Store alliance-scoped game nights with immutable participant references (`player_id`).
- Preserve current game-rule payload shape while adding identity metadata.
- Keep derived stats materialization strategy for fast reads.

## Migration Strategy (Recommended)
### Phase A - Additive schema
- Add alliance and participant tables without deleting old tables.
- Add compatibility reads (old + new).

### Phase B - Backfill
- Create one default personal alliance per existing user.
- Migrate existing `Player` records into `AlliancePlayer`.
- Migrate `GameNight.data` into alliance-scoped records with participant mapping.

### Phase C - Cutover
- Switch writes to alliance tables.
- Keep rollback window with dual-read checks.

### Phase D - Cleanup
- Remove legacy per-user paths after parity proof.

## Implementation Packet (Migration Gates)
- Gate M1: additive schema deployed, no reader/writer switch.
- Gate M2: backfill dry-run report generated (`migrated`, `unmapped`, `conflict`).
- Gate M3: dual-read parity script passes (`legacy_stats == new_stats` for sample accounts).
- Gate M4: write cutover enabled behind feature flag.
- Gate M5: legacy writes disabled only after 2 stable release windows.

## Source-Backed Constraints
- Materialized/derived read paths are valid for heavy aggregates.
  Source: PostgreSQL materialized views
  https://www.postgresql.org/docs/current/rules-materializedviews.html
- Data integrity requires clear referential boundaries and migration safety.
  Source: PostgreSQL DDL/constraints (current docs)
  https://www.postgresql.org/docs/current/ddl-constraints.html
- Concurrency controls should use conditional updates to prevent lost updates.
  Source: RFC 7232
  https://datatracker.ietf.org/doc/html/rfc7232

## Delivery Plan
### P0
- Define ERD and migration scripts.
- Add backfill dry-run tool and mismatch report.
- Replace name-based stat keys with `player_id` keys.

### P1
- Add incremental aggregate updater (night saved -> stats projection update). `Implemented`
- Add integrity checker between raw records and aggregates. `Implemented baseline via wave5 backfill+smoke; deep drift dashboard pending`

### P2
- Add archival policy for oversized alliances and long history retention windows.

## Verification
- Shared stats parity test passes across multiple member accounts in same alliance.
- Backfill mismatch count is zero before cutover.
- Legacy and new read paths produce same totals in shadow mode.

## KPIs
- Stats query p95 latency.
- Backfill mismatch rate.
- Aggregate drift incidents.

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
