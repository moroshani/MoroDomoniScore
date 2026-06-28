# Mini-Roadmap: Network Delivery and Edge Optimization

Last updated: 2026-02-23

## Problem
Network and edge configuration strongly affects first-load speed, cache correctness, and perceived reliability.

## Current Implementation Snapshot
Status: `Partial`

Evidence:
- API compression enabled.
- Service worker caching implemented.

Missing:
- No explicit Brotli/HTTP protocol strategy documentation.
- No edge cache policy matrix by asset class.

## Source-Backed Constraints
### Must
- Reverse proxy behavior and cache strategy should be explicitly governed.
  Source: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/
  Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control

### Should
- Use modern TLS and transport tuning guidance.
  Source: https://ssl-config.mozilla.org/

### Could
- Explore HTTP/3 rollout where environment supports safe adoption.

## Delivery Plan
### P0
- Document edge cache matrix: HTML, assets, SW, manifest, API.
- Ensure SW/manifest no-stale pitfalls are covered in deployment checks.

### P1
- Add Brotli + gzip strategy validation.
- Add TTFB and edge cache hit monitoring.

### P2
- Evaluate CDN edge strategy with strict cache invalidation controls.
- Evaluate HTTP/3 for latency-sensitive regions.

## Verification
- Header checks match cache matrix expectations.
- SW/manifest update behavior remains deterministic after edge tuning.

## KPI
- TTFB p75.
- Static asset cache hit ratio.
- Cold-load and repeat-load delta.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 6
- Dependencies locked: Waves 2-5 landed behind flags; telemetry schema frozen
- Required feature flags: perf_budget_enforced_v1, observability_slo_v1
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
- Exit artifact required: CWV/SLO baseline vs post-change benchmark and regression gates


## Scope
This roadmap item defines execution boundaries and delivery policy for performance reliability.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
