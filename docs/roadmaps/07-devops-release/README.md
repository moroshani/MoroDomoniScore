# 07 DevOps and Release Roadmap

Last updated: 2026-02-24

## Goal
Make deployment repeatable, diagnosable, and safely reversible for `dominoyar.ir` and related app subdomains.

## Cross-Program Requirement
- Rollout must remain zero-downtime for existing users.
- Login/register and Quick Night must stay available through schema and API transitions.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Wave 1 automation complete`

Evidence:
- Deployment script and release-path promotion:
  - `scripts/deploy_to_aria_vps.sh`
- Domain-targeted smoke checks in deploy flow:
  - `scripts/deploy_to_aria_vps.sh`
- Production service naming and operations history:
  - `docs/PROJECT_LOG.md`
- VPS preflight and environment contract checks:
  - `scripts/ops/preflight_vps.sh`
  - `scripts/ops/validate_env_contract.mjs`
- Rollback, parity, TLS/DNS audit, synthetic probes, and DR verification:
  - `scripts/ops/rollback_last_release.sh`
  - `scripts/ops/local_vs_vps_parity.sh`
  - `scripts/ops/domain_tls_audit.sh`
  - `scripts/ops/synthetic_probe.sh`
  - `scripts/ops/dr_backup_verify.sh`

## Known Operational Lessons
- Hardcoded localhost assumptions caused false negatives in past scripts.
- Invalid Prisma CLI flags (`--no-hints`) caused deterministic failures.
- Domain-based checks are mandatory; diagnostics must print root causes directly.

## Priority Tracks
### P0 (must)
- Keep release-path deploy + promotion + smoke checks stable.
- Keep domain/SSL checks integrated.
- Keep rollback path explicit.
- Add expand/contract migration discipline for alliance/world schema changes.

### P1 (advanced)
- Add cert expiry alerting and DNS audit automation.
- Add deploy preflight validator (env/service/domain matrix).
- Add structured post-deploy parity report generation.
- Add environment/secret governance and rotation controls.
- Add websocket/sync backplane preflight checks for realtime alliance/chat traffic.

### P2 (frontier)
- Introduce canary-style rollout policy for high-risk releases.
- Add continuous synthetic monitoring across route clusters.
- Add deployment scorecard with reliability trend tracking.

## Mini-Roadmaps
- `docs/roadmaps/07-devops-release/deployment-and-rollback.md`
- `docs/roadmaps/07-devops-release/domain-ssl-and-email.md`
- `docs/roadmaps/07-devops-release/ops-monitoring-and-dr.md`
- `docs/roadmaps/07-devops-release/environment-and-secret-governance.md`

## Verification Contracts
Use: C1, C2, C6, C7, C8.

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
