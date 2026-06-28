# Mini-Roadmap: History, Stats, Spectator

Last updated: 2026-02-26

## Problem
Read-heavy routes and live spectator streams can degrade under larger data volumes and unstable networks.

## Current Implementation Snapshot
Status: `Implemented baseline + teamup/household matchup analytics + teamup snapshot materialization`, `Partial large-scale optimization`

Evidence:
- History and stats components:
  - `components/History.tsx`
  - `components/Stats.tsx`
- Teamup matchup analytics endpoints and filters:
  - `server/api/routes/alliances.js`
  - `lib/alliance.ts`
- Teamup snapshot refresh/runtime:
  - `server/api/teamupSnapshots.js`
  - `server/api/routes/history.js`
- Pull-to-refresh utility:
  - `hooks/usePullToRefresh.ts`
- Spectator view and QR sharing:
  - `components/SpectatorView.tsx`
  - `components/GuestShareModal.tsx`
- Sync server runtime:
  - `server/sync-server.js`

## Gap Matrix
- Implemented:
  - Pull-to-refresh behavior in read routes.
  - Real-time spectator sharing and session-based links.
  - Teamup leaderboard plus 2v2 pair-vs-pair matchup table.
  - Household-vs-household matchup table with scope/projection/household filters.
- Missing:
  - Large-history virtualization strategy.
  - Spectator reconnect diagnostics and backoff UX.
  - Structured fallback when sync channel is unstable.

## Source-Backed Considerations
- Real-time UX should fail gracefully and recover predictably.
- WebSocket behavior and state transitions need explicit reconnect strategy.
  Source: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- Performance patterns should avoid heavy rendering on long lists.
  Source: https://web.dev/articles/vitals
  Source: https://web.dev/articles/optimize-inp

## Delivery Plan
### P0
- Keep current real-time updates and history/stats correctness.
- Ensure clear empty/error states.

### P1
- Add reconnect/backoff with user-readable status.
- Add list virtualization/pagination for large history datasets.
- Add scope-aware history/stats filters aligned with alliance/world model.

### P2
- Add spectator QoS indicators (latency, connection health).
- Add incremental sync optimization for large state payloads.

## Verification
- Spectator receives updates after reconnect events.
- History/stats remain responsive with large datasets.
- Empty/error states are consistent and localized.

## KPIs
- Spectator reconnect success rate.
- History route render time on large datasets.
- Support incidents for spectator desync.

## Expansion Round 2 (2026-02-23)
- Add history archiving strategy for very large accounts.
- Add spectator latency indicator and reconnect attempt counter.
- Add stats rendering optimization roadmap (memoization + virtualization thresholds).
- Add consistency checks between history records and derived stats aggregates.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 4
- Dependencies locked: Wave 2 identity model and Wave 3 realtime contracts
- Required feature flags: profile_settings_v2, scoring_entry_ux_v2, history_scope_filters_v1
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
- Exit artifact required: Product surface acceptance report (web + PWA, all supported sizes)


## Scope
This roadmap item defines execution boundaries and delivery policy for product surface.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
