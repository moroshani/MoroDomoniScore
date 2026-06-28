# Myket KB Research Summary (2026-06-02)

## Scope
- Source seed: `C:\Users\moroshani\Desktop\myket docs.txt`
- Crawl output:
  - `docs/roadmaps/artifacts/myket-kb-crawl-report.json`
  - `docs/roadmaps/artifacts/myket-kb-extract.md`
  - `docs/roadmaps/artifacts/myket-docstxt-structured-extract.json`
  - `docs/roadmaps/artifacts/myket-docstxt-structured-extract.md`

## Coverage Snapshot
- Total referenced Myket/API links processed: 34
- Reachable (`200`) pages/assets: 25
- Non-200 links are mostly templated API examples with placeholder path params (`{packageName}`, `{SKU_ID}`, `{TOKEN}`) and are expected to fail as raw URLs.

## Key Confirmed Findings
1. Myket partner APIs for release/billing are designed for server-to-server usage with `X-Access-Token`.
2. Release lifecycle semantics in Myket KB align with a controlled sequence:
   - release-bundle metadata create/edit
   - artifact upload
   - commit for review
   - optional revert
3. Staged rollout and multi-package publishing are explicit Myket release capabilities and should be part of release planning.
4. Billing paths require backend verify/consume discipline; client-only trust is not sufficient.
5. Security recommendations are treated as mandatory pre-publish review input for release gates.
6. Extracted release-list contract includes status model (`JustCreated`, `WaitingForApproval`, `Rejected`, `Approved`, `RolledBack`) and pagination bounds (`offset > 0`, `limit 1..20`).
7. Extracted API constraints include upload guardrail (`500 MB`) and operational error taxonomy (`400`, `401`, `404`, `500` + message code classes).

## Operational Decisions Applied In Repo
- Myket-only distribution lane remains canonical.
- Architecture and runbook now explicitly document:
  - server-only token handling,
  - release API lifecycle controls,
  - billing verification/consume on backend,
  - direct-download metadata parity checks.
- Compliance checklist now includes API/security gate requirements.

## Follow-Up After Deep Research Report Arrives
- Merge any new policy-level hard constraints into:
  - `docs/roadmaps/12-android-native/iran-markets-release-readiness.md`
  - `android-native/compliance/myket_release_checklist.md`
  - `docs/RUNBOOK.md`
- Add any missing API error taxonomy and retry/idempotency guidance with examples.
