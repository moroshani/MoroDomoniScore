# Mini-Roadmap: Deployment and Rollback

Last updated: 2026-02-23

## Problem
Deployment failures and false-negative checks can block releases or hide real incidents.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Wave 1 robust preflight/rollback automation complete`

Evidence:
- Release path build and promotion flow:
  - `scripts/deploy_to_aria_vps.sh`
- Domain-based smoke checks:
  - `scripts/deploy_to_aria_vps.sh`

## Source-Backed Constraints
- Progressive rollout and canarying reduce blast radius.
  Source: https://sre.google/sre-book/reliable-product-launches/#canarying-releases

## Gap Matrix
- Implemented:
  - Release-path deploy and promote.
  - Basic service restart and smoke checks.
- Missing:
  - No Wave 1 gap remains in this item; canary policy remains optional P2.

## Delivery Plan
### P0
- Keep deploy scripts free of invalid flags and local-only assumptions.
- Ensure smoke checks use live domain URLs.

### P1
- Add deploy preflight command:
  - env key validation,
  - service name existence,
  - disk and DB connectivity checks.
- Add rollback command and runbook rehearsal.

### P2
- Add canary window before full traffic confidence.
- Add automatic deploy diff report (files/routes/config).

## Verification
- Clean deploy from local source to VPS passes end to end.
- Rollback drill restores prior release within target time.
- Post-deploy smoke and parity checks pass.

## KPIs
- Deploy success rate.
- Mean time to recovery (MTTR).
- False-negative deploy check rate.

## Expansion Round 2 (2026-02-23)
- Add two-phase smoke checks (direct upstream + public domain edge).
- Add deploy transaction log format for forensic review.
- Add "known-bad signature" guardrails to block repeating previous script failures.
- Add rollback confidence drills to quarterly operations plan.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 1
- Dependencies locked: Wave 0 governance and production inventory
- Required feature flags: deploy_gate_v2, rollback_guard_v1
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
- Exit artifact required: Runbook-verified deploy + rollback drill transcript


## Scope
This roadmap item defines execution boundaries and delivery policy for devops release.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
