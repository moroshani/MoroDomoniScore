# Roadmap Registry Contract

Last updated: 2026-02-23

## Purpose
Keep the hierarchical roadmap system scalable by treating each roadmap and mini-roadmap as a governed artifact with ownership, status, and verification state.

## Required Metadata for Every Roadmap File
- `title`
- `last updated`
- `scope`
- `current implementation snapshot`
- `priority tiers (P0/P1/P2)`
- `verification contract references`
- `risk and rollback summary`

## Required Operational Metadata (per run)
- Owner (human or role).
- Execution status (`planned`, `in-progress`, `blocked`, `done`, `deprecated`).
- Last verification run date.
- Next review date.

## Registry Model (Recommended)
Maintain a machine-readable registry file with entries:
- `id`: stable slug (`02-pwa/install-ios`)
- `path`: markdown file path
- `owner`
- `status`
- `risk_level`
- `last_reviewed_utc`
- `next_review_utc`
- `contracts`: `[C1,C3,C4,...]`

## Drift Detection Rules
A roadmap is considered stale if:
- implementation changed in covered files but roadmap not updated,
- last review exceeds defined review window,
- linked sources are no longer valid or contradict current behavior.

## Review Windows
- Security/auth/session: every 30 days.
- PWA/browser/platform behavior: every 45 days.
- UX/responsive/accessibility: every 45 days.
- Performance/reliability: every 30 days.
- Strategy topics: every 60 days.

## Failure Policy
If registry or metadata contract is violated:
- feature cannot be marked complete,
- release gate G2 is blocked until corrected,
- blocking issue is logged in `docs/PROJECT_LOG.md`.

## Tooling Roadmap
### P0
- Keep metadata sections consistent in all roadmap files.
- Enforce metadata consistency with `scripts/roadmap/check-metadata.mjs`.

### P1
- Keep `docs/roadmaps/registry.json` up to date using:
  - `scripts/roadmap/generate-registry.mjs`
  - `scripts/roadmap/check-registry.mjs`
- Generate governance signoff artifacts via:
  - `scripts/roadmap/run-wave0.mjs`
  - `docs/roadmaps/artifacts/wave0-gate-status.json`
  - `docs/roadmaps/artifacts/wave0-governance-signoff.md`

### P2
- Enforce Wave 0 governance in CI:
  - `.github/workflows/roadmap-wave0.yml`
- Add future extension for stale-review escalation notifications.
