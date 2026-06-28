# Mini-Roadmap: Research and Experiments Backlog

Last updated: 2026-02-23

## Goal
Run high-value experiments in a controlled way, with clear hypotheses, success metrics, and rollback criteria.

## Experiment Governance
Each experiment must define:
- hypothesis,
- measurable success metric,
- exposure scope,
- rollback trigger,
- owner and end date.

## Research Streams
### UX and Interface
- Adaptive header density by context.
- Faster score-entry modes (desktop keyboard profile).
- Improved contextual hints and first-run guidance.

### Security
- Session anomaly scoring model.
- Optional step-up verification for destructive actions.
- Account recovery and support audit instrumentation.

### Performance
- Predictive route prefetch with safeguard thresholds.
- Fine-grained chunking and asset budget control.
- Low-end device adaptive rendering strategy.

### Reliability and Ops
- Synthetic monitoring per route cluster.
- Local-vs-VPS automated parity snapshots.
- Canary-aware deployment scoring.

### PWA and Cross-Platform
- Install funnel optimization per platform.
- Update messaging variants by criticality.
- Offline behavior diagnostics and self-heal guidance.

## Source-Backed Inputs
- PWA lifecycle and detection docs (MDN/web.dev).
- CWV optimization guides (web.dev).
- Security guidance (OWASP + RFC 8725).
- SRE canarying practices.

## Verification
- Experiments run behind flags where risk exists.
- Metrics collected before decision.
- Failed experiments are removed cleanly with notes.

## KPI Framework
- User success metrics (completion time, failure rate).
- Reliability metrics (error rate, reconnection success).
- Security metrics (blocked abuse, safe action success).
- Performance metrics (CWV and route interaction latency).

## Expansion Round 2 (2026-02-23)
- Add experiment template library (hypothesis, success criteria, risk budget).
- Add experiment debt cleanup policy for stale flags and abandoned paths.
- Add cross-topic experiment map linking UX, security, performance, and ops impacts.
- Add quarterly experiment review report format with decision outcomes.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 8
- Dependencies locked: All mandatory production waves (0-7) stable
- Required feature flags: strategy_track_gate_v1
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
- Exit artifact required: Strategy track charter with stop-loss and KPI thresholds


## Scope
This roadmap item defines execution boundaries and delivery policy for strategy future.

## Current Snapshot
Status: `Documented`

Evidence:
- Current behavior is described in this file and linked roadmap artifacts.

## Priority Tiers
### P0
- Deliver mandatory contract and non-regression outcomes for this scope.

### P1
- Deliver advanced reliability and automation improvements for this scope.

### P2
- Deliver frontier optimization once P0/P1 are stable.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
