# iOS PWA Maximum Coverage

Last updated: 2026-05-05
Status: active hardening checklist

## Purpose
Maximize iOS installed-web quality and reduce install/update confusion.

## Official Source Baseline
- WebKit: Web Push for Web Apps on iOS/iPadOS
  - `https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/`
- MDN: `beforeinstallprompt` availability constraints
  - `https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent`
- web.dev installation behavior guidance
  - `https://web.dev/learn/pwa/installation-prompt/`
- Apple user guidance for Add to Home Screen
  - `https://support.apple.com/guide/iphone/add-a-website-icon-to-your-home-screen-iph42ab2f3a7/ios`

## iOS Reality Lock
- iOS Safari install flow is manual (Share -> Add to Home Screen).
- Chromium-style install prompt event is not a reliable iOS path.
- Installed mode behavior differs from browser-tab mode.

## Maximum-Coverage Worklist

### Install UX
- Detect iOS + Safari reliably.
- Show explicit install steps for iOS Safari only.
- Hide misleading install CTA where browser cannot trigger install prompt.
- Provide clear fallback message for non-Safari iOS browsers.

### Update UX
- Show update-available banner for SW updates.
- Add manual refresh/reopen guidance for stale shell cases.
- Add one-tap “reload now” action where safe.

### Offline UX
- Guarantee offline landing page and key shell assets.
- Show connectivity state and recovery actions.
- Ensure quick-game continuation survives tab close/reopen.

### QA Matrix (Mandatory)
- iPhone small screen (SE-class width).
- Modern iPhone large screen (Pro Max-class width).
- iPad portrait/landscape + split view where applicable.
- iOS current and one previous major version.

### Functional Matrix
- Install instructions accuracy.
- Standalone detection correctness.
- Auth continuity after install.
- Quick-game continuity in standalone mode.
- Settings/profile route parity.
- Update flow correctness after deploy.

## Exit Criteria
- iOS install confusion is minimized with clear in-app guidance.
- Installed mode parity with stable web contract is verified.
- Update/offline behavior passes physical-device checks.
