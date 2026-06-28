# 01 Foundation Roadmap

Last updated: 2026-02-23

## Goal
Create a durable planning and verification backbone so every feature roadmap is executable, testable, and auditable.

## Current Implementation Baseline
Status: `Implemented (core and automation)`

Evidence:
- Contract files exist:
  - `docs/roadmaps/contracts/verification-contracts.md`
  - `docs/roadmaps/contracts/research-protocol.md`
  - `docs/roadmaps/contracts/release-gates.md`
- Hierarchical roadmap index exists:
  - `docs/roadmaps/README.md`
  - `docs/ROADMAP.md`

Gaps:
- No open Wave 0 gaps in governance automation baseline.

## Strategic Tracks
### P0 (must)
- Keep contracts and mini-roadmaps synchronized with implementation changes.
- Enforce run-start/run-end logging discipline.
- Enforce roadmap metadata and ownership hygiene.

### P1 (advanced)
- Keep scriptable contract runner (`build + prisma + governance checks`) healthy and deterministic.
- Keep gate status matrix exported to docs artifact.
- Keep machine-readable roadmap registry current.

### P2 (frontier)
- Add policy-as-code style contract checks for merge blocking.
- Add automated roadmap freshness alerts when implementation drifts.
- Add roadmap dependency graph generation for cross-topic coordination.

## Mini-Roadmap Dependencies
- `docs/roadmaps/contracts/verification-contracts.md`
- `docs/roadmaps/contracts/research-protocol.md`
- `docs/roadmaps/contracts/release-gates.md`
- `docs/roadmaps/contracts/roadmap-registry-contract.md`
- `docs/roadmaps/01-foundation/roadmap-registry-and-governance.md`

## Done Criteria
- Every roadmap item has implementation evidence and verification plan.
- No release is marked complete without gate evidence.
- Legacy monolithic roadmap remains archival-only.
- Wave 0 runner and CI gate remain green.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 0
- Dependencies locked: Contracts C1-C11 and release gates G0-G6 accepted
- Required feature flags: No runtime feature flag; governance gate only
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
- Exit artifact required: Approved governance checklist and signed contract review


## Scope
This roadmap item defines execution boundaries and delivery policy for foundation.

## Verification
- Validate implementation against contracts and release gates before marking complete.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
