# 12 Android Native

Last updated: 2026-06-06

## Goal
Create a real native offline-first Android app based on the stable web/PWA product contract.

## Product Rules
- It is not a PWA.
- It is not a WebView shell around the web app.
- It uses native Android UI and storage.
- It inherits only approved stable-product features.

## Initial Scope
- signup/login continuity with the shared backend,
- quick game,
- minimal profile,
- minimal settings,
- offline-first behavior for quick-game usage.

## Why This Exists
Android can support capabilities the web app cannot fully provide or cannot provide reliably, including:
- better offline guarantees,
- biometric integration,
- later passkey/credential-manager support,
- stronger native device storage and app lifecycle control.

## Active Research Topics
- `native-product-plan-2026-06-06.md`
- `offline-first-architecture.md`
- `biometric-and-passkey-strategy.md`
- `iran-markets-release-readiness.md`
- `android-device-compatibility-hardening.md`
- `notifications-strategy.md`

## Current Execution Contract
- Android UI is being revisited from scratch as a native phone-first product.
- Current scaffold UI is prototype evidence only; it is not the final visual direction.
- Stable web/PWA behavior remains the parity source of truth.
- Screen work must follow `native-product-plan-2026-06-06.md` and `android-native/specs/stable-web-parity-checklist.md`.

## Build Infrastructure Policy
- Android Gradle bootstrap and dependency resolution use `https://maven.myket.ir/`.
- Gradle wrapper distribution is sourced from:
  - `https://maven.myket.ir/gradle/distributions/gradle-8.10.2-bin.zip`
- This is the default path for future Android build/release runs unless explicitly changed.

## Store Distribution Policy
- Default lane: Myket-first execution.
- Optional lane: dual-store publish (`Myket + Cafe Bazaar`) is allowed as an execution strategy when business goals require it.
- Dual-store execution must pass per-store policy/metadata/legal checks independently before release.

## Delivery Outcome
Android becomes a first-class product track that follows the stable contract, not the demo contract.
