# Android Device Compatibility Hardening

Last updated: 2026-05-05
Status: active

## Goal
Maximize reliability across Android device diversity.

## Official Source Baseline
- Android quality guidance: `https://developer.android.com/topic/quality`
- Large screen & adaptive UI guidance: `https://developer.android.com/large-screens`
- App compatibility and behavior changes by API level: `https://developer.android.com/about/versions`

## Compatibility Axes
1. API levels across supported min/target range.
2. Device classes: small/normal/large screens.
3. Performance tiers: low-end to high-end.
4. Locale/RTL (Persian-first).
5. Network states: offline/poor/online.

## Engineering Worklist
- Responsive/adaptive Compose layouts.
- Strict state restoration across process death.
- Memory pressure handling for low-RAM devices.
- Battery-safe background behavior (no abusive wakeups).
- Crash + ANR monitoring readiness.
- Accessibility baseline checks (font scaling, contrast, touch targets).

## Test Matrix (Mandatory)
- API-level matrix: min, median, latest.
- Screen matrix: compact phone, large phone, tablet.
- Locale matrix: Persian RTL + English LTR.
- Connectivity matrix: offline/online/reconnect.

## Release Gate
No Android public release unless compatibility matrix passes and defects are triaged.

## Exit Criteria
- Major compatibility regressions reduced before store submission.
- Stable behavior on common Iranian-market Android devices.
