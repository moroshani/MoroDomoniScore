# Mini-Roadmap: Environment and Secret Governance

Last updated: 2026-02-23

## Problem
Deployment stability depends on accurate environment variables and strict secret hygiene.

## Current Implementation Snapshot
Status: `Implemented Wave 1 baseline`

Evidence:
- Deploy script carries immortal credentials and release operations.
- `.env` propagation is handled during release promotion.

Wave 1 implementation evidence:
- Env contract validator implemented: `scripts/ops/validate_env_contract.mjs`.
- VPS preflight enforces mandatory key presence and SMTP all-or-none policy: `scripts/ops/preflight_vps.sh`.
- Deploy script no longer carries hardcoded immortal credentials: `scripts/deploy_to_aria_vps.sh`.

## Source-Backed Constraints
### Must
- Secrets should never be exposed in logs/artifacts.
- Environment drift must be checked pre-deploy.

### Should
- Use least-privilege and rotation policy for operational credentials.

### Could
- Adopt managed secret store and dynamic injection.

## Delivery Plan
### P0
- Add preflight env validator and mandatory-key checklist.
- Add log-sanitization policy for deploy outputs.

### P1
- Add secret rotation schedule and incident rotation runbook.
- Add role-separated deploy credentials.

### P2
- Integrate centralized secret management service.
- Add automated drift detection for environment contracts.

## Verification
- Preflight fails fast on missing required env keys.
- Deploy logs contain no sensitive values.

## KPI
- Secret-related deployment incident count.
- Environment drift detection lead time.

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
