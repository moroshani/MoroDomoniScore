# Research Protocol

Last updated: 2026-02-24

## Purpose
Guarantee that roadmap decisions are evidence-backed, implementation-aware, and reversible.

## Mandatory Rules
1. Use primary sources first:
- standards bodies (W3C, IETF),
- browser/platform docs (MDN, web.dev, WebKit, Apple, Chromium),
- security authorities (OWASP),
2. For every mini-roadmap:
- include current implementation snapshot,
- include source-backed constraints,
- include baseline vs advanced vs frontier options,
- include verification and rollback plans.
3. Tag every source claim with a URL and verification date.
4. Differentiate:
- `Must` (required by standards/security/reliability),
- `Should` (recommended high-value improvements),
- `Could` (strategic or experimental enhancements).
5. Any production-impact decision must include:
- blast radius,
- fallback behavior,
- rollback trigger.
5.1 Continuity for existing users is mandatory:
- login/register remains available,
- quick-night remains available,
- offline local scoring continuity is preserved.
6. Research must include implemented features, not only planned features.
7. For each mini-roadmap, compare at least one existing code path and one external primary source before proposing changes.
8. Collaboration and realtime features must include abuse/moderation and privacy impact analysis.

## Implementation Comparison Method
1. Identify relevant code files via `rg` and direct file inspection.
2. Record exact evidence paths in roadmap (`path + behavior`).
3. Classify each feature as:
- `Implemented`,
- `Partial`,
- `Missing`.
4. Map gaps to actionable work items with verifiable outcomes.

## Research Output Template (Required)
- Problem statement.
- Current implementation snapshot.
- Source-backed constraints (`Must/Should/Could`).
- Proposed architecture options (baseline/advanced/frontier).
- Delivery plan by phase (`P0/P1/P2`).
- Verification plan.
- Risk and rollback plan.
- KPI targets.

## Quality Bar for "Best/Most Advanced" Recommendations
A recommendation qualifies only if:
- it has measurable improvement goals,
- it does not reduce reliability/security,
- migration complexity is understood,
- there is a practical rollout path.

## Recency Policy
- Time-sensitive items (browser support, ecosystem/tooling behavior, TLS guidance) must be rechecked at each major release cycle.
- Stable standards (RFCs/WCAG core principles) can be referenced long-term but still reviewed annually.
- Any source older than 18 months for fast-moving topics should be cross-checked with a newer official source when available.
