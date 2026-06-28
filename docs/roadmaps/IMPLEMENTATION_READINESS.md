# Implementation Readiness Matrix

Last updated: 2026-06-02

This file certifies readiness for the new product direction after the roadmap reset.

## Finalization Status
- Research reset complete on 2026-04-10.
- Active roadmap categories reclassified.
- Missing stable-web/PWA, Android, and demo-web research tracks added.
- Old expansion tracks preserved but downgraded to archived/deferred.

## Global Readiness Criteria
A topic is `Ready` only if all are present:
1. Goal and boundaries.
2. Current direction relevance.
3. Product constraints.
4. Delivery sequence.
5. Verification and rollback conditions.
6. Clear relationship to stable web/PWA, Android, or demo web.

## Readiness by Topic
| Topic | Status | Notes |
|---|---|---|
| 02 PWA Cross-Platform | Supporting | Still relevant, but subordinate to stable web/PWA. |
| 03 Auth Session Security | Ready | Active for stable web/PWA and Android planning. |
| 04 UI Responsive Accessibility | Ready | Active for stable web/PWA and demo web. |
| 05 Performance Reliability | Ready | Active for stable web/PWA and future Android API interactions. |
| 07 DevOps Release | Ready | Active for stable web/PWA rollout and VPS governance. |
| 11 Stable Web PWA | Ready | Active primary shipping contract. |
| 12 Android Native | Ready | Active architecture and product track. |
| 13 Demo Web | Ready | Active experimentation and promotion track. |
| 06 Product Surface | Legacy Evidence | Current-state evidence only; not the active product contract. |
| 09 Strategy Future | Deferred | Only selective future references survive. |
| 10 Alliance World Shared Identity | Archived | Preserved for traceability, not active. |

## Locked Decisions
- Signup/login remains in all product tracks.
- Quick game remains in all product tracks.
- Stable web/PWA is intentionally small and safety-first.
- Android is native and offline-first.
- Demo web is the only experimental lane.
- PWA remains in scope for non-Android users.
- No third-party runtime assets or fallback asset calls are allowed.

## Pre-Implementation Kickoff Checklist
- `docs/roadmaps/IMPLEMENTATION_ORDER.md` matches the three-track model.
- Stable scope and deletion plan is approved.
- Android architecture track is approved.
- Demo promotion policy is approved.
- Archived topics are clearly marked and excluded from active execution.

## Exit Criteria For This Research Reset
- Planning now reflects the new direction without contradiction.
- Stable web/PWA, Android, and demo web are documented as distinct tracks.
- The old broad expansion program no longer controls execution order.


## 2026-05-05 Addendum
- iOS PWA maximum-coverage hardening lane is active.
- Android passkey/biometric + notifications lane is active.
- Android Myket compliance lane is active with pre-publish panel verification requirement.
- Distribution hub requirement is active for web + store + direct channels.
- Any store-policy-sensitive decision must be verified against official Myket developer portal before release.

## 2026-06-02 Addendum
- Android distribution lane now supports optional dual-store execution (`Myket + Cafe Bazaar`) with Myket-first default.
- Dual-store release readiness now includes:
  - `android-native/compliance/bazaar_release_checklist.md`
  - `android-native/compliance/verify_dual_store_release_readiness.sh`
- Distribution hub now requires env-driven Bazaar toggle (`VITE_ENABLE_BAZAAR`) and URL contract (`VITE_BAZAAR_APP_URL`) for optional secondary store visibility.
- Direct-download compliance integration is mandatory when enabled:
  - version/date/SHA metadata parity
  - explicit controlled-path warning copy
  - HTTPS-only distribution links

## 2026-05-05 Execution Snapshot
- Stable web/PWA runtime is deployed with quick-game 2P/3P/4P(2v2), profile/settings, and iOS-oriented install/update/offline guidance.
- Distribution hub route is implemented in app runtime and linked from settings/header.
- Backend passkey/WebAuthn endpoints and persistence are implemented and deployed.
- Android native scaffold is implemented with Compose + Room + Retrofit + DataStore + encrypted token store, and passkey/biometric integration work is active.
- VPS deployment/probe/parity cycles are repeatedly passing on current mainline runtime.
