# Android Readiness Checklist (Execution Tracker)
Last updated: 2026-05-16
Status: in progress

## A) Compatibility Matrix
- [ ] API min-level physical/emulator pass
- [ ] API median-level physical/emulator pass
- [ ] API latest-level physical/emulator pass
- [ ] Compact phone layout + interaction pass
- [ ] Large phone layout + interaction pass
- [ ] Tablet layout + interaction pass
- [ ] Persian RTL end-to-end pass
- [ ] English LTR end-to-end pass
- [ ] Offline boot + gameplay pass
- [ ] Reconnect + resync behavior pass

## B) Security/Auth Matrix
- [ ] Password login/register/logout regression pass
- [ ] Passkey register success path pass
- [ ] Passkey login success path pass
- [ ] Passkey removal with biometric confirmation pass
- [ ] Biometric unavailable fallback-to-password pass
- [ ] Biometric failure/cancel fallback pass
- [ ] Interrupted passkey flow recovery pass

## C) Offline-First/Data Safety
- [ ] Quick game survives process kill/reopen
- [ ] Quick game survives device reboot
- [ ] Quick game survives app upgrade (N-1 -> current)
- [ ] Room migration validation pass
- [ ] No destructive migration behavior observed

## D) Notifications
- [x] Runtime notification permission flow validated (Android 13+)
- [x] Notification channel/category controls validated
- [x] In-app opt-in/opt-out behavior validated
- [x] Deep-link correctness from notification tap validated

## E) Myket Pre-Publish Gate
- [ ] Application ID/signing/versionCode discipline locked
- [ ] Privacy policy URL finalized
- [ ] Persian-first listing assets prepared
- [ ] Permission declarations reviewed against features
- [ ] Myket panel checklist completed

## E2) Optional Bazaar Dual-Store Gate
- [ ] Dual-store lane explicitly enabled for this release
- [ ] Bazaar panel policy checklist completed
- [ ] Bazaar metadata/assets parity confirmed against release notes
- [ ] Bazaar rollout/publish state monitored after release

## F) Direct Download Readiness
- [ ] Signed release artifact built
- [ ] Artifact published to VPS HTTPS path
- [ ] SHA-256 computed and published
- [ ] Access page shows direct link + version/date/hash metadata
