# Mini-Roadmap: Android/Desktop Install

Last updated: 2026-02-23

## Problem
Install UX can silently degrade across browser families if prompt handling and fallbacks are not explicit.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial advanced analytics`

Evidence:
- Deferred install prompt storage and explicit trigger:
  - `context/PwaContext.tsx` (`beforeinstallprompt`, `install()`)
- Install action in drawer:
  - `components/AppHeader.tsx`
- Install guidance and platform badge:
  - `components/PwaInstallGuide.tsx`

## Source-Backed Constraints
### Must
- `beforeinstallprompt` is not baseline and cannot be assumed on all browsers.
  Source: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event
- Install prompt should only be shown via explicit user gesture.
  Source: https://web.dev/learn/pwa/installation-prompt/

### Should
- Provide clear fallback UX when no install event is available.
  Source: https://web.dev/learn/pwa/checklist

### Could
- Track prompt lifecycle (shown/accepted/dismissed) for UX tuning.
  Source: web.dev install guidance + analytics best practice patterns.

## Gap Matrix
- Implemented:
  - Platform detection and explicit install CTA where available.
  - Fallback instructions for unsupported/legacy browsers.
- Missing:
  - Prompt funnel telemetry.
  - Browser-version compatibility table in UI/help.

## Delivery Plan
### P0
- Keep explicit install button + non-blocking fallback text.
- Ensure no dead-end install CTA is rendered.

### P1
- Add telemetry events:
  - `install_prompt_available`
  - `install_prompt_opened`
  - `install_prompt_accepted`
  - `install_prompt_dismissed`
- Add settings help matrix for Chrome/Edge/Firefox desktop behavior.

### P2
- Context-aware install nudges (timed by engagement, not immediate spam).
- A/B test install CTA placements (header drawer vs settings primary).

## Verification
- Android Chrome: prompt appears and install succeeds.
- Desktop Chrome/Edge: address bar install and in-app CTA both valid.
- Unsupported browser: no broken CTA, clear fallback shown.
- Installed app relaunch opens same domain scope and routes.

## KPIs
- Install conversion rate.
- Prompt dismissal rate.
- Install failure/support tickets per 1k sessions.

## Expansion Round 2 (2026-02-23)
- Add browser-behavior matrix for Chromium variants (Chrome, Edge, Samsung Internet).
- Add install prompt cooldown policy (avoid repetitive prompts after dismiss).
- Add install CTA experiment plan:
  - drawer CTA,
  - settings CTA,
  - post-task CTA (after successful scoring session).
- Add domain-level check ensuring prompt CTA is hidden when app is already installed.

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
