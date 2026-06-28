> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# 10 Alliance, World, and Shared Identity Roadmap

Last updated: 2026-02-26
Research verification date: 2026-02-25

## Goal
Enable trusted shared stats across households while also supporting games with people outside alliance boundaries.

## Hard Invariants (Non-Negotiable)
- Login/register stays active throughout rollout.
- Quick Night stays active and unchanged.
- No gameplay-rule changes in this program.
- No downtime rollout pattern (expand -> backfill -> cutover -> cleanup).
- PWA local gameplay remains available even when backend is unavailable.

## Current Implementation Snapshot
Status: `Wave 2 and Wave 5 shared-stats foundations implemented; later-wave UX/realtime/world tracks pending`

Evidence:
- Alliance/shared-identity schema exists in `prisma/schema.prisma` and Wave 2 migrations.
- Alliance APIs and runtime authZ matrix exist:
  - `server/api/routes/alliances.js`
  - `server/api/allianceRuntime.js`
- Legacy continuity is preserved through dual-write sync:
  - `server/api/routes/players.js`
  - `server/api/routes/history.js`
- Backfill/parity/smoke evidence artifacts are green:
  - `docs/roadmaps/artifacts/wave2-backfill-dry-run.json`
  - `docs/roadmaps/artifacts/wave2-backfill-apply.json`
  - `docs/roadmaps/artifacts/wave2-parity-report.json`
  - `docs/roadmaps/artifacts/wave2-gate-status.json`
- Teamup snapshot materialization baseline is implemented:
  - `prisma/migrations/20260226111000_wave5_teamup_snapshots/migration.sql`
  - `server/api/teamupSnapshots.js`
  - `scripts/ops/wave5_backfill_teamups.mjs`
  - `scripts/ops/wave5_smoke.mjs`

## Recommended Canonical Model
- `User`: authenticated account identity.
- `Alliance`: private group boundary (family/team).
- `Household`: optional subgroup boundary inside one alliance (family cluster/unit).
- `Player`: canonical person identity inside one alliance (claimable by user account, assignable to one or more households).
- `MatchScope`: where a standard match belongs:
  - `alliance_internal`
  - `cross_alliance`
  - `world_open`
  - `local_standard`
  - `quick_night` (existing behavior, unchanged)

## Data and Stats Policy
- Outside-alliance games are never forced into Quick Night.
- Stats update policy:
  - Personal stats: always for linked players.
  - Alliance stats: only for participants in that alliance.
  - World ranking: only for ranking-eligible matches (policy-gated).

## Cross-Cutting Impact Matrix
- UX/UI:
  - alliance create/join/switch, world/lobby entry, roster claim/merge, chat surfaces.
- Security and encryption:
  - alliance/world authorization checks, invite hardening, audit streams, key handling.
- Logic and consistency:
  - canonical `player_id` aggregates, conflict-safe writes, idempotent mutations.
- Performance and reliability:
  - websocket room fan-out, reconnect state sync, query/index redesign.
- PWA/offline:
  - local-first continuity for scoring and history if backend is down.
- DevOps:
  - additive migrations, dual read/write windows, rollback-safe deployment.

## Mini-Roadmaps
- `docs/roadmaps/10-alliance-shared-identity/identity-model-and-terminology.md`
- `docs/roadmaps/10-alliance-shared-identity/household-subgroups-and-cross-family-play.md`
- `docs/roadmaps/10-alliance-shared-identity/match-scope-alliance-world-local.md`
- `docs/roadmaps/10-alliance-shared-identity/membership-roles-invitations-and-claims.md`
- `docs/roadmaps/10-alliance-shared-identity/shared-stats-data-model-and-migration.md`
- `docs/roadmaps/10-alliance-shared-identity/online-connectivity-and-lobby-architecture.md`
- `docs/roadmaps/10-alliance-shared-identity/chat-capability-and-moderation.md`
- `docs/roadmaps/10-alliance-shared-identity/api-authorization-and-encryption.md`
- `docs/roadmaps/10-alliance-shared-identity/ux-ui-alliance-surface.md`
- `docs/roadmaps/10-alliance-shared-identity/offline-survivability-and-continuity.md`
- `docs/roadmaps/10-alliance-shared-identity/sync-consistency-and-observability.md`

## Source-Backed Constraints (Primary Sources)
- PostgreSQL Row-Level Security:
  https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- PostgreSQL Materialized Views:
  https://www.postgresql.org/docs/current/rules-materializedviews.html
- OWASP Authentication / Session / Crypto / Logging:
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- OWASP WebSocket Security:
  https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- Open Match (matchmaking architecture reference):
  https://open-match.dev/site/docs/
- OpenFGA + Zanzibar authorization references:
  https://openfga.dev/docs/modeling/getting-started
  https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/
- WebSocket / ICE / WebRTC DataChannels:
  https://www.rfc-editor.org/rfc/rfc6455
  https://www.rfc-editor.org/rfc/rfc8445
  https://www.rfc-editor.org/rfc/rfc8831
- Socket.IO rooms + Redis adapter:
  https://socket.io/docs/v4/rooms/
  https://socket.io/docs/v4/redis-adapter/
- Service worker/offline/persistence:
  https://web.dev/offline-cookbook/
  https://web.dev/articles/offline-fallback-page
  https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
  https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- Conditional updates and idempotency foundations:
  https://datatracker.ietf.org/doc/html/rfc7232
- UUID format (UUIDv7 option):
  https://www.rfc-editor.org/rfc/rfc9562

## Verification Contracts
Use: C1, C2, C3, C4, C5, C6, C7, C8.

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

## Priority Tiers
### P0
- Deliver mandatory contract and non-regression outcomes for this scope.

### P1
- Deliver advanced reliability and automation improvements for this scope.

### P2
- Deliver frontier optimization once P0/P1 are stable.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
