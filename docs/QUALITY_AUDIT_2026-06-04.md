# Quality audit - 2026-06-04

Scope: focused quality pass for the Domino system before further web-app work.

## Boundaries

- Local project root: `C:\Projects\morodomino\MoroDomoniScore`.
- VPS application root: `/var/www/morodomino/app`.
- VPS download root: `/var/www/morodomino/downloads`.
- VPS backup root: `/var/www/morodomino/backups`.
- No non-Domino application paths are part of this audit.

## Findings

- Runtime Persian text in source, PWA files, and smoke tests is valid Unicode. Mojibake seen in PowerShell output is terminal rendering, not file corruption.
- The stable smoke Playwright config was machine-specific because it referenced a WSL Node path. It now uses the active Node executable and local Vite binary, with an optional `PLAYWRIGHT_CHANNEL` override for machines that already have Edge or Chrome installed.
- Malformed JSON requests to the API were previously returned as server errors. The API now preserves safe 4xx parser errors and only logs true server-side 5xx failures.
- VPS environment contract, Prisma migration status, Android release metadata, and APK checksum were checked as part of the pass.
- The stable smoke test now matches the current access-page-first auth flow. On this Windows machine it can launch with `PLAYWRIGHT_CHANNEL=msedge`, but the full registration path requires a local Postgres service matching `.env.local`; production data was not used for that test.

## Verification targets

- `npm run build`
- `npm run ops:scope:check`
- `npx prisma validate`
- `npx playwright test tests/stable-smoke.spec.js --reporter=line --workers=1` reaches local registration, then stops if local Postgres is unavailable.
- `scripts/ops/local_vs_vps_parity.sh`
- Live API checks for health, auth guard, passkey option validation, invalid login, and malformed JSON handling.
- APK checksum verification under `/var/www/morodomino/downloads`.

## Final verification

- Local `npm run build`: pass.
- Local `npm run ops:scope:check`: pass.
- Local `npx prisma validate` with a dummy `DATABASE_URL`: pass.
- Local `bash -n scripts/ops/local_vs_vps_parity.sh`: pass.
- Local `git diff --check` for changed step 6 files: pass.
- Local Playwright smoke with `PLAYWRIGHT_CHANNEL=msedge`: browser launches and reaches registration; blocked by absent local Postgres at `localhost:5432`.
- VPS `morodomino-domino-api.service`: active after restart.
- VPS `nginx`: active.
- VPS environment contract: pass.
- VPS product scope check: pass.
- VPS Prisma migration status: up to date with 14 migrations.
- VPS APK checksum: pass for `dominoyar-android-v0.1.0-debug.apk`.
- Live public endpoints `/api/health`, `/manifest.json`, `/sw.js`, `/offline.html`, `/`, `/profile`, `/settings`, and `/access`: 200.
- Live unauthenticated `/api/users/me`: 401.
- Direct API passkey missing identifier: 400.
- Direct API passkey unknown user: 404.
- Direct API invalid login: 401.
- Direct API malformed JSON: 400.
- Local-vs-VPS parity: pass.
