# 11 Stable Web/PWA

Last updated: 2026-05-05

## Goal
Deliver the final web product for non-Android users, especially iOS, with only safe, finished, and verified features.

## Product Contract
The stable web/PWA product must contain only:
- signup,
- login,
- logout,
- quick game,
- minimal profile,
- minimal settings,
- PWA install/update/offline behavior required for non-Android users.

Anything unfinished, experimental, or operationally risky belongs outside this product.

## Current Reality
The existing web app is larger than this target.
It currently includes multiple gameplay modes, history, stats, guide, spectator, extensive account-management UX, and archived expansion foundations.
That broader surface is implementation evidence only; it is not the future shipping contract.

## Mandatory Constraints
- Keep PWA support.
- Keep self-hosted assets only.
- Keep auth continuity.
- Keep quick-game continuity.
- Remove dependency on non-stable features from routes, menus, APIs, and deployment checks.

## Active Research Topics
- `stable-scope-and-deletion-plan.md`
- `ios-pwa-maximum-coverage.md`

## Delivery Outcome
When this track is implemented, stable web/PWA becomes the reference product for:
- user-facing web release,
- iOS/non-Android installed-web usage,
- parity target for the native Android product.
