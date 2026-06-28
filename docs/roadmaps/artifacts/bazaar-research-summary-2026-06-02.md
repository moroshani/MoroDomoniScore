# Cafe Bazaar Research Summary (2026-06-02)

## Can we publish on Myket + Cafe Bazaar at the same time?
- Based on publicly accessible developer docs/pages reviewed on 2026-06-02, no explicit blanket exclusivity clause was found that forbids publishing the same Android app in both Myket and Cafe Bazaar.
- Practical conclusion: simultaneous multi-store publishing appears feasible.
- Risk note: contractual terms in signed agreements/panel-specific legal pages can change and may include app-specific constraints; final legal check must be done in each active developer panel before release.

## Sources Reviewed
- Cafe Bazaar developer portal root: `https://developers.cafebazaar.ir/`
- Cafe Bazaar publish rules page: `https://developers.cafebazaar.ir/fa/app-publish-guidelines-fa/`
- Cafe Bazaar WordPress API root (for discoverable docs index): `https://developers.cafebazaar.ir/wp-json/`
- Myket developer panel root: `https://developer.myket.ir/`
- Myket KB release API page: `https://myket.ir/kb/pages/developer-cd/`
- Myket KB publish rules/archive page: `https://myket.ir/kb/topics/myket-app-publishing-rules-fa/`

## Bazaar Android Dev/Release Findings (parallel to Myket-style research)

### 1) Packaging and Delivery
- App Bundle (`.aab`) support is documented in Bazaar content.
- Multi-package / device-targeted publishing is documented (`بارگذاری چند بسته در یک رهانش`).
- Expansion file model (`OBB`) is documented with a stated APK size threshold context (`150MB` in Bazaar content references).

### 2) Rollout and Updates
- Staged rollout capability is documented (`What is staged rollout?`).
- Auto-update behavior has Bazaar-side operational notes (news/feature docs).

### 3) Web-to-Android Path
- TWA publishing guidance exists for Bazaar (`trusted-web-application` pages in FA/EN).

### 4) Billing / Monetization Surface
- Bazaar docs/news include in-app billing and subscription-related feature references.
- Operational/payment processing notes (e.g., Shaparak fee communication) are present and should be tracked in financial release runbooks.

### 5) Security/Quality Signals
- Bazaar communication includes malware scan/security signal exposure to end users.
- This implies release readiness should include malware/security sanity checks before submission.

## Operational Recommendation
- Keep dual-store lane as:
  1. build once (signed release candidate),
  2. per-store metadata/policy checklist validation,
  3. staged rollout where possible,
  4. post-release monitoring per store channel,
  5. direct-download fallback metadata parity with release notes.

## Artifacts Produced For Traceability
- `docs/roadmaps/artifacts/bazaar-research-selected-posts.json`
- `docs/roadmaps/artifacts/bazaar-wp-posts-index.json`
- `docs/roadmaps/artifacts/bazaar-wp-categories.json`
- `docs/roadmaps/artifacts/myket-kb-crawl-report.json`
- `docs/roadmaps/artifacts/myket-docstxt-structured-extract.json`

## Important Limitation
- Some legal/policy content on both ecosystems can be JS-rendered, account-gated, or updated without notice.
- Treat this summary as engineering/compliance baseline, then run a final manual legal confirmation in both developer panels immediately before production release.
