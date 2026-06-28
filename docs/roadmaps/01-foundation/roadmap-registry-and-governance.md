# Mini-Roadmap: Registry and Governance

Last updated: 2026-02-23

## Problem
As roadmap depth grows, execution can drift unless ownership, status, and verification state are explicit and automatable.

## Current Snapshot
Status: `Implemented baseline`, `Operational`

Evidence:
- Hierarchical files and contracts exist.
- Machine-readable registry exists: `docs/roadmaps/registry.json`.
- Governance scripts exist:
  - `scripts/roadmap/normalize-metadata.mjs`
  - `scripts/roadmap/generate-registry.mjs`
  - `scripts/roadmap/check-registry.mjs`
  - `scripts/roadmap/check-metadata.mjs`
  - `scripts/roadmap/check-index.mjs`
  - `scripts/roadmap/run-wave0.mjs`
- Governance artifacts generated:
  - `docs/roadmaps/artifacts/wave0-gate-status.json`
  - `docs/roadmaps/artifacts/wave0-governance-signoff.md`
- CI workflow enforces Wave 0:
  - `.github/workflows/roadmap-wave0.yml`

## Source-Backed Constraints
### Must
- Governance should be auditable and repeatable in release management.
  Source: SRE release governance and change safety principles.

### Should
- Quality gates should be represented as executable checks.

### Could
- Move roadmap status into dashboard views for at-a-glance decisions.

## Delivery Plan
### P0
- Enforce mandatory metadata sections in every roadmap file.
- Reference `docs/roadmaps/contracts/roadmap-registry-contract.md` in all topic indexes.

### P1
- Keep machine-readable registry + verifier script healthy.
- Keep stale roadmap detection active (review window policy).

### P2
- Add escalation workflow for stale items (notification + owner assignment).

## Verification
- Every roadmap file includes required metadata.
- Registry validation script passes.
- Stale-roadmap alerts generated for overdue topics.
- Wave 0 governance runner passes end-to-end.

## KPI
- Governance compliance rate.
- Percentage of roadmap items with current verification status.

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

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
