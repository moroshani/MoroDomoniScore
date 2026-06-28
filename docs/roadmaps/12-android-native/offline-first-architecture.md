# Offline-First Android Architecture

Last updated: 2026-04-10

## Purpose
Define the Android architecture required to make the app usable even when connectivity is unreliable or unavailable.

## Architecture Direction
- native Android project,
- Kotlin,
- Jetpack Compose UI,
- Room for local persistent data,
- DataStore for preferences and light app state,
- Retrofit/OkHttp for API communication,
- WorkManager for deferred sync and background tasks when needed.

## Shared Contract With Stable Web/PWA
The Android app must match stable web/PWA on:
- auth semantics,
- quick-game rules,
- profile fields,
- approved settings fields.

It may exceed web/PWA only where native capabilities are intentionally allowed and documented.

## Offline-First Principles
- quick game must be usable without immediate network access,
- local state must survive app restarts,
- sync, where needed, must be explicit and conflict-aware,
- no dependency on browser storage rules or service-worker behavior.

## Required Research Outputs
- local data model for quick-game sessions,
- sync boundary between local-only and server-backed data,
- parity test cases for scoring logic,
- secure token/session storage strategy,
- failure/recovery behavior for reconnect and stale auth state.
