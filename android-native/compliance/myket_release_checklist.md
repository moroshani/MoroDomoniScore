# Myket Release Checklist

## Account & Policy
- Developer account verified in Myket.
- Privacy policy URL live and accurate.
- Data collection and permission declarations match app behavior.
- Myket policy/rules review completed in panel before submission.

## Build & Package
- Stable `applicationId`.
- Monotonic `versionCode`.
- Correct `versionName`.
- Signed release artifact ready.
- Artifact size precheck completed for API upload path.

## Manifest & Permissions
- Only required permissions declared.
- No unjustified sensitive permission.
- Permission rationale documented.

## Listing Assets
- Persian title/short/full description.
- App icon and screenshots ready.
- Category/contact fields complete.

## Functional Verification
- Login/register works.
- Quick game modes (2P/3P/4P-2v2) work.
- Offline quick-game continuity works.
- Password fallback works when passkey/biometric unavailable.

## API & Security Gate
- `MYKET_ACCESS_TOKEN` configured only in server secret storage.
- Partner API calls are server-to-server only.
- Release API lifecycle tested (create/edit -> upload -> commit).
- Release status polling validated for `JustCreated`/`WaitingForApproval`/`Rejected`/`Approved`/`RolledBack`.
- Release listing pagination checks validated (`offset > 0`, `limit` between `1..20`).
- Billing verification endpoint test completed for release candidate.
- Consume endpoint test completed for consumable SKU flows.
- Error taxonomy logging verified for `400`/`401`/`404`/`500` and core Myket message codes.
