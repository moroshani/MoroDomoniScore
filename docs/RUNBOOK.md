# Runbook
Last reviewed: 2026-06-04 UTC

## Local Setup
1. `npm install`
2. `cp .env.example .env.local`
3. Fill required env values.
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. Run servers:
   - `npm run api:server`
   - `npm run dev`

## Baseline / Validation Commands
- `git status --short --branch`
- `npm run build`
- `npx prisma validate`
- `node scripts/ops/validate_env_contract.mjs --file=.env.local`
- `npm run ops:android:dual-store:check` (when dual-store lane is enabled)
- `GET /api/health`
- auth flow smoke: register, login, logout, profile update, password change
- `GET /manifest.json`, `GET /sw.js`, `GET /offline.html`
- responsive scan: `npx playwright test tests/w1-responsive.spec.js --reporter=line --workers=1`
- local vs VPS parity: `bash scripts/ops/local_vs_vps_parity.sh`
- VPS deployment surface cleanup: `bash scripts/ops/clean_deployment_surface.sh`
- product scope lock: `npm run ops:scope:check`

## Source Of Truth
- The local repository is authoritative for source, package metadata, scripts, and runbook docs.
- VPS copies under `/var/www/morodomino/app` are mirrors for deployed/runtime operations.
- `scripts/ops/local_vs_vps_parity.sh` checks critical app files, package metadata, Prisma schema, runbook docs, and its own script body against the VPS.
- Docs/package/script-only syncs do not require restarting `morodomino-domino-api.service`.

## Deployment Surface
- Runtime on the VPS lives under `/var/www/morodomino/app`.
- Keep runtime assets such as `dist/`, `node_modules/`, `.env`, `public/fonts/`, `public/icons/`, screenshots, and server source.
- Runtime font assets use the YekanBakh4 Pro runtime subset: `public/fonts/YekanBakh-VF.woff*` for web and `android-native/android-app/app/src/main/res/font/yekanbakh_*.ttf` for native Android.
- Do not deploy local/generated baggage:
  - `android-native/android-app/.gradle/`
  - `android-native/android-app/app/build/`
  - `test-results/`
  - `playwright-report/`
  - `Yekan Bakh - Pro/`
  - `YekanBakh4 Pro/`
  - `.env.local`
- Deploy packaging excludes those paths.
- Cleanup command:
  - `SSH_CFG=/mnt/c/Projects/morodomino/ssh_config SSH_HOST=ariadashboardssh bash scripts/ops/clean_deployment_surface.sh`
  - Windows OpenSSH: `SSH_CFG=C:/Projects/morodomino/ssh_config SSH_HOST=ariadashboardssh-win bash scripts/ops/clean_deployment_surface.sh`

## Product Scope Lock
- Active tracks:
  - stable web/PWA
  - native Android
  - demo web
- Stable web/PWA may ship signup/login/logout, quick game, minimal profile/settings, PWA install/update/offline behavior, and access/distribution hub.
- Archived surfaces must not return to active runtime unless explicitly reactivated:
  - persisted player CRUD
  - history CRUD
  - stats screens
  - spectator/websocket sync
  - alliance/shared identity
  - chat/lobby/realtime
  - AI/Gemini features
- Scope check:
  - `npm run ops:scope:check`
- Scope lock doc:
  - `docs/PRODUCT_SCOPE_LOCK_2026-06-04.md`

## SSH Access Baseline
- Default project SSH config: `/mnt/c/Projects/morodomino/ssh_config`
- Default production ops host alias: `ariadashboardssh`
- Windows production ops host alias: `ariadashboardssh-win`
- There is no active secondary SSH host.
- SSH keys and known-hosts files are project-local:
  - `keys2/private-key-file.pem` + `keys2/known_hosts` for `ariadashboardssh`
- SSH config policy:
  - public-key auth only
  - `BatchMode yes`
  - `StrictHostKeyChecking yes`
  - project-local `UserKnownHostsFile`
  - `ServerAliveInterval 20`, `ServerAliveCountMax 3`, `ConnectTimeout 10`
- Probe command:
  - `ssh -F /mnt/c/Projects/morodomino/ssh_config ariadashboardssh "echo CONNECT_OK && hostname && uptime"`
- Windows OpenSSH probe:
  - `ssh -F C:/Projects/morodomino/ssh_config ariadashboardssh-win "echo CONNECT_OK && hostname && uptime"`
- Ops scripts default to:
  - `SSH_CFG=/mnt/c/Projects/morodomino/ssh_config`
  - `SSH_HOST=ariadashboardssh`
- Agent routing metadata is recorded in `.codex-local/network-routing.json`.

