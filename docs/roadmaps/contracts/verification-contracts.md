# Verification Contracts

Last updated: 2026-02-24

These contracts are mandatory for every roadmap and mini-roadmap.

## C1: Build and Schema Contract
### Required
- `npm run build` must pass.
- `npx prisma validate` must pass with environment loaded.
- `npx prisma migrate deploy` must be no-op or successful on release environment.

### Evidence
- Command outputs logged in `docs/PROJECT_LOG.md` run end section.

## C2: API and Auth Contract
### Required
- `GET /api/health` returns `200`.
- Register/login/me smoke flow passes.
- Remember-me TTL behavior matches contract (short and extended sessions).
- Session revocation is enforced by middleware (revoked token cannot access protected APIs).

### Evidence
- API smoke script output with status codes and key payload checks.

## C3: PWA and Web Parity Contract
### Required
- `manifest.json`, `sw.js`, `offline.html` return `200`.
- Update flow does not auto-refresh without explicit user action.
- Install UX degrades gracefully when `beforeinstallprompt` is unavailable.
- Browser mode and installed mode keep route/API parity.

### Evidence
- Local and VPS checks for assets and update/install behavior.

## C4: Responsive Contract
### Required widths
- 320, 360, 375, 390, 412, 430, 768, 1024, 1366, 1920.

### Required outcomes
- No horizontal overflow on key routes.
- Core gameplay actions reachable without fragile scroll paths.
- Header/drawer remains operable in compact and full modes.
- Form labels and action buttons stay visible and readable.

### Evidence
- Route-by-route screenshot or viewport test report.

## C5: Accessibility Contract (AA Baseline)
### Required
- Keyboard navigation for all primary flows.
- Clear focus-visible indicators.
- Adequate text/background contrast on primary interactive surfaces.
- Form controls have programmatic labels.

### Evidence
- Manual keyboard audit and automated axe/lighthouse accessibility summary.

## C6: Security Contract
### Required
- Protected account safeguards enforced server-side.
- Password storage and policy active.
- Rate limiting for auth endpoints active.
- Session invalidation and expiry enforced in middleware.
- Security headers tracked (HSTS/CSP/CORS policy consistency).

### Evidence
- Route and middleware tests + header capture report.

## C7: Release and Rollback Contract
### Required
- Deployment runs from release path and promotes atomically.
- Service restart and readiness checks pass.
- Rollback path tested and documented.
- Production checks executed against domain URLs, not hardcoded localhost assumptions.

### Evidence
- Deploy log includes promote step, service status, and post-deploy checks.

## C8: Local vs VPS Parity Contract
### Required
- Critical file set hash/equality checks (frontend build artifacts, API route surface, manifest/SW).
- Env-dependent differences must be documented explicitly.
- Feature flags and endpoints must match expected environment matrix.

### Evidence
- Parity report attached to run-end summary.

## C9: Documentation Contract
### Required
- Changed behavior reflected in mini-roadmap and topic roadmap.
- `docs/PROJECT_LOG.md` start/end entries present.
- `docs/ROADMAP.md` remains a valid index.

### Evidence
- File diffs and final run report include roadmap links.

## C10: Registry Contract
### Required
- Every roadmap file follows metadata requirements from `roadmap-registry-contract.md`.
- Topic indexes include all active mini-roadmaps.
- New mini-roadmaps are linked from `docs/ROADMAP.md`.

### Evidence
- Registry/metadata check output attached in run report.

## C11: Continuity and Non-Regression Contract
### Required
- Login/register flow remains available during all rollout phases.
- Quick Night remains available and behaviorally unchanged.
- Offline-capable installed PWA can open and run local scoring routes when backend is unavailable.
- Outside-alliance standard games are stored as scoped standard matches, not Quick Night coercions.

### Evidence
- Smoke checks for auth + quick-night + offline route availability.
- Feature-flag and scope-classification report in run-end notes.
