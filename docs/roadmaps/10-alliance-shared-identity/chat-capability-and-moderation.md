> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: Chat Capability and Moderation

Last updated: 2026-02-24

## Problem
Outside-alliance play and alliance collaboration require communication channels; without controlled chat, coordination and trust degrade.

## Current Implementation Snapshot
Status: `Missing`

Evidence:
- No chat entities or endpoints in current API.
- No moderation/reporting pipeline.

## Required Chat Surfaces
- `direct_chat` (1:1)
- `alliance_chat` (group)
- `match_chat` (mid-game room)

## Security/Moderation Baseline
- Abuse controls:
  - per-user + per-room rate limits,
  - mute/block/report,
  - role-based moderation actions,
  - immutable moderation audit events.
- Privacy controls:
  - TLS in transit,
  - encrypted storage for sensitive metadata,
  - retention policy by channel type.

## Encryption Options
### Baseline (recommended now)
- Transport TLS + server-side moderation visibility.
- At-rest encryption for sensitive secrets/tokens.

### Advanced
- Partial client-side encryption for direct chat with opt-in constraints.

### Frontier
- Group E2EE (MLS-based) with policy-aware moderation architecture.

## Source-Backed Constraints
- OWASP WebSocket security and auth constraints:
  https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP logging and crypto storage guidance:
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- MLS group messaging standard reference:
  https://www.rfc-editor.org/rfc/rfc9420
- libsodium key exchange/secure primitives reference:
  https://doc.libsodium.org/key_exchange

## Delivery Plan
### P0
- Add chat room/message schema and API contracts.
- Add room-scoped websocket channels and moderation actions.
- Add chat retention and deletion policy.

### P1
- Add trust/safety automation hooks (alerts, abuse scoring, moderator inbox).
- Add message delivery/read-state indicators.

### P2
- Evaluate MLS-based E2EE pilot for direct chat.

## Verification
- Chat works for direct/alliance/match contexts.
- Abuse controls are enforceable and auditable.
- Moderation actions remain available in degraded network conditions.

## KPIs
- Message delivery success rate.
- Abuse incident response time.
- False-positive moderation rate.

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