## Quarantined SSH Host
- `morodomino2` / `morodomino2-win` are not active ops aliases.
- Previous address: `62.106.95.208`
- Status: blocked pending out-of-band host identity verification.
- Reason: strict host-key mismatch observed on 2026-06-04.
- Observed ED25519 fingerprint from the failed SSH handshake:
  - `SHA256:RipmcT1vp6O5QLu8bjUTmsCTLp+UnsoewA3nTDQKB3k`
- Offending old ED25519 key remains in `keys/known_hosts` line 3.
- Do not update `keys/known_hosts` or restore this alias unless the new fingerprint is verified through an independent trusted channel.

## Environment Variables
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `API_PORT`
- `VITE_API_URL`
- `IMMORTAL_NAME`, `IMMORTAL_USERNAME`, `IMMORTAL_EMAIL`, `IMMORTAL_PASSWORD`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `VITE_MYKET_APP_URL`
- `VITE_ENABLE_BAZAAR` (optional: `true/false` toggle for Bazaar button in distribution page)
- `VITE_BAZAAR_APP_URL` (required only when `VITE_ENABLE_BAZAAR=true`)
- `VITE_DIRECT_DOWNLOAD_URL` (optional controlled Android download)
- `VITE_DIRECT_DOWNLOAD_SHA256_URL` (required when direct download is enabled)
- `VITE_ANDROID_RELEASE_VERSION`, `VITE_ANDROID_RELEASE_DATE`, `VITE_ANDROID_RELEASE_SHA256`, `VITE_ANDROID_RELEASE_SIZE_BYTES` (required when direct download is enabled)
- `MYKET_ACCESS_TOKEN` (server-only secret for partner API integrations; never exposed to client runtime)
- Validation notes:
  - all public distribution URLs should be `https://`
  - if any direct-download metadata key is set, all six keys must be set (`URL`, `SHA256_URL`, `VERSION`, `DATE`, `SHA256`, `SIZE_BYTES`)
  - `VITE_ANDROID_RELEASE_DATE` format must be `YYYY-MM-DD`
  - `VITE_ANDROID_RELEASE_SHA256` must be 64-char hex

## Android Build Mirror
- Preferred mirror: `https://maven.myket.ir/`
- Wrapper distribution URL:
  - `https://maven.myket.ir/gradle/distributions/gradle-8.10.2-bin.zip`
- Repository policy for Android app (`android-native/android-app/settings.gradle.kts`):
  - plugin resolution uses `maven("https://maven.myket.ir/")`
  - dependency resolution uses `maven("https://maven.myket.ir/")`
- Verified mirror artifacts for this repo:
  - `com.android.tools.build:gradle:8.5.2`
  - `org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24`
  - `com.google.devtools.ksp:symbol-processing-gradle-plugin:1.9.24-1.0.20`
  - `androidx.core:core-ktx:1.13.1`

## Windows Android Development Host
- Active local host is Windows-native VS Code/Codex, not WSL.
- Android SDK root: `%LOCALAPPDATA%\Android\Sdk`.
- Android Studio: `C:\Program Files\Android\Android Studio\bin\studio64.exe`.
- Windows helper:
  - `.\scripts\dev\windows_android_env.cmd`
- Preview helper:
  - `.\scripts\dev\android_preview_windows.cmd`
- Default AVD:
  - `Dominoyar_API_34`
- Details:
  - `docs/WINDOWS_ANDROID_DEV_2026-06-06.md`

## Deployment
- Domain: `https://dominoyar.ir`
- Alt domain: `https://www.dominoyar.ir`
- App path: `/var/www/morodomino/app`
- Service name:
  - `morodomino-domino-api`

### SSL Status Note (2026-05-14)
- SSL is active for the Domino ecosystem on `dominoyar.ir` and related hosts.
- Installed cert source: `C:\Projects\morodomino\certificates`
  - `_.dominoyar.ir-fullchain.pem`
  - `_.dominoyar.ir-privateKey.pem`
- VPS cert paths:
  - `/etc/ssl/dominoyar/fullchain.pem`
  - `/etc/ssl/dominoyar/privkey.pem`
- Old Domino domain is retired and no longer part of active runtime (`domino.ariaprojectsdashboard.ir` removed from Domino app/mail routing).
- Retirement policy: old Domino subdomains are removed from active routing and are not redirected.

### Host Behavior Policy (2026-05-16)
- Canonical production host: `https://dominoyar.ir`
- `https://www.dominoyar.ir` permanently redirects to canonical apex host.
- Demo lane host: `https://demo.dominoyar.ir` runs a separate app/runtime instance for experiments.
- `https://origin.dominoyar.ir` is not user-facing and returns `404`.
- Mail endpoint host: `https://smtp.dominoyar.ir`

