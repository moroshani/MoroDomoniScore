> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: API Authorization and Encryption

Last updated: 2026-02-25

## Problem
Alliance sharing expands attack surface: authorization bugs, invite abuse, and data leakage risks increase significantly.

## Current Implementation Snapshot
Status: `Implemented in Wave 2 (policy-table baseline)`

Evidence:
- Session-bound JWT model exists.
  - `server/api/routes/auth.js`
  - `server/api/middleware/auth.js`
- Alliance-scoped authorization matrix and action checks exist:
  - `server/api/allianceRuntime.js`
  - `server/api/routes/alliances.js`
- Invite tokens are stored hashed-at-rest with pepper.
- Privileged alliance actions emit security events.

## Security Design Baseline
- Authorization:
  - Every read/write endpoint must assert `(alliance_id + membership role + action)`.
  - Deny-by-default for unknown alliance context.
- Session trust:
  - Keep session revocation and remember-me controls server-enforced.
- Encryption:
  - TLS mandatory for all traffic.
  - Encrypt sensitive invitation artifacts at rest (token hashes, optional private notes).
  - Rotate encryption keys by documented policy.
- Audit:
  - Immutable audit events for role changes, invites, claims, merges, and deletes.

## Advanced Option Track
- P1: policy tables + middleware checks (simple and sufficient for current scope).
- P2: optional ReBAC engine adapter (OpenFGA/SpiceDB) when policy complexity grows.

## Source-Backed Constraints
- OWASP auth/session/crypto requirements:
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
  https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html
- JWT usage constraints:
  https://datatracker.ietf.org/doc/html/rfc8725
- Row-level isolation option:
  https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- ReBAC future path:
  https://openfga.dev/docs/modeling/getting-started
  https://authzed.com/docs/spicedb/concepts/schema

## Delivery Plan
### P0
- Add alliance authorization middleware contracts and negative tests.
- Add invite/claim action rate limits and abuse guardrails.
- Add structured audit events and retention policy.

### P1
- Add encrypted-secret handling for sensitive collaboration payloads.
- Add anomaly alerts (sudden role churn, repeated failed claims, invite spray).

### P2
- Add ReBAC adapter proof-of-concept behind feature flag.

## Implementation Packet (Security Controls)
- Middleware contract:
  - resolve `active_alliance_id`,
  - verify membership and role,
  - enforce action policy (`read`, `write`, `manage_members`, `moderate_chat`).
- Invite token handling:
  - random high-entropy token,
  - hash-at-rest (`sha256` + app secret pepper),
  - one-time use + expiry.
- Audit stream minimum fields:
  - `actor_user_id`, `alliance_id`, `action`, `target_type`, `target_id`, `ip`, `ua`, `at`.
- Key management policy:
  - active key id, previous key id, rotation window, re-encryption task backlog.

## Verification
- Access-control test matrix passes for all role/action combinations.
- Sensitive endpoints return 403/404 without leaking object existence.
- Audit entries exist for every privileged alliance action.

## KPIs
- AuthZ denial correctness rate.
- Security incident rate for alliance endpoints.
- Mean time to detect suspicious alliance actions.

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
