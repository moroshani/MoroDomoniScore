# Biometric And Passkey Strategy

Last updated: 2026-05-05
Status: active implementation strategy

## Purpose
Define the Android easy-login path with strong security and practical fallback behavior.

## Official Source Baseline
- Credential Manager (passkeys): `https://developer.android.com/identity/sign-in/credential-manager`
- BiometricPrompt: `https://developer.android.com/identity/sign-in/biometric-auth`
- Passkeys platform overview: `https://developers.google.com/identity/passkeys`

## Product Targets
1. Password-first remains available at all times.
2. Passkey sign-in is offered on compatible devices/accounts.
3. Biometric unlock protects local session re-entry where enabled.
4. Fallback paths are explicit and reliable.

## Architecture

### Authentication Modes
- Mode A: Password login (baseline, always available).
- Mode B: Passkey login/register (Credential Manager).
- Mode C: Biometric re-unlock for locally persisted session.

### Token & Secret Handling
- Persist tokens in encrypted storage.
- Gate sensitive token use with biometric check when policy enabled.
- Never block emergency sign-in path if biometric fails.

### Failure Handling
- If passkey unavailable: fallback to password.
- If biometric unavailable/failed/lockout: fallback to password.
- If device/security context changes: force explicit re-auth.

## Implementation Phases

### Phase 1: Biometric Session Re-Unlock
- Add `BiometricPrompt` for re-entering active session.
- User setting to enable/disable biometric unlock.
- Handle lockout and fallback UX.

### Phase 2: Passkey Registration & Login
- Add Credential Manager-based passkey flows.
- Bind passkey registration/login to backend auth contract.
- Add account management controls (add/remove passkeys).

### Phase 3: Security Hardening
- Threat-model review.
- Abuse/rate-limit checks.
- Device-bound session policy refinement.

## Verification Matrix
- Devices with biometrics (fingerprint/face) and without biometrics.
- Android versions across support window.
- Passkey-capable and non-capable devices.
- Offline/online transitions and interrupted auth flows.

## Exit Criteria
- Biometric and passkey login are stable on supported devices.
- Password fallback works in all failure cases.
- Security and UX checks pass for release lane.
