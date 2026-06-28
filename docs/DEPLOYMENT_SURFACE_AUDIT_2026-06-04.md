# Deployment Surface Audit - 2026-06-04

Purpose: keep the VPS app mirror focused on runtime/deployment inputs instead of local generated output.

## Keep On VPS

- `.env`
- `node_modules/`
- `dist/`
- `public/fonts/`
- `public/icons/`
- `public/screenshots/`
- `public/sounds/`
- web source
- backend source
- Prisma schema and migrations
- ops scripts and docs
- Android source/docs/contracts, excluding build outputs

## Exclude Or Remove

- `android-native/android-app/.gradle/`
- `android-native/android-app/app/build/`
- `test-results/`
- `playwright-report/`
- `Yekan Bakh - Pro/`
- `.env.local`

The runtime font subset remains tracked under `public/fonts/`; the full licensed source font bundle stays local-only.

## Changes Made

- `scripts/deploy_to_aria_vps.sh` now excludes generated/local-only baggage from deployment archives.
- `scripts/ops/clean_deployment_surface.sh` removes the same baggage from `/var/www/morodomino/app` and `/var/www/morodomino/app.previous`.
- `package.json` exposes `ops:surface:clean:vps`.
- `scripts/ops/local_vs_vps_parity.sh` checks the deployment scripts and this audit doc.

## Verification

Run:

```bash
SSH_CFG=C:/Projects/morodomino/ssh_config SSH_HOST=ariadashboardssh-win bash scripts/ops/clean_deployment_surface.sh
SSH_CFG=C:/Projects/morodomino/ssh_config SSH_HOST=ariadashboardssh-win bash scripts/ops/local_vs_vps_parity.sh
```

Expected result:

- `SURFACE_CLEAN_RESULT=PASS`
- `PARITY_RESULT=PASS`

## 2026-06-04 Cleanup Result

Remote manifest backup:

- `/var/www/morodomino/backups/deployment-surface-20260604T115528Z/pre-clean-sizes.txt`

Removed from `/var/www/morodomino/app`:

- `android-native/android-app/.gradle/` - `6.3M`
- `android-native/android-app/app/build/` - `310M`
- `Yekan Bakh - Pro/` - `6.1M`

Removed from `/var/www/morodomino/app.previous`:

- `Yekan Bakh - Pro/` - `6.1M`

Post-clean VPS app size:

- `/var/www/morodomino/app` - `374M`
- `node_modules/` - `371M`
- `dist/` - `564K`
- `public/fonts/` - `116K`

Runtime verification after cleanup:

- `morodomino-domino-api.service`: active
- `nginx`: active
- `https://dominoyar.ir/api/health`: pass
- `https://dominoyar.ir/manifest.json`: pass
- local-vs-VPS parity: pass
