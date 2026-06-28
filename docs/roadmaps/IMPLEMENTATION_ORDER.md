# Implementation Order

Last updated: 2026-05-05
Status: execution in progress; core stable web/PWA and Android foundation work is actively implemented and repeatedly deployed.

## Decision Lock
1. Stable web/PWA is the first shipping contract.
2. Stable web/PWA keeps only signup, login, quick game, minimal profile, and minimal settings.
3. PWA stays in scope because non-Android users, especially iOS, still need the web product.
4. Native Android must be a real offline-first app, not a web wrapper or PWA shell.
5. Demo web is the only approved incubation lane for unfinished features.
6. Feature promotion from demo to stable requires explicit signoff and verification.
7. No third-party runtime assets or fallbacks are allowed; everything must be self-hosted.
8. Keep auth continuity and safe quick-game continuity through all migrations.
9. Older alliance/realtime/shared-identity work is archived for now and must not shape active implementation.

## Preferred Execution Sequence

## Phase 0: Research Reset and Documentation Lock
Goal: ensure planning reflects the new direction before coding.
- `docs/roadmaps/README.md`
- `docs/roadmaps/IMPLEMENTATION_READINESS.md`
- `docs/roadmaps/11-stable-web-pwa/README.md`
- `docs/roadmaps/12-android-native/README.md`
- `docs/roadmaps/13-demo-web/README.md`

Exit criteria:
- Active, supporting, and archived research categories are clearly separated.
- Stable web/PWA, Android, and demo web tracks are documented.

## Phase 1: Stable Web/PWA Scope Reduction
Goal: cut the current web app down to the stable shipping contract.
- `docs/roadmaps/11-stable-web-pwa/stable-scope-and-deletion-plan.md`
- `docs/roadmaps/11-stable-web-pwa/ios-pwa-maximum-coverage.md`
- supporting references:
  - `docs/roadmaps/03-auth-session-security/README.md`
  - `docs/roadmaps/02-pwa-cross-platform/README.md`
  - `docs/roadmaps/04-ui-responsive-accessibility/README.md`
  - `docs/roadmaps/05-performance-reliability/README.md`
  - `docs/roadmaps/07-devops-release/README.md`

Exit criteria:
- Stable web/PWA contains only approved features.
- No runtime dependency remains on deprecated features.
- All runtime assets are self-hosted.

## Phase 2: Stable Web/PWA Verification and VPS Alignment
Goal: verify the reduced product locally and on VPS.
- local verification
- VPS parity and deployment verification
- self-hosted asset audit
- PWA install/update/offline validation for non-Android users

Exit criteria:
- Local and VPS behavior match.
- Stable web/PWA is shippable under the reduced product contract.

## Phase 3: Native Android Foundation
Goal: build the native Android base from the stable product contract.
- `docs/roadmaps/12-android-native/offline-first-architecture.md`
- `docs/roadmaps/12-android-native/biometric-and-passkey-strategy.md`
- `docs/roadmaps/12-android-native/android-device-compatibility-hardening.md`
- `docs/roadmaps/12-android-native/notifications-strategy.md`
- `docs/roadmaps/12-android-native/iran-markets-release-readiness.md`

Exit criteria:
- Android project skeleton exists.
- Offline-first local data layer exists.
- Auth and quick-game parity contract is defined against stable web/PWA.

## Phase 4: Demo Web Foundation
Goal: establish a separate experimentation lane.
- `docs/roadmaps/13-demo-web/promotion-policy.md`
- `docs/roadmaps/13-demo-web/experiment-governance.md`
- `docs/roadmaps/13-demo-web/distribution-and-promotion-hub.md`

Exit criteria:
- Demo lane boundaries are clear.
- Promotion rules are enforced by process and docs.

## Phase 5: Feature Development Under The New Model
Goal: resume feature work safely.
- new features start in demo web,
- mature features promote to stable web/PWA,
- Android adopts only promoted features unless explicitly approved otherwise.

Exit criteria:
- No unfinished feature lands directly in stable.
- Android and stable web/PWA stay aligned on approved capabilities.
