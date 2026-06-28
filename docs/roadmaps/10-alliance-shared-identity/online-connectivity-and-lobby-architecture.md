> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Online Connectivity and Lobby Architecture

Last updated: 2026-02-24

## Problem
To play standard modes with external users (2P/3P/4P), the app needs explicit lobby, presence, and real-time state contracts.

## Current Implementation Snapshot
Status: `Partial baseline`

Evidence:
- Existing spectator websocket service:
  - `server/sync-server.js`
- No player-to-player online match lobby lifecycle.

## Architecture Options
### Baseline (recommended now)
- Host-authoritative score session with server-validated events.
- Lobby code + invite flow.
- Single writer by default, optional delegated scorer.

### Advanced
- Multi-writer collaboration with OCC conflict guards.
- Turn/control token for anti-collision writes.

### Frontier (future online domino engine)
- Fully authoritative game-state server with anti-cheat controls.
- Hidden information and deterministic replay contract.

## Must / Should / Could
### Must
- Preserve current scoring rules and local flows.
- Add room lifecycle (`create`, `join`, `ready`, `start`, `end`, `archive`).
- Add reconnect and state rehydration behavior.

### Should
- Add network-quality indicators and backoff diagnostics.
- Add idempotent event IDs.

### Could
- Add WebRTC data-channel fallback for LAN scenarios.

## Source-Backed Constraints
- WebSocket protocol baseline:
  https://www.rfc-editor.org/rfc/rfc6455
- ICE for NAT traversal (if WebRTC paths are used):
  https://www.rfc-editor.org/rfc/rfc8445
- WebRTC data channel transport:
  https://www.rfc-editor.org/rfc/rfc8831
- Socket room/backplane scale path:
  https://socket.io/docs/v4/rooms/
  https://socket.io/docs/v4/redis-adapter/

## Delivery Plan
### P0
- Define lobby state machine and API/events schema.
- Implement host-authoritative score sync for standard modes.

### P1
- Add OCC multi-writer option and conflict UI.
- Add reconnect diagnostics and session replay snapshots.

### P2
- Prototype authoritative game server for future gameplay mode.

## Verification
- Reconnect does not corrupt live match state.
- Duplicate event sends are idempotent.
- 2/3/4 player lobbies complete full match lifecycle reliably.

## KPIs
- Lobby join success rate.
- Reconnect recovery success rate.
- Sync conflict frequency.

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
