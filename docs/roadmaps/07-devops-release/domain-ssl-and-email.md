# Mini-Roadmap: Domain, SSL, Email Endpoints

Last updated: 2026-02-23

## Problem
As subdomains and services expand, certificate, DNS, and mail authentication drift can create outages or deliverability problems.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Wave 1 TLS/DNS audit automation complete`

Evidence:
- Active production domain baseline:
  - `dominoyar.ir`
- Dedicated app-adjacent subdomain plan:
  - `smtp.dominoyar.ir`
- SSL checks integrated in deployment and run logs.

## Source-Backed Constraints
### Must
- TLS should follow modern hardened configs.
  Source: https://ssl-config.mozilla.org/
  Source: https://letsencrypt.org/docs/

### Should
- Mail auth should include SPF, DKIM, DMARC.
  Source: https://datatracker.ietf.org/doc/html/rfc7208
  Source: https://datatracker.ietf.org/doc/html/rfc6376
  Source: https://datatracker.ietf.org/doc/html/rfc7489

### Could
- Add MTA-STS and TLS-RPT for stronger transport visibility.
  Source: https://datatracker.ietf.org/doc/html/rfc8461
  Source: https://datatracker.ietf.org/doc/html/rfc8460

## Gap Matrix
- Implemented:
  - Domain and TLS baseline for app domain.
- Wave 1 implementation evidence:
  - TLS/DNS audit script: `scripts/ops/domain_tls_audit.sh`.
  - Domain synthetic checks in deploy gate: `scripts/ops/synthetic_probe.sh`.
  - SMTP config governance in preflight/env contracts.

## Delivery Plan
### P0
- Keep domain-only deploy verification.
- Keep SSL validity checks for all active app subdomains.

### P1
- Add automated weekly TLS and DNS audit job.
- Add mail auth validation checklist and monitor.

### P2
- Add MTA-STS/TLS-RPT deployment and reporting.
- Add DNS change control log and drift detection.

## Verification
- HTTPS check returns valid cert and chain for app domain and active subdomains.
- SMTP subdomain records validate SPF/DKIM/DMARC policy.

## KPIs
- TLS expiry incidents.
- Email deliverability failure rate.
- DNS drift incidents.

## Expansion Round 2 (2026-02-23)
- Add subdomain certificate ownership matrix and renewal cadence.
- Add DNS propagation verification checklist for major record changes.
- Add mail reputation and bounce monitoring strategy.
- Add periodic DMARC aggregate report review process.

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
