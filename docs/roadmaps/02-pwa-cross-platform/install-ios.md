# Mini-Roadmap: iOS Install

Last updated: 2026-02-23

## Problem
iOS install and capabilities differ from Chromium. Without explicit UX and platform-specific QA, users interpret platform limitations as app bugs.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial for deep iOS polish`

Evidence:
- iOS detection and instruction branch:
  - `context/PwaContext.tsx`
- iOS web-app meta tags and apple touch icon:
  - `index.html`
- Manifest icon set includes apple icon + maskable icon:
  - `public/manifest.json`

## Source-Backed Constraints
### Must
- iOS install generally uses Safari "Add to Home Screen" path.
  Source: https://web.dev/learn/pwa/installation-prompt/
- Platform behavior diverges from Chromium prompt model.
  Source: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/

### Should
- Keep icon/manifest quality high for launcher fidelity.
  Source: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
  Source: https://web.dev/maskable-icon/

### Could
- Add explicit iOS capability table (what works in browser vs installed mode).

## Gap Matrix
- Implemented:
  - iOS install instructions and web-app meta tags.
  - standalone-aware behavior checks.
- Missing:
  - QA matrix across current and one-previous iOS versions.
  - Startup/splash asset strategy for visual polish.

## Delivery Plan
### P0
- Keep iOS-specific steps visible and concise.
- Ensure no Chromium-only install language appears for iOS users.

### P1
- Add iOS capability matrix to guide/settings.
- Add iOS physical-device smoke runbook.

### P2
- Add iOS launch polish package (splash/launch assets if still needed by target browsers).
- Add optional user education toast after first iOS install.

## Verification
- iPhone Safari: install steps are accurate and complete.
- Installed mode opens in standalone and route parity is preserved.
- iPad Safari: layout and install guidance remain correct.

## KPIs
- iOS install completion rate.
- iOS support-ticket rate for install confusion.

## Expansion Round 2 (2026-02-23)
- Add iOS-specific UX copy variants for Safari vs non-Safari browsing contexts.
- Add QA matrix for iPhone SE width, modern iPhone Pro Max width, and iPad split view.
- Add home-screen reinstall troubleshooting steps in guide/settings.
- Add first-launch standalone detection check and user hint if app opens inside browser tab.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 5
- Dependencies locked: Wave 1 auth/session hardening and Wave 4 responsive shell stable
- Required feature flags: pwa_install_v2, pwa_update_control_v2, offline_continuity_v1
- Non-regression constraints (mandatory):
  - Login/register remains available in all phases.
  - Quick Night remains available and unchanged.
  - No gameplay-rule changes in this roadmap batch.
  - Zero-downtime rollout only (expand, backfill, cutover, cleanup).
  - Web and installed PWA parity is required.
- Delivery checklist:
  - API contracts are frozen before implementation starts.
  - Data migration/backfill plan includes rollback and parity checks.
  - Security controls and abuse-path checks are mapped to verification contracts.
  - Responsive behavior validated from 320px to 1920px before release gate pass.
  - Observability events/metrics are defined before rollout.
- Verification checklist:
  - Unit + integration + end-to-end coverage for this roadmap item.
  - Contract checks C1-C11 and release gates G0-G6 applied where relevant.
  - Local vs VPS behavior parity snapshot captured before closing.
- Exit artifact required: Cross-platform install matrix report (Android/iOS/Desktop + installed/web parity)


## Scope
This roadmap item defines execution boundaries and delivery policy for pwa cross platform.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
