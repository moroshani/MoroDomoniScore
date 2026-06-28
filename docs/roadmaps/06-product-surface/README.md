# 06 Product Surface Roadmap

Last updated: 2026-02-24

## Goal
Maintain full-quality feature coverage across gameplay, history/stats/spectator, and account/settings flows with consistent behavior in web and installed app modes.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial depth in stress/scale scenarios`

Evidence:
- Core route surface:
  - `App.tsx`
- Gameplay and scoring loop:
  - `components/Scoreboard.tsx`
  - `pages/PlayPage.tsx`
- History/stats and spectator:
  - `components/History.tsx`
  - `components/Stats.tsx`
  - `components/SpectatorView.tsx`
- Profile/settings/security:
  - `pages/ProfilePage.tsx`
  - `pages/SettingsPage.tsx`

## Cross-Cutting Constraints
- Feature parity between installed and browser mode.
- No gameplay data corruption under fast interactions.
- User-critical operations should be understandable without support intervention.
- Gameplay rules remain unchanged in this roadmap track.
- Shared-family identity and cross-account stats are handled in:
  - `docs/roadmaps/10-alliance-shared-identity/README.md`

## Priority Tracks
### P0 (must)
- Protect gameplay correctness and session/account safety.
- Preserve real-time spectator reliability.
- Keep profile/settings operational and comprehensible.
- Preserve existing Quick Night and standard flow behavior while alliance/world scopes are introduced.

### P1 (advanced)
- Add heavy-data performance hardening.
- Add richer device/session trust UX.
- Add resilient reconnect and conflict UX for spectator/history.
- Add data portability and user trust-control surfaces.
- Add world/cross-alliance match browsing and chat entry points.

### P2 (frontier)
- Add advanced assistive tooling (power user keyboard and admin diagnostics overlays).
- Add privacy-mode and data transparency controls.

## Mini-Roadmaps
- `docs/roadmaps/06-product-surface/gameplay-and-scoring.md`
- `docs/roadmaps/06-product-surface/history-stats-spectator.md`
- `docs/roadmaps/06-product-surface/profile-settings-and-security.md`
- `docs/roadmaps/06-product-surface/data-portability-and-trust-controls.md`

## Verification Contracts
Use: C2, C3, C4, C5, C8.

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
