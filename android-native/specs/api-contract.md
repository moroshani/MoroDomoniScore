# Android API Contract (Foundation)

Last updated: 2026-05-04
Status: active implementation spec

## Purpose
Lock the first Android-to-backend contract so Android can ship parity with stable web/PWA without pulling archived scope.

## Base URL
- Same backend family as stable web.
- Environment-configured base URL.

## Active Endpoint Set

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Profile
- `GET /api/users/me`
- `PATCH /api/users/me`
- `PATCH /api/users/me/password`

## Explicitly Out Of Scope
Do not depend on these for Android foundation:
- `/api/players`
- history/stats endpoints
- alliance/shared-identity endpoints
- realtime/sync endpoints

## Token Semantics
- Password-first login/register flow.
- Remember-me behavior parity with stable web.
- Token attached as `Authorization: Bearer <token>`.
- Refresh/re-login handled by app policy when token becomes invalid.

## Error Handling Baseline
- 400/401/403/409 are first-class user-visible paths.
- Network timeout/offline errors map to actionable Persian UX messages.
- Retry policy only for idempotent reads by default.

## Next Implementation Tasks
1. Define Retrofit interfaces for active endpoints.
2. Define DTOs aligned with stable web user model.
3. Add auth interceptor and centralized error mapper.
4. Add smoke tests against staging/prod-compatible API responses.
