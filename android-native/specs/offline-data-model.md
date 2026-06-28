# Android Offline Data Model (Foundation)

Last updated: 2026-05-04
Status: active implementation spec

## Scope
Defines the first local persistence model for the native Android app.

The model covers only the approved stable contract:
- authentication continuity metadata,
- quick-game setup and scoring continuity,
- minimal local preferences.

## Storage Layers
- Room:
  - quick-game runtime entities,
  - lightweight audit of local game transitions.
- DataStore:
  - theme, sound, haptics,
  - install/onboarding hints,
  - small auth UX preferences.
- Encrypted storage (next step):
  - auth token/session secret material.

## Proposed Room Entities

### `quick_game_session`
- `id` TEXT PK (UUID)
- `created_at` TEXT (ISO8601)
- `updated_at` TEXT (ISO8601)
- `mode` TEXT (`2P` | `3P` | `4P`)
- `point_cap` INTEGER
- `games_per_set` INTEGER
- `sets_per_night` INTEGER
- `status` TEXT (`active` | `completed` | `abandoned`)
- `current_game_number` INTEGER
- `current_set_number` INTEGER

### `quick_game_side`
- `id` TEXT PK (UUID)
- `session_id` TEXT FK -> `quick_game_session.id`
- `side_index` INTEGER
- `display_name` TEXT
- `players_per_team` INTEGER
- `current_game_score` INTEGER
- `games_won` INTEGER
- `sets_won` INTEGER

### `quick_game_round`
- `id` TEXT PK (UUID)
- `session_id` TEXT FK -> `quick_game_session.id`
- `round_number` INTEGER
- `created_at` TEXT (ISO8601)
- `payload_json` TEXT

`payload_json` keeps per-side score deltas and avoids schema churn during early iterations.

## Continuity Rules
- Setup names are disposable.
- No dependency on long-term player roster tables.
- Restoring an active session after app restart is required.
- Completed sessions may be purged by retention policy later.

## Migration Discipline
- Use Room migrations from v1 onward.
- No destructive migration in production builds.
- Expand-contract approach for all schema changes.

## Next Implementation Tasks
1. Define Kotlin Room entities and DAO interfaces.
2. Implement repository APIs that mirror stable web scoring semantics.
3. Add session-restore boot path with corruption fallback.
