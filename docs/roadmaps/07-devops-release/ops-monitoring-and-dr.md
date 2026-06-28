# Mini-Roadmap: Monitoring and Disaster Recovery

Last updated: 2026-02-23

## Problem
Without measurable SLOs, alerts, and restore drills, teams discover reliability gaps only during incidents.

## Current Implementation Snapshot
Status: `Implemented Wave 1 baseline`

Evidence:
- API health endpoint exists:
  - `server/api/index.js`
- Basic service status checks are used during deploy.
- Project log captures incident/deploy outcomes.

Wave 1 implementation evidence:
- Synthetic probe script for critical routes and header checks: `scripts/ops/synthetic_probe.sh`.
- Backup + restore verification drill script: `scripts/ops/dr_backup_verify.sh`.
- Local vs VPS parity automation for release checks: `scripts/ops/local_vs_vps_parity.sh`.

## Source-Backed Constraints
- Recovery must be tested, not assumed.
  Source: PostgreSQL backup docs (backup, pg_dump, PITR)
- Reverse proxy and service checks should be codified.
  Source: NGINX admin guide

## Delivery Plan
### P0
- Define SLOs for API availability, auth latency, and spectator reliability.
- Define critical alert thresholds and on-call responses.

### P1
- Add synthetic probes for key routes/assets.
- Add structured logging retention and searchable incident timeline.
- Add nightly backup plus weekly restore verification.

### P2
- Add chaos-lite drills (service restart, DB failover rehearsal).
- Add resilience scorecard in release reports.

## Verification
- SLO dashboards available.
- Synthetic alerts validated through test incidents.
- Restore drill documented with measured RTO/RPO.

## KPIs
- Availability SLO attainment.
- Mean time to detect (MTTD).
- Restore success rate and duration.

## Expansion Round 2 (2026-02-23)
- Add incident classification playbook (sev0..sev3) with response timelines.
- Add synthetic checks for install/update/offline critical journeys.
- Add recovery drill scoring sheet (time, data integrity, communication quality).
- Add "silent degradation" detection strategy using trend anomalies.

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
