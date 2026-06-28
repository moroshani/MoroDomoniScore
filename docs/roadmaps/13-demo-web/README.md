# 13 Demo Web

Last updated: 2026-06-02

## Goal
Use a separate web lane to develop, test, and harden new features before they are allowed into stable web/PWA or Android.

## Core Rule
Unfinished features must go to demo web first.
Stable products only inherit features that have cleared the promotion gate.

## Why This Exists
The previous product accumulated too much unfinished and future-facing scope in the main app.
Demo web is the containment boundary that prevents that from happening again.

## Active Research Topics
- `promotion-policy.md`
- `experiment-governance.md`
- `distribution-and-promotion-hub.md`

## Current Distribution Execution Notes
- Distribution hub is now compliance-aware for Android store channels.
- Myket is the default Android store CTA.
- Optional Bazaar CTA is environment-controlled and only shown when dual-store lane is explicitly enabled.
- Direct-download section must always surface release integrity metadata and controlled-use warning copy.

## Delivery Outcome
Demo web becomes the experimentation lane, not the user-trust lane.
