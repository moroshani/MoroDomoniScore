# Release Gates

Last updated: 2026-02-24

Release gates map roadmap execution to clear go/no-go decisions.

## G0: Research Gate
### Entry
- Mini-roadmap draft exists.
- Current implementation snapshot is documented.

### Exit
- Primary sources are attached.
- Baseline/advanced/frontier options defined.
- Risks and rollback declared.

## G1: Design Gate
### Entry
- Research gate passed.

### Exit
- Proposed implementation reviewed against contracts C1-C11.
- Acceptance criteria and KPI targets finalized.
- Data migration and API compatibility risks reviewed.
- Continuity constraints reviewed (login/register + Quick Night + offline local scoring).

## G2: Build Gate
### Entry
- Feature work completed locally.

### Exit
- Build/schema/auth/session/PWA checks pass locally.
- Responsive and accessibility baseline checks pass.
- Docs updated (topic + mini-roadmap + project log).
- Scope-classification checks pass for standard outside-alliance matches.

## G3: Pre-Deploy Gate
### Entry
- G2 passed.

### Exit
- Deploy package and release path validated.
- Service names, environment keys, and smoke URLs confirmed.
- Rollback command path validated.
- Expand/contract migration path confirmed (no destructive schema cutover in same deploy).

## G4: Post-Deploy Gate
### Entry
- Deployment executed.

### Exit
- Domain-based smoke checks pass.
- Local vs VPS parity report passes.
- SSL/TLS and core route checks pass.

## G5: Stabilization Gate
### Entry
- G4 passed.

### Exit
- 24h incident window reviewed.
- Error rates and performance KPIs within threshold.
- Any regression has either been fixed or tracked with due date.
- Continuity regressions are absent (auth, quick night, offline local capability).

## G6: Roadmap Governance Gate
### Entry
- G5 passed.

### Exit
- Roadmap artifacts for changed scopes are updated.
- Registry contract checks pass.
- Next review dates are set for touched roadmap topics.

## Emergency Rollback Trigger
Rollback immediately if any of the following occur:
- auth/session breakage that blocks user access,
- scoring integrity issues,
- PWA update loop or forced refresh regression,
- severe UI break on core mobile widths,
- high-severity security defect.
- login/register or quick-night regression,
- scope misclassification (outside-alliance standard games incorrectly coerced to quick-night).
