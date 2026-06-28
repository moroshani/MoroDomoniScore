# Iran Markets Release Readiness

Last updated: 2026-06-02
Status: active, execution-oriented

## Purpose
Define a strict release lane so the Android app can be published in:
- Myket
- optionally Cafe Bazaar (dual-store lane)

with minimal late-stage rework and maximum compliance.

## Official Source Baseline
- Myket developer portal: `https://developer.myket.ir/`
- Myket release API overview (knowledge center): `https://myket.ir/kb/pages/developer-cd/`
- Myket staged rollout guidance: `https://myket.ir/kb/pages/version-rollout/`
- Myket multi-package release guidance: `https://myket.ir/kb/pages/publish_multiple_apk/`
- Myket in-app update guidance: `https://myket.ir/kb/pages/in-app-update/`
- Myket security recommendations: `https://myket.ir/kb/pages/security-recommendations/`
- Android app quality and compatibility guidance:
  - `https://developer.android.com/topic/quality`
  - `https://developer.android.com/google/play/requirements/target-sdk`
- Cafe Bazaar source baseline for dual-store lane:
  - `https://developers.cafebazaar.ir/`
  - `https://developers.cafebazaar.ir/fa/app-publish-guidelines-fa/`

Note:
- Myket policy pages may be partially JS-rendered or login-gated from headless environments.
- Final pre-publish gate must include manual verification in the official Myket developer panel.

## Release Channels (User Access)
1. Store channel (primary): Myket listing (default), optional parallel Cafe Bazaar listing.
2. Web channel (support): stable web + PWA.
3. Direct channel (controlled): signed APK/AAB for pilot/QA and emergency fallback.

## Build Mirror Policy
- Preferred Android mirror: `https://maven.myket.ir/`
- Required usage in this project:
  - `settings.gradle.kts` plugin and dependency repositories point to Myket mirror.
  - `gradle-wrapper.properties` distribution URL points to Myket Gradle distribution mirror.
- Rationale:
  - stable in-Iran access
  - reduced dependency fetch failures in restricted networks
  - repeatable Myket release lane builds

## Hard Requirements

### 1) Package, Signing, Version Discipline
- Freeze `applicationId` early and never rename after public release.
- Keep strict monotonically increasing `versionCode`.
- Use stable semantic `versionName` policy.
- Keep signing key continuity and secure backup policy.

### 2) Manifest & Permissions Minimalism
- INTERNET only by default unless a feature requires more.
- No sensitive permission without a user-visible feature and policy justification.
- Permission-to-feature mapping must be documented before submission.

### 3) Privacy & Legal Assets
- Public privacy policy URL required before store submission.
- In-app privacy summary must match store metadata.
- No misleading data collection claims.

### 4) Runtime Independence
- No blocked/unstable third-party runtime dependencies.
- Bundle required assets locally where possible.
- Ensure graceful degradation under unstable network conditions.

### 5) Device Compatibility
- API strategy: maintain broad support while meeting latest target SDK requirements.
- RTL-first Persian UX on all key screens.
- Low-memory, low-CPU behavior validated on budget devices.
- Multiple density/size checks: small phones, large phones, tablets.

### 6) Update-Safe Persistence
- Room migrations only (no destructive production migration).
- Upgrade path tests from N-1 build to current build.
- Offline quick-game continuity preserved across app updates.

### 7) Store Metadata Quality
- Persian-first title/description/screenshots.
- Clear feature claims only for shipped features.
- Accurate support contact, app category, and content declarations.

### 8) Myket API Security Model
- All Myket partner APIs are server-to-server only in this project.
- `X-Access-Token` is stored and rotated as a backend secret; never shipped to client/app bundle.
- Billing verification and consume operations are backend-only and must not rely on client-side purchase trust.

### 9) Release API Flow Discipline
- Release API lifecycle order must be explicit:
  1. create/edit release-bundle metadata,
  2. upload artifact,
  3. commit for review,
  4. optional revert/rollback action when needed.
- Track API failure classes (`400`, `401`) in release logs and block promotion on unresolved errors.
- Keep staged rollout percentage documented per release and aligned with incident response posture.
- Release status handling must support:
  - `JustCreated`
  - `WaitingForApproval`
  - `Rejected`
  - `Approved`
  - `RolledBack`
- Release listing pagination rules:
  - `offset > 0`
  - `limit` in range `1..20`

### 10) Upload & Artifact Constraints
- Enforce artifact size checks before API upload attempts; if artifact exceeds API path limits, use panel/manual upload fallback.
- Keep direct-download fallback artifact and Myket release notes aligned by version/date/hash metadata.
- Upload API guardrail from source docs corpus: payload over `500 MB` is routed to manual/panel upload fallback.

### 11) API Error Taxonomy Baseline
- HTTP-level classes to treat as gate blockers: `400`, `401`, `404`, `500`.
- Message-code classes to classify in release logs and incident triage:
  - `MissingRequiredData`
  - `UploadReleaseVersionFailed`
  - `EditNotPossible`
  - `PostAppFailed`
  - `ReleaseNotFound`
  - `BadRequest`
  - `NotFound`
  - `UnAuthorized`
  - `InternalError`

## Store Submission Checklists

### Myket Checklist
- Developer account fully verified in `developer.myket.ir`.
- Package/signature/version verified against Myket upload rules.
- Privacy policy URL and data declarations complete.
- Permissions and content policy declarations complete.
- Listing assets complete (icon/screenshots/descriptions).
- Release artifact accepted and review-ready.

### Cafe Bazaar Checklist (Optional Dual-Store Lane)
- Developer account fully verified in Bazaar panel.
- Package/signature/version rules validated against Bazaar requirements.
- Privacy/data/permission declarations complete for Bazaar review.
- Listing assets complete and policy-safe for Bazaar.
- Release artifact accepted and review-ready in Bazaar.

## Mandatory Pre-Publish Gate
Before each public Android release:
1. Run automated build + lint + test checks.
2. Run device compatibility matrix (API + form factors + RTL).
3. Run offline/online auth and quick-game smoke.
4. Run Myket API preflight (token validity + release API endpoint reachability + billing verify endpoint reachability) from server environment.
5. Run manual policy checklist in Myket panel.
6. If dual-store lane is active, run manual Bazaar policy checklist in panel.
7. Publish only if active store checklists are fully green.

### Myket API Endpoint Hygiene Note
- Example URLs in copied docs may include placeholders (`{packageName}`, `{SKU_ID}`, `{TOKEN}`) and occasional typos (e.g., `PAKCAGE_NAME`, `developer.myket.i/apir/...`).
- Production automation must normalize endpoint paths against the official developer panel/API docs before rollout.

## Exit Criteria
- App is submission-ready for Myket (and Bazaar when dual-store lane is enabled).
- No unresolved compliance items remain.
- Release process is repeatable without ad-hoc fixes.