### Steps
1. Run VPS preflight:
   - `bash scripts/ops/preflight_vps.sh`
2. Deploy latest release:
   - `bash scripts/deploy_to_aria_vps.sh`
3. Ensure `/var/www/morodomino/app/.env` includes:
   - `API_PORT=14000`
   - `VITE_API_URL=https://dominoyar.ir`
   - `FRONTEND_URL=https://dominoyar.ir,https://www.dominoyar.ir`
   - `SMTP_HOST=127.0.0.1` (recommended local relay runtime) or `smtp.dominoyar.ir`
   - `SMTP_PORT=25` for local relay mode
   - `SMTP_USER=` (optional when local Postfix relay is used)
   - `SMTP_FROM="Dominoyar <noreply@dominoyar.ir>"`
   - `IMMORTAL_*` values
4. Verify:
   - `https://dominoyar.ir/api/health`
   - `https://dominoyar.ir/manifest.json`
   - `https://dominoyar.ir/sw.js`
   - `https://dominoyar.ir/offline.html`
5. Run post-deploy checks:
   - `bash scripts/ops/synthetic_probe.sh`
   - `bash scripts/ops/local_vs_vps_parity.sh`
   - `bash scripts/ops/domain_tls_audit.sh`
   - `bash scripts/ops/dr_backup_verify.sh`

## Android Artifact Hosting (VPS)
When Android release is ready for controlled direct download:
1. Upload signed artifact under a static path on VPS (example: `/var/www/morodomino/downloads/`).
2. Expose it via HTTPS URL on `dominoyar.ir` (no HTTP links).
3. Compute and publish SHA-256 in env:
   - `VITE_ANDROID_RELEASE_VERSION`
   - `VITE_ANDROID_RELEASE_DATE`
   - `VITE_ANDROID_RELEASE_SHA256`
   - `VITE_ANDROID_RELEASE_SIZE_BYTES`
   - `VITE_DIRECT_DOWNLOAD_URL`
   - `VITE_DIRECT_DOWNLOAD_SHA256_URL`
4. Verify access page shows the same version/hash metadata as release notes.

## Myket API Operations
- Integration model: server-to-server only.
- Header auth: `X-Access-Token` from secured server env (`MYKET_ACCESS_TOKEN`).
- Never call Myket partner APIs from browser/mobile client directly.
- Baseline release flow:
  1. release-bundle create/edit metadata
  2. artifact upload
  3. commit for review
  4. revert only through controlled rollback decision
- Release list/status polling baseline:
  - statuses: `JustCreated`, `WaitingForApproval`, `Rejected`, `Approved`, `RolledBack`
  - pagination constraints: `offset > 0`, `limit` in `1..20`
- Upload limit baseline from source corpus: if artifact exceeds `500 MB`, fallback to panel/manual upload path.
- Error triage baseline:
  - HTTP classes: `400`, `401`, `404`, `500`
  - message codes to classify: `MissingRequiredData`, `UploadReleaseVersionFailed`, `EditNotPossible`, `PostAppFailed`, `ReleaseNotFound`, `BadRequest`, `NotFound`, `UnAuthorized`, `InternalError`
- Billing baseline:
  - verify purchase token on backend before entitlement grant
  - consume purchase token on backend for consumables

## Optional Dual-Store Lane (Myket + Cafe Bazaar)
- Default production lane remains Myket-first.
- Dual-store lane can be enabled per release when explicitly planned.
- Required for dual-store release:
  - `android-native/compliance/myket_release_checklist.md` complete
  - `android-native/compliance/bazaar_release_checklist.md` complete
  - `bash android-native/compliance/verify_dual_store_release_readiness.sh .env.local` pass
  - listing metadata parity maintained across both stores (version, release notes, policy declarations)
  - post-release panel monitoring active for both channels

### Helper Scripts
- Publish artifact and print metadata/env exports:
  - `SSH_CFG=/tmp/aria_ssh_config SSH_HOST=aria-safe bash scripts/ops/publish_android_release_to_vps.sh <artifact-path> [public-filename]`
- Update VPS `.env` after artifact publish:
  - `SSH_CFG=/tmp/aria_ssh_config SSH_HOST=aria-safe bash scripts/ops/update_vps_android_release_env.sh <public-url> <version> <release-date> <sha256> [size-bytes]`
- Compute metadata locally without upload:
  - `bash scripts/ops/android_release_metadata.sh <artifact-path> [public-url]`

## Rollback
- One-command rollback:
  - `bash scripts/ops/rollback_last_release.sh`
- After rollback, re-run:
  - `bash scripts/ops/synthetic_probe.sh`
