# Mini-Roadmap: Transport and Browser Security

Last updated: 2026-02-23

## Problem
Even strong auth logic can be undermined if transport/browser-layer controls are weak or inconsistent.

## Current Implementation Snapshot
Status: `Implemented Wave 1 baseline`

Evidence:
- CORS allowlist and trust-proxy configuration:
  - `server/api/index.js`
- HTTPS domain deployment and SSL checks are part of operations flow:
  - `scripts/deploy_to_aria_vps.sh`
  - `docs/roadmaps/07-devops-release/*`

Wave 1 implementation evidence:
- API header hardening middleware is active in `server/api/index.js`.
- CSP/HSTS/CORS behavior is now validated by domain synthetic probes.

## Source-Backed Constraints
### Must
- HTTPS policy and transport strictness should be explicit.
  Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
- CSP should be progressively hardened from report-only to enforced policy.
  Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

### Should
- CORS should be explicit allowlist and auditable.
  Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

### Could
- Evaluate secure cookie-based session transport mode as alternate architecture.
  Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie

## Delivery Plan
### P0
- Keep strict HTTPS-only domain baseline.
- Verify HSTS/CSP headers are present and correct at edge.
- Keep CORS allowlist and no wildcard fallback.

### P1
- Add hardened header policy template in Nginx runbook.
- Add report-only CSP rollout and violation collection.

### P2
- Optional cookie transport architecture study vs bearer storage model.
- Add SRI and stricter third-party resource controls.

## Verification
- Header checks for HSTS, CSP, and CORS behavior on production domain.
- No mixed-content warnings.
- Auth/session flows remain functional after hardening.

## KPIs
- Security header compliance score.
- Browser console security warnings per release.

## Expansion Round 2 (2026-02-23)
- Add Fetch-Metadata policy evaluation for CSRF-style cross-site request reduction.
- Add Permissions-Policy review for least-privilege browser API exposure.
- Add report-only security header rollout checklist before strict enforcement.
- Add header baseline snapshot artifact to deploy verification outputs.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 1
- Dependencies locked: Wave 0 governance; DB session tables and revocation contracts
- Required feature flags: auth_session_v2, remember_me_ui_v1, passkey_fallback_v1
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
- Exit artifact required: Auth/session security verification report with revocation and fallback coverage


## Scope
This roadmap item defines execution boundaries and delivery policy for auth session security.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
