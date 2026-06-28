# Cafe Bazaar Release Checklist (Optional Dual-Store Lane)

## Account & Policy
- Developer account verified in Bazaar.
- Publish/policy rules reviewed in Bazaar panel before submission.
- Privacy policy URL live and aligned with app behavior.
- Data collection and permission declarations match real runtime behavior.

## Build & Package
- Stable `applicationId`.
- Monotonic `versionCode`.
- Correct `versionName`.
- Signed release artifact ready.
- Packaging format aligned with Bazaar support path (APK/AAB and any store-specific constraints).

## Manifest & Permissions
- Only required permissions declared.
- No unjustified sensitive permission.
- Permission rationale documented and review-safe.

## Listing Assets
- Persian title/short/full description.
- App icon and screenshots ready.
- Category/contact fields complete.
- Claims in listing match shipped features (no overclaim).

## Functional Verification
- Login/register works.
- Quick game modes (2P/3P/4P-2v2) work.
- Offline quick-game continuity works.
- Password fallback works when passkey/biometric unavailable.

## Post-Release Monitoring
- Rollout/publish state monitored in Bazaar panel.
- Install/update error trend monitored after release.
- User review/security-signal issues triaged and tracked.
