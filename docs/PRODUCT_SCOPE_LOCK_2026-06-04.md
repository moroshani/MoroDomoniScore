# Product Scope Lock - 2026-06-04

Purpose: make the active product direction explicit and enforceable before new feature work.

## Locked Active Tracks

1. Stable web/PWA
2. Native Android
3. Demo web

## Stable Web/PWA Contract

Stable web/PWA may include:

- signup
- login
- logout
- quick game modes: 2-player, 3-player, 4-player 2v2
- minimal profile
- minimal settings
- PWA install/update/offline behavior
- distribution/access hub

Stable web/PWA must not include active runtime dependencies on:

- persisted player CRUD
- history CRUD
- stats screens
- spectator routes or websocket sync
- alliance/shared-identity routes
- chat/lobby/realtime surfaces
- AI/Gemini features

Round-level history inside the active scoreboard is allowed because it is local quick-game state, not the retired persisted history product.

## Native Android Contract

Android remains native and offline-first. It inherits only approved stable-product features unless a specific scope exception is documented.

## Demo Web Contract

Demo web is the only incubation lane for unfinished or risky features. Promotion into stable web/PWA or Android requires explicit signoff and verification.

## Archived Material

Alliance/shared-identity, realtime, spectator, broad history/stats, and older expansion docs remain for traceability only. They are not active implementation instructions.

## Enforcement

Run:

```bash
npm run ops:scope:check
```

The check fails if active runtime files, environment examples, route wiring, or rollback scripts reintroduce archived scope.
