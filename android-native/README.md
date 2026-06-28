# Android Native Foundation

This folder is the starting contract for the native Android track.

## Goal
- build a real offline-first Android app,
- keep parity with the stable web/PWA product contract,
- avoid reintroducing demo-only or archived features into the Android baseline.

## Stable Parity Surface
- signup
- login
- logout
- quick game: 2-player, 3-player, 4-player (2v2)
- minimal profile: name, username, email, password change
- minimal settings: theme, sound, haptics

## First Android Deliverables
- local quick-game session model
- local preferences model
- auth/session contract for shared backend usage
- parity rules for quick-game names, teams, and scoring setup

## Current Status
- stable web/PWA is the source of truth for product behavior
- Android contracts are defined in `android-native/contracts/`
- implementation can start from these contracts without depending on archived alliance/history/spectator scope
- full native product execution plan is documented in `docs/roadmaps/12-android-native/native-product-plan-2026-06-06.md`
- stable web parity checklist is documented in `android-native/specs/stable-web-parity-checklist.md`
- native Android design system baseline is documented in `android-native/specs/native-design-system.md`
- Android now packages the YekanBakh4 Pro TTF runtime subset for native typography
- first native app pass now includes Auth, Game, Profile, and Settings routes
- debug preview screenshots can be captured with `scripts/dev/android_preview_matrix_windows.cmd`
- quick-game restore now preserves 2P/3P/4P mode and stored round count after app restart
- release hardening still requires production-session manual smoke, deeper scoring parity review, and device compatibility passes
