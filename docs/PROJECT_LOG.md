# Project Log

This log must be updated at the start and end of every run.

## Run Log

### 2026-06-08 11:26 UTC - Run End
- Summary: Improved native Android UI across auth, game, profile, settings, light/dark, and compact preview states.
- Changes: Split Android auth into distinct login and register views; reduced global type, shape, panel, button, and spacing scale; rewrote quick-game setup/scoring UI with tighter native layout; cleaned app-shell bottom navigation labels; fixed profile text-field clipping and security action layout; expanded preview matrix to include register and compact-register captures.
- Tests: `.\gradlew.bat testDebugUnitTest` pass; `.\gradlew.bat assembleDebug` pass; `.\gradlew.bat assembleRelease` pass; `.\scripts\dev\android_preview_matrix_windows.cmd` pass with login/register, shell, setup, scoring, profile, settings, dark, and compact screenshots under `test-results/`.
- Notes: UI is substantially cleaner, but production-session manual smoke and broader device compatibility review remain before release.

### 2026-06-08 11:00 UTC - Run End
- Summary: Resumed Android-native work, inspected current build artifacts/docs, fixed quick-game restore parity, and verified build/test/preview matrix.
- Changes: Preserved restored Android quick-game mode for enum-name storage (`TWO_PLAYER`, `THREE_PLAYER`, `FOUR_PLAYER_TWO_VS_TWO`), retained legacy compact IDs (`2P`, `3P`, `4P`), carried Room round count into restored UI state, and added mapper unit coverage.
- Tests: `.\gradlew.bat testDebugUnitTest --rerun-tasks` pass; `.\gradlew.bat assembleDebug` pass; `.\gradlew.bat assembleRelease` pass; `.\scripts\dev\android_preview_matrix_windows.cmd` pass after restarting stale emulator; debug/release APK metadata remains `com.morodomino.android` version `0.1.0`, minSdk `26`, targetSdk `34`.
- Notes: Latest debug APK and unsigned release APK now reflect the current native app state. Remaining Android blockers are production-session manual smoke, deeper scoring-rule parity review beyond restore behavior, release signing/distribution checks, and broader device compatibility passes.

### 2026-06-03 08:49 UTC - Run End
- Summary: Continued non-stop by hardening env/distribution compliance validation, updating implementation-readiness roadmap docs, and validating builds.
- Changes: Extended `scripts/ops/validate_env_contract.mjs` with distribution URL/metadata contract checks (HTTPS, metadata completeness, date/SHA format, Bazaar toggle contract); updated `docs/RUNBOOK.md` validation guidance; updated `docs/roadmaps/IMPLEMENTATION_READINESS.md` and `docs/roadmaps/13-demo-web/README.md` to reflect dual-store and direct-download compliance execution requirements.
- Tests: `bash android-native/compliance/verify_android_release_readiness.sh` pass; `bash android-native/compliance/verify_dual_store_release_readiness.sh .env.example` pass; `npm run build` pass.

### 2026-06-02 13:43 UTC - Run End
- Summary: Updated roadmap first, added automated dual-store release gate, and implemented distribution page/store toggle + direct-download compliance messaging.
- Changes: Updated roadmap/index/distribution planning in `docs/ROADMAP.md` and `docs/roadmaps/13-demo-web/distribution-and-promotion-hub.md`; added `android-native/compliance/verify_dual_store_release_readiness.sh` and `android-native/compliance/bazaar_release_checklist.md`; updated `android-native/compliance/README.md`, `docs/RUNBOOK.md`, `.env.example`, and `package.json` (`ops:android:dual-store:check`); enhanced `pages/AccessPage.tsx` with optional Bazaar button (`VITE_ENABLE_BAZAAR`/`VITE_BAZAAR_APP_URL`) and stronger direct-download integrity warning panel.
- Tests: `bash android-native/compliance/verify_android_release_readiness.sh` pass; `bash android-native/compliance/verify_dual_store_release_readiness.sh .env.example` pass.

### 2026-06-02 13:32 UTC - Run End
- Summary: Added optional dual-store execution lane (`Myket + Cafe Bazaar`) while preserving Myket-first default, with actionable compliance gates and runbook guidance.
- Changes: Updated Android native roadmap/readiness docs to include optional Bazaar checklist and gate path in `docs/roadmaps/12-android-native/README.md`, `docs/roadmaps/12-android-native/iran-markets-release-readiness.md`, and `docs/roadmaps/artifacts/android-readiness-checklist-2026-05-16.md`; added `android-native/compliance/bazaar_release_checklist.md`; extended `docs/RUNBOOK.md` with optional dual-store lane operational policy.
- Tests: `bash android-native/compliance/verify_android_release_readiness.sh` pass.

### 2026-06-02 12:29 UTC - Run End
- Summary: Continued self-driven Myket research from local corpus and tightened release/runbook/compliance docs with explicit API contract constraints.
- Changes: Added structured extraction artifacts `docs/roadmaps/artifacts/myket-docstxt-structured-extract.json` and `docs/roadmaps/artifacts/myket-docstxt-structured-extract.md`; expanded Myket release readiness with status model, pagination rules, upload-size guardrail, and error taxonomy in `docs/roadmaps/12-android-native/iran-markets-release-readiness.md`; expanded `docs/RUNBOOK.md` and `android-native/compliance/myket_release_checklist.md` with API contract enforcement checks.
- Tests: `bash android-native/compliance/verify_android_release_readiness.sh` pass.

### 2026-06-02 11:58 UTC - Run End
- Summary: Ran direct Myket KB research crawl, refreshed architecture/runbook/compliance docs with server-to-server Myket API requirements, and kept release lane Myket-only.
- Changes: Added Myket distribution/API architecture section in `docs/ARCHITECTURE.md`; expanded Myket release readiness with API flow/security constraints in `docs/roadmaps/12-android-native/iran-markets-release-readiness.md`; added `MYKET_ACCESS_TOKEN` and Myket API operations policy to `docs/RUNBOOK.md`; expanded `android-native/compliance/myket_release_checklist.md` with API/security gates; added research artifacts `docs/roadmaps/artifacts/myket-kb-crawl-report.json`, `docs/roadmaps/artifacts/myket-kb-extract.md`, and `docs/roadmaps/artifacts/myket-kb-research-summary-2026-06-02.md`.
- Tests: `bash android-native/compliance/verify_android_release_readiness.sh` pass; Myket KB crawl completed with 34 links processed (`25` reachable HTTP `200`, remaining mostly placeholder API example URLs).

### 2026-05-27 14:24 UTC - Run End
- Summary: Enforced Myket-only Android release scope across roadmap/compliance docs, verified SSH/VPS access, and added a Deep Research prompt artifact for full Myket knowledge ingestion.
- Changes: Removed remaining Cafe Bazaar-focused release language from active Android readiness/distribution docs, renamed compliance checklist to `myket_release_checklist.md` and updated automation references, validated `ariadashboardssh` VPS access with active services, and added `docs/roadmaps/artifacts/myket-deep-research-prompt.md` for comprehensive external research execution.
- Tests: `bash android-native/compliance/verify_android_release_readiness.sh` pass; SSH probe to VPS host `5.159.49.125` pass (`morodomino-domino-api` and `nginx` active); Myket web/resource probes pass (`developer.myket.ir` and `maven.myket.ir` return `200`).

### 2026-05-21 06:42 UTC - Run End
- Summary: Android build lane stabilized on Myket mirror, Kotlin build blockers fixed, and latest debug APK published to Dominoyar VPS downloads.
- Changes: Fixed Android theme dependency (`com.google.android.material:material:1.12.0`), resolved `MainActivity`/`BiometricPromptManager`/`PasskeyAuthCoordinator` compile issues, produced `assembleDebug`, `assembleRelease`, and `bundleRelease` artifacts, and published `dominoyar-android-v0.1.0-debug.apk` with checksum via `scripts/ops/publish_android_release_to_vps.sh`.
- Tests: `./gradlew assembleDebug` pass, `./gradlew assembleRelease` pass, `./gradlew bundleRelease` pass, live download probes pass (`https://dominoyar.ir/downloads/dominoyar-android-v0.1.0-debug.apk` and `.sha256` both `200`).

### 2026-05-21 05:58 UTC - Run End
- Summary: Switched Android dependency/bootstrap lane to Myket mirror and updated docs/runbook for future reproducibility.
- Changes: Android Gradle repository resolution now uses `https://maven.myket.ir/`; wrapper distribution now uses `https://maven.myket.ir/gradle/distributions/gradle-8.10.2-bin.zip`; documented mirror policy in Android/compliance/roadmap/runbook docs.
- Tests: `./gradlew -v` pass; `./gradlew help --no-daemon` pass from `android-native/android-app`.

### 2026-01-29 21:59 UTC - Run Start
- Operator: Codex
- Scope: documentation scaffolding, multi-page routing, guide page, header navigation, update roadmap.
- Notes: Update Run End entry when this run completes.

### 2026-01-29 23:38 UTC - Run End
- Summary: Added docs suite, multi-page routing, guide page, header navigation, and per-page hints modal.
- Changes: New `docs/` set, new `pages/` routes, header/hints components, spectator URL moved to `/spectator/:id`.
- Next: Local env setup, Prisma migrate, run QA, set production sync URL, add optional audio.

### 2026-01-30 00:06 UTC - Run Start
- Operator: Codex
- Scope: remove Google auth, add username login, add email server integration, update docs and roadmap.
- Notes: Update Run End entry when this run completes.

### 2026-01-30 03:04 UTC - Run End
- Summary: Replaced Google auth with username/email auth, added SMTP mailer, and provisioned VPS mail server.
- Changes: Updated Prisma schema, auth API/UI, mailer integration, and SMTP docs; configured Postfix/Dovecot with TLS for production mail relay.
- Next: Run `npm install`, create Prisma migration, set `.env.local` SMTP creds, and QA flows.

### 2026-01-30 07:31 UTC - Run Start
- Operator: Codex
- Scope: finish local setup, create Prisma migration, run QA smoke checks, add audio asset, and update docs.

### 2026-01-30 10:17 UTC - Run End
- Summary: Local environment completed, migration applied, audio asset generated, and smoke checks passed.
- Changes: Installed Postgres/ffmpeg, added `.env.local`, created audio asset, ran build + server smoke checks.
- Notes: `npm install` required longer runtime; Prisma migrate used local Postgres.

### 2026-01-30 11:53 UTC - Run Start
- Operator: Codex
- Scope: deploy production to VPS, configure Nginx + systemd, and verify live site.

### 2026-01-30 13:10 UTC - Run Start
- Operator: Codex
- Scope: finish VPS deploy (Node deps, Prisma migrate, build, systemd), verify SSL, and update docs.

### 2026-01-30 17:21 UTC - Run End
- Summary: Completed VPS deployment with Prisma migration, build, systemd services, and Nginx SSL proxy.
- Changes: Updated production `.env` DB URL encoding, manual Prisma engine install, Nginx config for `/api` + `/ws`, systemd units.
- Notes: API + sync servers running; site served at production HTTPS domain.

### 2026-01-30 18:18 UTC - Run Start
- Operator: Codex
- Scope: UI fixes (mobile + auth header), per-page hints, Persian copy cleanup, cache rules, verify auth storage.

### 2026-01-31 15:55 UTC - Run End
- Summary: Updated mobile-first UI, per-page hints, Persian copy, and caching; verified auth storage and re-deployed.
- Changes: Hidden header on auth, refreshed hints per page, refined UI text, service worker caching + Nginx cache headers, synced and rebuilt on VPS.
- Notes: Credentials stored as bcrypt hash in DB; cache headers verified on HTML/SW.

### 2026-01-31 17:15 UTC - Run Start
- Operator: Codex
- Scope: cache overhaul, remove custom keypad, mobile height reduction, autosave, superadmin role + protection.

### 2026-01-31 17:36 UTC - Run End
- Summary: Removed custom keypad, added autosave recovery, enhanced caching with TTL/half-life, and added superadmin role.
- Changes: Updated scoring inputs, mobile layout, service worker v3, Nginx cache headers, sync health endpoint, Prisma role migration.
- Notes: Superadmin account protected; `/api/users/me` deletion blocked for superadmin.

### 2026-01-31 18:14 UTC - Run Start
- Operator: Codex
- Scope: quick night mode, mobile-first redesign, header/theme fixes, cache re-evaluation, and polish.
- Notes: Update Run End entry when this run completes.

### 2026-02-01 07:00 UTC - Run End
- Summary: Added Quick Night mode, redesigned mobile UI, and upgraded cache trimming.
- Changes: New quick night setup, compact header/theme switcher, mobile-first scoring + spectator layout, cache v4 with trim/half-life, docs updated.
- Notes: Quick Night skips history persistence; deploy latest changes to VPS when ready.

### 2026-02-01 07:24 UTC - Run Start
- Operator: Codex
- Scope: deploy latest changes to VPS and verify live site.
- Notes: Update Run End entry when this run completes.

### 2026-02-01 07:31 UTC - Run End
- Summary: Deployed latest build and restarted services on VPS; verified live site headers.
- Changes: Synced app to `/var/www/morodomino/app`, built Vite, restarted `morodomino-api` and `morodomino-sync`.
- Notes: Verified HTML and SW headers; asset cache headers ok.

### 2026-02-01 07:58 UTC - Run Start
- Operator: Codex
- Scope: merge scoreboard + input, mobile header drawer, compact game header, QA sweep.
- Notes: Update Run End entry when this run completes.

### 2026-02-01 08:18 UTC - Run End
- Summary: Merged score display/input, added mobile drawer header, and ran QA (API + WS).
- Changes: New UI actions context, merged team cards, compact game header, spectator target removal, drawer menu with tools.
- Notes: QA results recorded; deployed build and restarted services.

### 2026-02-03 15:34 UTC - Run Start
- Operator: Codex
- Scope: remove گُفل feature everywhere, verify PWA coverage and report gaps.
- Notes: Update Run End entry when this run completes.

### 2026-02-03 18:07 UTC - Run End
- Summary: Removed گُفل feature, cleaned UI badges, and deployed to VPS.
- Changes: Removed blocked/atf logic and UI, deleted BlockedGameModal, updated docs, redeployed build.
- Notes: PWA audit performed; see response for gaps.

### 2026-02-03 20:20 UTC - Run Start
- Operator: Codex
- Scope: plan full PWA + native-feel + fast login features; update roadmap.
- Notes: Update Run End entry when this run completes.

### 2026-02-04 05:35 UTC - Run End
- Summary: Roadmap expanded with additional app-focused suggestions.
- Changes: Added security, session lock, export/import, crash reporting, feature flags, device revoke, soft-delete, diagnostics, accessibility, privacy screen.

### 2026-02-04 05:43 UTC - Run End
- Summary: Roadmap expanded with update center, background sync, encryption, admin analytics, and cleanup items.
- Changes: Added update center, background sync queue, client-side encryption option, superadmin audit dashboard, smart update UX, per-device settings, analytics, CDN asset versioning, timezone handling, and cache cleanup.

### 2026-02-04 05:47 UTC - Run End
- Summary: Roadmap expanded with status center, i18n readiness, keyboard UX, and accessibility items.
- Changes: Added status center, i18n prep, desktop keyboard controls, secure clipboard clear, global wake lock, storage quota warnings, telemetry toggle, accessibility mode, offline sync mode, and signed release notes.

### 2026-02-04 06:05 UTC - Run End
- Summary: Roadmap expanded with recovery mode, legal pages, and data retention items.
- Changes: Added local PIN, recovery mode, live error banner, legal pages, local-only toggle, retention policy, battery-aware mode, clipboard safety prompt, and help page.

### 2026-02-04 07:55 UTC - Run Start
- Operator: Codex
- Scope: implement roadmap items (stats pull-to-refresh, update center, back-button fix, auth rate limiting, passkey env/docs).
- Notes: Update Run End entry when this run completes.

### 2026-02-04 09:25 UTC - Run End
- Summary: Implemented roadmap UX/security items and refreshed docs; build passes.
- Changes: Added pull-to-refresh on stats, update center card in Guide, back-button exit guard scoped to root, auth rate limiting + login lockout, passkey env vars, Prisma client regenerate, updated docs (architecture/db/flows/runbook/files index + passkey API docs).
- Tests: `npm run build` (pass with chunk size warning).
- Notes: VPS SSH connection closes after key exchange; deployment blocked until SSH access is restored.

### 2026-02-04 10:48 UTC - Run Start
- Operator: Codex
- Scope: restrict score inputs to numeric keypad only.
- Notes: Update Run End entry when this run completes.

### 2026-02-04 10:48 UTC - Run End
- Summary: Score inputs now request numeric keypad on mobile.
- Changes: Score inputs switched to `type="tel"` with `inputMode="numeric"`, numeric pattern, and min/step hints.
- Tests: Not run.

### 2026-02-08 07:46 UTC - Run Start
- Operator: Codex
- Scope: remove all Gemini/AI code paths and references, validate auth/passkey/PWA behavior, and refresh docs.
- Notes: Update Run End entry when this run completes.

### 2026-02-08 08:04 UTC - Run End
- Summary: Fully removed Gemini/AI integrations from frontend/backend/dependencies and refreshed docs.
- Changes: Removed AI route/components/libs/server route, removed `@google/genai` dependency and env hooks, replaced night recap with local summary text, updated README and docs index/architecture/flows/files/structure/roadmap.
- Tests: `npm run build` (pass), `npx prisma validate` (pass), `npx prisma migrate deploy` (applied pending local migrations), API smoke (`/api/health`, register/login/me, passkey options) pass, PWA smoke (`/manifest.json`, `/sw.js`, `/offline.html`) pass.

### 2026-02-08 08:22 UTC - Run Start
- Operator: Codex
- Scope: complete local+VPS hardening pass (profile/settings, cross-platform PWA and passkey UX, cleanup, full validation, and deployment).
- Notes: Update Run End entry when this run completes.

### 2026-02-08 15:56 UTC - Run End
- Summary: Completed VPS deployment, cleaned runtime app path, and hardened passkey registration compatibility/error handling.
- Changes: Updated passkey auth options/verification policy in `server/api/routes/auth.js`, expanded passkey client error mapping in `lib/passkeys.ts`, bumped service-worker cache version to `v6`, redeployed to `/var/www/morodomino/app`, and cleaned VPS extras (`.git`, `.env.local`, transient caches).
- Tests: Local `npm run build` pass, local `npx prisma validate` pass, VPS `npm run build` pass, VPS Prisma migrate/generate pass, VPS API smoke (`/api/health`, register/login/me, passkey options, delete user) pass, VPS HTTPS asset smoke (`/manifest.json`, `/sw.js`, `/offline.html`) pass via local-resolve checks.

### 2026-02-08 17:18 UTC - Run Start
- Operator: Codex
- Scope: deep VPS-first feature verification from roadmap top-to-bottom, passkey-linking failure hardening, and runtime cleanup.
- Notes: Update Run End entry when this run completes.

### 2026-02-08 21:05 UTC - Run End
- Summary: Patched passkey-linking client/server compatibility, redeployed to VPS, and re-verified core app features directly against live services.
- Changes: Added passkey compatibility wrappers (`options` and `optionsJSON`) + richer ceremony error mapping in `lib/passkeys.ts`; corrected passkey auth option typing and verify inputs in `server/api/routes/auth.js`; rebuilt and redeployed to `/var/www/morodomino/app`; cleaned temporary deploy artifacts (`/var/www/morodomino/app.new`, `/root/morodomino-deploy.tgz`, temp WS scripts).
- Notes: During deploy, `.env` was removed by `rsync --delete`; recovered from running API process environment and restored at `/var/www/morodomino/app/.env`.
- Tests: Local `npm run build` pass, local `npx prisma validate` pass; VPS service status pass, HTTPS route and PWA asset checks pass, auth/profile/password/passkey options/list checks pass, players/history CRUD checks pass, account delete pass, spectator WebSocket sync pass.

### 2026-02-09 03:08 UTC - Run Start
- Operator: Codex
- Scope: investigate remaining passkey-linking failures from profile/settings, harden reliability, redeploy VPS, and prepare migration/admin architecture analysis.
- Notes: Update Run End entry when this run completes.

### 2026-02-09 03:47 UTC - Run End
- Summary: Improved passkey-linking UX/reliability (no silent failures, longer ceremony windows), upgraded `@simplewebauthn/*` to v13, and redeployed to VPS.
- Changes: Increased WebAuthn timeout and challenge TTL in `server/api/routes/auth.js`; improved passkey link state reconciliation in `context/AuthContext.tsx`; fixed passkey prompt behavior/toasts in `components/PasskeyPromptModal.tsx`; refined cancel/timeout wording in `lib/passkeys.ts`; upgraded `@simplewebauthn/browser` and `@simplewebauthn/server` to `^13.2.2`.
- Tests: Local `npm run build` pass; VPS `npm install`, `npx prisma migrate deploy`, `npx prisma generate`, `npm run build` pass; VPS service restart pass; VPS health/routes/PWA/passkey-options smoke pass.

### 2026-02-09 03:47 UTC - Run Start
- Operator: Codex
- Scope: force installed-client refresh to pick up passkey fixes and redeploy cache update safely.
- Notes: Update Run End entry when this run completes.

### 2026-02-09 04:02 UTC - Run End
- Summary: Forced SW cache version refresh (`v7`) and redeployed to ensure installed clients load the latest passkey code.
- Changes: Bumped `public/sw.js` cache version from `v6` to `v7`, rebuilt, redeployed to VPS, and restarted services.
- Tests: VPS `sw.js` serves `CACHE_VERSION = 'v7'`; health/routes/PWA asset checks pass.

### 2026-02-09 04:29 UTC - Run Start
- Operator: Codex
- Scope: update roadmap with full strategic plans for (1) Next.js full-stack migration and (2) separate admin app on `mdadmin`.
- Notes: Update Run End entry when this run completes.

### 2026-02-09 04:29 UTC - Run End
- Summary: Roadmap expanded with detailed phased plans for full-stack migration and admin control-plane app.
- Changes: Added strategic architecture, phased rollout, quality gates, risks/mitigations, RBAC model, admin modules, and delivery phases to `docs/ROADMAP.md`.
- Tests: Documentation update only (no runtime/code changes).

### 2026-02-09 04:29 UTC - Run Start
- Operator: Codex
- Scope: expand both strategic plans further and convert them into an execution backlog with sprint sequencing and gate criteria.
- Notes: Update Run End entry when this run completes.

### 2026-02-09 04:40 UTC - Run End
- Summary: Roadmap significantly expanded with advanced architecture/operations/security coverage and a full integrated backlog.
- Changes: Added non-functional targets, data evolution strategy, DevEx/CI governance, QA/release governance, cost/ops planning, admin security/audit/governance extensions, detailed track backlogs (P0/A/B), sprint plan, and cross-track gates in `docs/ROADMAP.md`.
- Tests: Documentation update only (no runtime/code changes).

### 2026-02-22 09:29 UTC - Run Start
- Operator: Codex
- Scope: deploy current Dominoyar stack to new VPS/domain (`dominoyar.ir`) in full isolation, clean runtime files, and verify passkey/PWA/auth flows.
- Notes: Keep existing `ariadashboard` workloads untouched; use separate path, DB, services, and nginx site.

### 2026-02-22 10:14 UTC - Run End
- Summary: New isolated deployment completed on new VPS with HTTPS, dedicated services/database, and fixed passkey options runtime on Node 18.
- Changes: Added new SSH host alias (`ariadashboardssh`) in `/mnt/c/Projects/morodomino/ssh_config`; deployed app to `/var/www/morodomino/app`; created Postgres role+DB `morodomino_app`; created systemd services `morodomino-domino-api` and `morodomino-domino-sync`; added nginx site `morodomino-domino.conf` for `dominoyar.ir` and `www.dominoyar.ir`; issued Let’s Encrypt cert; patched `server/api/routes/auth.js` to provide `globalThis.crypto` via `node:crypto` on Node 18 for `@simplewebauthn/server`.
- Cleanup: Removed temporary deploy script/pid files; normalized file permissions under `/var/www/morodomino` (removed world-writable modes from rsync artifact).
- Tests: VPS health checks pass (`/api/health`, sync `/health`), auth register/login/me pass, passkey options endpoints pass (login/register options both 200 + valid payload), PWA smoke pass (`/manifest.json`, `/sw.js`, `/offline.html` all 200 with offline fallback logic present), public app route returns 200 over HTTPS.

### 2026-02-22 19:32 UTC - Run Start
- Operator: Codex
- Scope: execute deployment directly (no user-side scripts), fix failing deploy checks, and verify live parity/safety requirements.
- Notes: Focus on real blockers from failed script runs (`--no-hints` and false nginx health failures).

### 2026-02-22 20:22 UTC - Run End
- Summary: Deployed and validated directly on VPS; fixed runtime outage cause (`dist` missing), removed false script failure conditions, and confirmed passkey removal/immortal account protections.
- Changes: Rebuilt on VPS (`npm ci`, `prisma migrate deploy`, `prisma generate`, `vite build`), restarted `morodomino-domino-api`/`morodomino-domino-sync`/`nginx`, and hardened `scripts/deploy_to_aria_vps.sh` (release-path build/promotion, strict checks, removed invalid Prisma flags).
- Tests: Live checks passed for `/`, `/api/health`, `/manifest.json`, `/sw.js`, `/offline.html`; `/api/auth/passkey/login/options` returns `404`; immortal login works and delete returns `403`; sync server `/health` returns `200`; local+VPS critical file hashes match.

### 2026-02-22 20:22 UTC - Run Start
- Operator: Codex
- Scope: enforce new-domain-only config and immortal credential persistence; remove old-domain runtime fallback and sync updates to VPS.
- Notes: User requested no reliance on old domain and strict retention of immortal account credentials.

### 2026-02-22 20:42 UTC - Run End
- Summary: Enforced `ariaprojectsdashboard.ir` as active domain baseline in runtime/config docs and re-synced VPS directly.
- Tests: Local `npm run build` pass; local `npx prisma validate` pass; VPS service status active; `/api/health`, `/manifest.json`, `/sw.js`, `/offline.html` reachable on new domain; passkey endpoint remains `404`.

### 2026-02-22 20:50 UTC - Run Start
- Operator: Codex
- Scope: execute VPS deployment directly (no user-side script execution), validate new-domain-only operation, and re-verify immortal credential protection.
- Notes: User required full direct execution and strict new-domain baseline.

### 2026-02-22 20:55 UTC - Run End
- Summary: Direct deployment completed successfully to `dominoyar.ir` with post-deploy credential and domain checks passing.
- Changes: Ran `scripts/deploy_to_aria_vps.sh` end-to-end (package/upload/release build/promote/restart/smoke), removed stale old-domain mentions from `docs/PROJECT_LOG.md`, and revalidated VPS `.env` domain + `IMMORTAL_*` values.
- Tests: Local `npm run build` pass; local `npx prisma validate` pass; deploy smoke pass (`/`, `/api/health`, `/manifest.json`, `/sw.js`, `/offline.html`, passkey endpoint `404`, Tailwind CDN absent, logo reference present); immortal login `200`, `/api/auth/me` `200`, protected delete `/api/users/me` `403`.

### 2026-02-22 20:56 UTC - Run Start
- Operator: Codex
- Notes: User requested to avoid shared `mail.ariaprojectsdashboard.ir`.

### 2026-02-22 21:02 UTC - Run End
- Summary: SMTP endpoint moved to app-specific subdomain settings and VPS runtime updated without downtime.
- Tests: Service status active after restart; public checks pass (`/api/health` `200`, `/manifest.json` `200`, `/sw.js` `200`).

### 2026-02-22 21:18 UTC - Run Start
- Operator: Codex

### 2026-02-22 21:29 UTC - Run End

### 2026-02-24 22:53 UTC - Run Start
- Operator: Codex
- Scope: implement Wave 1 end-to-end (auth/session/security hardening + devops/release automation), validate local and VPS parity, and publish Wave 1 signoff artifacts.
- Notes: Update Run End entry when this run completes.

### 2026-02-24 23:00 UTC - Run End
- Summary: Wave 1 implemented end-to-end with backend security models/flows, frontend security controls, hardened deploy/rollback automation, domain parity checks, and Wave 1 artifact signoff.
- Changes:
  - Backend/security: added `SecurityEvent` and `RecoveryRequest` models, session trust metadata (`deviceLabel`, `isTrusted`), suspicious login risk scoring and event logging, recovery request endpoint, and API security headers.
  - Frontend/security UX: added recovery request form on login, session trust/label controls, security event timeline, and recovery request history in profile.
  - Ops/release: replaced deploy flow with preflight + retry + release promotion + rollback snapshot + synthetic + parity gates; added scripts for preflight/env contract, rollback, TLS/DNS audit, synthetic probes, DR backup/restore verification, and local-vs-VPS parity.
  - Documentation/artifacts: updated roadmap status and runbook/index files; added `docs/roadmaps/artifacts/wave1-gate-status.json` and `docs/roadmaps/artifacts/wave1-implementation-signoff.md`.
- Tests:
  - Local: `npm run build` pass; `npx prisma validate` pass; local auth/session/recovery smoke pass; PWA asset checks pass; security header checks pass; responsive sweep `60` checks with `0` overflow failures via Playwright (`test-results/wave1-responsive/report.json`).
  - VPS/domain: `bash scripts/deploy_to_aria_vps.sh` pass (after transient SCP retry); synthetic probe pass; parity pass; live auth/session/recovery smoke pass; TLS/DNS audit pass; DR backup/restore verification pass; rollback drill executed and latest release redeployed.

### 2026-02-22 21:35 UTC - Run Start
- Operator: Codex
- Scope: fix UX issues (update banner control, remember-me UI, desktop header cleanup, theme toggle polish, settings/profile labels, session management), improve PWA install/update behavior, and redeploy.
- Notes: Includes backend session tracking implementation for per-device control.

### 2026-02-22 22:18 UTC - Run End
- Summary: Implemented full session management and major UX/PWA fixes from user QA list; local build and API smoke are green.
- Changes: Added `Session` model/migration and token-bound session validation; added login Remember Me checkbox and persistent preference; added auth logout endpoint; added session list/revoke/revoke-others APIs and profile UI controls; restricted immortal delete warning visibility to immortal account UI state; refactored header to reduce desktop clutter with unified drawer; redesigned theme toggle; improved update banner to require explicit user action; removed forced SW skipWaiting on install and gated reload to explicit update apply; added manual update checks in settings/install guide; added mobile quick submit actions near score entry; added stronger PWA manifest icon coverage for iOS/Android.
- Tests: `npm run build` pass; `npx prisma validate` pass; `npx prisma generate` pass; `npx prisma migrate deploy` pass (local); local API smoke pass (`/api/health`, register/login/me, sessions list/revoke-others, delete non-immortal, immortal delete block `403`).

### 2026-02-22 22:24 UTC - Run Start
- Operator: Codex
- Scope: finalize the 13-item UX/PWA/session checklist, run responsive UI verification, deploy to `dominoyar.ir`, and confirm live SSL/domain health.
- Notes: Keep deployment fully direct from local (no user-side command execution).

### 2026-02-22 23:24 UTC - Run End
- Summary: Completed and deployed final UX/PWA/session refinements; live domain checks are green and SSL is valid.
- Changes: Polished desktop/game header density with compact gameplay mode; improved theme toggle visuals; added API compression and frontend API timeout/reachability handling; verified remember-me/session controls and non-immortal vs immortal account safeguards; ensured update flow remains user-controlled; deployed to VPS with migration/build/restart and live smoke checks.
- Tests: Local `npm run build` pass; local `npx prisma validate` pass; local API smoke pass (`/api/health`, register/login/me, sessions, revoke-others, delete user, passkey endpoint `404`, TTL 7/30 days); local PWA smoke pass (`manifest/sw/offline` + no install `beforeinstallprompt+preventDefault` pattern); responsive UI smoke via Playwright screenshots (`/tmp/moro-ui-desktop-mode.png`, `/tmp/moro-ui-desktop-settings.png`, `/tmp/moro-ui-desktop-profile.png`, `/tmp/moro-ui-mobile-scoring.png`); deploy script pass; live checks pass (`/api/health`, `/manifest.json`, `/sw.js`, `/offline.html`, passkey endpoint `404`); live UI smoke pass (`REMEMBER_VISIBLE=true`, `SETTINGS_UPDATE_BUTTON=true`, `PROFILE_SESSIONS_SECTION=true`, `MOBILE_SUBMIT_VISIBLE=true`); TLS cert valid for `dominoyar.ir` (Let’s Encrypt, expiry `2026-05-23`).

### 2026-02-23 00:00 UTC - Run Start
- Operator: Codex
- Scope: verify and harden all outstanding UX/PWA/session/responsive requests across local+VPS, run parity checks, and replace monolithic roadmap with hierarchical topic/mini-roadmaps plus contracts.
- Notes: User requested web-researched roadmap expansion and explicit local-vs-live validation.

### 2026-02-23 00:57 UTC - Run End
- Summary: Completed code hardening, full local/live responsive and feature parity checks, deployed to `dominoyar.ir`, and migrated roadmap docs to a hierarchical multi-file system with research-backed tracks.
- Changes:
  - UI/UX: simplified header to drawer-first navigation, compact scoring header polish, improved theme toggle, responsive fixes in mode/history/stats/profile/settings, and mobile scoring submit ergonomics (inline submit near inputs, reduced duplicate action clutter).
  - Settings/Profile: added actionable server-health check in settings sync section; enriched session cards with device-type labels; kept immortal-only deletion warning visibility.
  - PWA: retained explicit user-controlled update flow, bumped SW cache version to `v10`, and preserved cross-platform install guidance.
  - Docs: replaced `docs/ROADMAP.md` monolith with hierarchical `docs/roadmaps/*` (topic roadmaps, mini-roadmaps, contracts, legacy snapshot).
- Tests:
  - Baseline: `git status --short --branch`; `npm run build` pass; `npx prisma validate` baseline fail without exported `DATABASE_URL` (expected).
  - Final local: `npm run build` pass; `set -a && source .env.local && npx prisma validate` pass; API smoke pass (`register/login/me/sessions/revoke-others`, passkey endpoint `404`); PWA smoke pass (`manifest/sw/offline` all `200`, SW cache `v10`).
  - Responsive QA: automated Playwright multi-viewport scans local and live with zero horizontal overflow on core routes; scoring inline submit visible on mobile.
  - Local-vs-live parity: check set diff count `0` across remember-me visibility, settings controls, profile labels/session section, scoring mobile submit, overflow checks, and header nav density.
  - Deployment: `bash scripts/deploy_to_aria_vps.sh` pass (build/migrate/restart/smoke all green).

### 2026-02-23 02:52 UTC - Run Start
- Operator: Codex
- Scope: deeply expand hierarchical roadmap system with implementation-aware gap analysis and primary-source research across PWA, auth/security, responsive UX, performance, product surface, DevOps, automation, and strategy.
- Notes: Update Run End entry when this run completes.

### 2026-02-23 03:06 UTC - Run End
- Summary: Fully expanded all hierarchical roadmaps and mini-roadmaps with implementation-checked baselines, deep source-backed constraints, and advanced execution tracks.
- Changes: Rewrote `docs/roadmaps/README.md`, all topic READMEs (`01`..`09`), all mini-roadmaps, and all contract files; updated roadmap index (`docs/ROADMAP.md`) and docs metadata (`docs/README.md`, `docs/FILES_INDEX.md`, `docs/STRUCTURE.md`).
- Tests: `npm run build` (pass), `npx prisma validate` (baseline fail without env: missing `DATABASE_URL`), `set -a; source .env.local; set +a; npx prisma validate` (pass).

### 2026-02-23 06:48 UTC - Run Start
- Operator: Codex
- Scope: repeat and deepen roadmap expansion with additional online research, include implemented-feature audits, add new mini-roadmaps/contracts, and broaden advanced/future feature proposals.
- Notes: Update Run End entry when this run completes.

### 2026-02-23 07:13 UTC - Run End
- Summary: Completed a second full expansion of the roadmap system with additional contracts, new mini-roadmaps, and deeper implementation-vs-research coverage across all topics.
- Tests: `npm run build` (pass), `npx prisma validate` baseline (fails without `DATABASE_URL`), `set -a; source .env.local; set +a; npx prisma validate` (pass).

### 2026-02-23 07:26 UTC - Run Start
- Operator: Codex
- Scope: lock recommended roadmap decisions, prepare implementation-ready sequencing for all topic/mini-roadmaps, and publish ordered execution map without starting feature implementation.
- Notes: Documentation-only planning run.

### 2026-02-23 07:34 UTC - Run End
- Summary: Accepted all recommended roadmap options as default baseline, finalized implementation-ready sequencing, and reordered roadmap execution via a dedicated plan file.
- Changes: Added `docs/roadmaps/IMPLEMENTATION_ORDER.md`; updated roadmap indexes and contracts linkage; expanded planning coverage and ordering without starting feature implementation.
- Tests: Documentation planning run (no runtime feature implementation). Validation commands not required for docs-only changes.

### 2026-02-23 20:58 UTC - Run Start
- Operator: Codex
- Scope: expand hierarchical roadmap system with alliance/shared-identity program (cross-account family stats) and reorder execution; exclude gameplay-rule changes.
- Notes: Research-backed planning run only (no feature implementation).

### 2026-02-23 21:15 UTC - Run End
- Summary: Added a full alliance/shared-identity roadmap topic with implementation-ready mini-roadmaps and reordered global execution to land data/auth foundations before UX/perf waves.
- Changes: Added `docs/roadmaps/10-alliance-shared-identity/*` (identity model, membership/invites/claims, shared-stats migration, API auth+encryption, UX/UI, sync+observability); updated indexes (`docs/ROADMAP.md`, `docs/roadmaps/README.md`), reordered execution (`docs/roadmaps/IMPLEMENTATION_ORDER.md`), and refreshed docs metadata (`docs/README.md`, `docs/FILES_INDEX.md`, `docs/STRUCTURE.md`, `docs/roadmaps/06-product-surface/README.md`).
- Research: Extended primary-source set for this program (PostgreSQL RLS/materialized views, OWASP cryptographic storage, OpenFGA/Zanzibar, RFC 7232, RFC 9562, Socket.IO room/redis scaling, Firebase account linking/offline behavior, GitHub org role/invite patterns).
- Tests: Documentation planning run; index/path consistency checks executed (`rg` + file existence scan). Runtime build/deploy not required for docs-only changes.

### 2026-02-24 07:12 UTC - Run Start
- Operator: Codex
- Scope: update hierarchical roadmap with alliance/world/chat/offline research and recommendations; make all roadmap topics implementation-ready; reorder global execution.
- Notes: Keep login/register and Quick Night continuity, no gameplay-rule changes.

### 2026-02-24 07:45 UTC - Run End
- Summary: Expanded roadmap system with implementation-ready alliance/world/chat/offline tracks, updated cross-topic constraints (UX/UI/security/encryption/logic/performance/ops), and reordered execution waves.
- Changes:
  - Added roadmap topic expansion files under `docs/roadmaps/10-alliance-shared-identity/`:
    - `match-scope-alliance-world-local.md`
    - `online-connectivity-and-lobby-architecture.md`
    - `chat-capability-and-moderation.md`
    - `offline-survivability-and-continuity.md`
  - Upgraded existing topic 10 mini-roadmaps with implementation packets (schema/API/migration/security/event contracts).
  - Added global implementation readiness matrix: `docs/roadmaps/IMPLEMENTATION_READINESS.md`.
  - Reordered global execution: `docs/roadmaps/IMPLEMENTATION_ORDER.md`.
  - Updated indexes and metadata: `docs/ROADMAP.md`, `docs/roadmaps/README.md`, `docs/README.md`, `docs/FILES_INDEX.md`, `docs/STRUCTURE.md`.
  - Updated cross-topic readiness links and constraints across topics 02/03/04/05/06/07/08/09.
  - Updated contracts for continuity and no-regression gates (`C11`) and release-gate checks.
- Research: Expanded source base with Open Match, OWASP WebSocket/Logging, RFC 6455/8445/8831, RFC 7232/9562, MDN storage quota/persist/background sync, web.dev offline fallback, Prisma expand-contract + OCC, libsodium key exchange, PostgreSQL RLS/materialized views.
- Tests: `npm run build` (pass), `npx prisma validate` baseline (fails without `DATABASE_URL`), final `set -a; source .env.local; set +a; npx prisma validate` (pass), roadmap index/path consistency checks (`rg` + file existence scan) pass.

### 2026-02-24 08:10 UTC - Run Start
- Operator: Codex
- Scope: finalize all hierarchical roadmap files, stamp implementation-readiness across all mini-roadmaps, and close planning loop.
- Notes: Documentation-only pass; no feature implementation in this run.

### 2026-02-24 08:34 UTC - Run End
- Summary: Finalized roadmap system and marked every mini-roadmap as implementation-ready with explicit execution/verification/exit-artifact requirements.
- Changes:
  - Added `Implementation-Ready Finalization (2026-02-24)` section to all mini-roadmap/topic files under `docs/roadmaps/*/*.md` (excluding contracts/legacy), total `54` files.
  - Updated top-level planning state files: `docs/roadmaps/IMPLEMENTATION_READINESS.md`, `docs/roadmaps/IMPLEMENTATION_ORDER.md`, and roadmap index timestamps in `docs/ROADMAP.md`.
  - Updated documentation timestamps in `docs/README.md`, `docs/FILES_INDEX.md`, `docs/STRUCTURE.md`.
- Verification:
  - Roadmap stamp coverage check: `54/54` files.
  - Index/path consistency check: pass.
  - Runtime checks: `npm run build` pass; baseline `npx prisma validate` fails without exported `DATABASE_URL` (expected); final `set -a; source .env.local; set +a; npx prisma validate` pass.

### 2026-02-24 17:10 UTC - Run Start
- Operator: Codex
- Scope: implement Wave 0 governance end-to-end with executable tooling, registry automation, metadata enforcement, CI gate, and signoff artifacts.
- Notes: No feature-wave implementation beyond Wave 0 governance in this run.

### 2026-02-24 17:41 UTC - Run End
- Summary: Wave 0 implemented end-to-end with passing governance gates and generated signoff artifacts.
- Changes:
  - Added Wave 0 tooling under `scripts/roadmap/`:
    - `normalize-metadata.mjs`
    - `generate-registry.mjs`
    - `check-registry.mjs`
    - `check-metadata.mjs`
    - `check-index.mjs`
    - `run-wave0.mjs`
  - Added machine-readable registry: `docs/roadmaps/registry.json`.
  - Added governance artifacts: `docs/roadmaps/artifacts/wave0-gate-status.json`, `docs/roadmaps/artifacts/wave0-governance-signoff.md`.
  - Added CI enforcement workflow: `.github/workflows/roadmap-wave0.yml`.
  - Added npm scripts for Wave 0 gates and validators in `package.json`.
  - Updated governance docs to reflect implemented automation:
    - `docs/roadmaps/01-foundation/README.md`
    - `docs/roadmaps/01-foundation/roadmap-registry-and-governance.md`
    - `docs/roadmaps/contracts/roadmap-registry-contract.md`
    - top-level roadmap docs now include required metadata sections.
  - Updated docs indexes/runbook and run timestamps.
- Tests:
  - Baseline: `git status --short --branch` captured dirty tree baseline.
  - `npm run build` pass.
  - `npx prisma validate` baseline fail without exported `DATABASE_URL` (expected).
  - `set -a && source .env.local && set +a && npx prisma validate` pass.
  - `npm run roadmap:wave0` pass.
  - Wave 0 gate results: G0 PASS, G1 PASS, G2 PASS, G6 PASS; contracts C1/C9/C10 PASS.

### 2026-02-24 23:15 UTC - Run Start
- Operator: Codex
- Scope: continue Wave 1 with final verification sweep (local build/Prisma, responsive automation, roadmap gates, VPS parity, TLS/domain, DR) and close docs.
- Notes: Verification-only continuation; no new feature implementation.

### 2026-02-24 23:23 UTC - Run End
- Summary: Wave 1 continuation verified end-to-end with local and live gates green; docs/state refreshed.
- Changes:
  - Re-ran governance and roadmap consistency gates (`normalize`, `registry generate/check`, `metadata check`, `index check`).
  - Re-ran responsive contract sweep using live local API + preview (`tests/w1-responsive.spec.js`), pass.
  - Re-ran live synthetic probe, local-vs-VPS parity, TLS/domain audit, and DR backup/restore verification.
  - Updated run timestamps and status in `docs/README.md` and `docs/ROADMAP.md`.
- Tests:
  - Local: `npm run build` pass; `set -a; source .env.local; set +a; npx prisma validate` pass.
- Responsive: Playwright sweep pass (`1` test, `60` viewport-route checks, no overflow failures).
- Governance/docs: roadmap checks pass.
- VPS/domain: `npm run ops:synthetic` pass; `npm run ops:parity:vps` pass; `npm run ops:tls:audit` pass; `npm run ops:dr:verify` pass.

### 2026-02-25 01:15 UTC - Run Start
- Operator: Codex
- Scope: implement Wave 2 end-to-end (identity/scope foundation) with schema, APIs, dual-write continuity, backfill/parity/smoke tooling, and live deployment verification.
- Notes: Close all Wave 2 gaps and publish gate/signoff artifacts.

### 2026-02-25 01:37 UTC - Run End
- Summary: Wave 2 implemented end-to-end and validated locally plus on production domain without regressions.
- Changes:
  - Added Wave 2 schema and migrations for alliance/shared-identity foundation:
    - `prisma/migrations/20260224233718_wave2_alliance_identity_scope/migration.sql`
    - `prisma/migrations/20260225002953_wave2_alliance_fk_hardening/migration.sql`
  - Added backend alliance runtime and APIs:
    - `server/api/allianceRuntime.js`
    - `server/api/routes/alliances.js`
    - mounted in `server/api/index.js`
  - Added continuity-safe integration into legacy flows:
    - personal-alliance bootstrap on auth (`server/api/routes/auth.js`)
    - players/history dual-write bridge (`server/api/routes/players.js`, `server/api/routes/history.js`)
    - account deletion ownership guard (`server/api/routes/users.js`)
  - Added Wave 2 ops scripts and deploy integration:
    - `scripts/ops/wave2_backfill_alliance.mjs`
    - `scripts/ops/wave2_parity_report.mjs`
    - `scripts/ops/wave2_smoke.mjs`
    - updates in deploy/preflight/synthetic/parity scripts
  - Added Wave 2 signoff artifacts:
    - `docs/roadmaps/artifacts/wave2-gate-status.json`
    - `docs/roadmaps/artifacts/wave2-implementation-signoff.md`
  - Updated docs/index/runbook/architecture/db/roadmap status for Wave 2 completion.
- Tests:
  - Local: `npm run build` pass.
  - Local: `set -a; source .env.local; set +a; npx prisma validate` pass.
  - Local: `npm run ops:wave2:backfill:dry` pass.
  - Local: `npm run ops:wave2:backfill:apply` pass.
  - Local: `npm run ops:wave2:parity` pass (`mismatchCount=0`).
  - Local: `WAVE2_BASE_URL=http://127.0.0.1:4000 npm run ops:wave2:smoke` pass.
  - Responsive regression: `npx playwright test tests/w1-responsive.spec.js` pass (`1` test, `60` checks, `0` overflow).
  - VPS deploy: `npm run ops:deploy:vps` pass (`DEPLOY_RESULT=PASS`).
  - Live verification: `npm run ops:synthetic` pass, `npm run ops:parity:vps` pass, `npm run ops:tls:audit` pass, `npm run ops:dr:verify` pass.

### 2026-02-25 15:07 UTC - Run Start
- Operator: Codex
- Scope: close Wave 3 runbook/docs loop, verify Wave 3 artifacts, and run a final local validation snapshot.
- Notes: Continuation run to finalize documentation completeness after successful Wave 3 implementation/deploy.

### 2026-02-25 15:12 UTC - Run End
- Summary: Wave 3 closure run completed with missing project-log coverage restored and final validation snapshot green.
- Changes:
  - Added missing Wave 3 closure entries to `docs/PROJECT_LOG.md`.
  - Revalidated Wave 3 artifacts and roadmap status references (`docs/ROADMAP.md`, `docs/README.md`, `docs/roadmaps/IMPLEMENTATION_ORDER.md`).
- Tests:
  - `npm run build` pass.
  - `set -a; source .env.local; set +a; npx prisma validate` pass.
  - `node scripts/ops/validate_env_contract.mjs --file=.env.local` pass (`ENV_CONTRACT=PASS`).
  - `bash scripts/ops/local_vs_vps_parity.sh` pass (`PARITY_RESULT=PASS`).

### 2026-02-25 15:49 UTC - Run Start
- Operator: Codex
- Scope: implement Wave 4 end-to-end (UX/Product integration across responsive/web/PWA), including alliance UI surface, scope-aware history/stats, trust/export controls, verification artifacts, and VPS rollout.
- Notes: Source of fix is local repo first; VPS deployment and domain verification follow after local validation.

### 2026-02-26 05:18 UTC - Run Start
- Operator: Codex
- Scope: resume interrupted Wave 4 deployment continuation, clear stale local processes, run local-vs-VPS parity, sync local -> VPS, and complete live verification.
- Notes: Use direct basic SSH path to `root@5.159.49.125` with key from `keys2` and explicit retry/timeouts.

### 2026-02-26 05:35 UTC - Run End
- Summary: Wave 4 continuation deployment completed successfully; VPS is now synchronized with local for tracked Wave 4 files and live checks are green.
- Changes:
  - Cleared lingering stuck SSH/parity process from prior interrupted run.
  - Packed current local workspace archive and uploaded to VPS (`/tmp/morodomino-wave4-sync.tgz`) with hash verification.
  - Performed release-path build/migrate/generate/backfill/parity on VPS and promoted to `/var/www/morodomino/app`.
  - Restarted services: `morodomino-domino-api`, `morodomino-domino-sync`, `nginx`.
- Tests:
  - Local: `npm run build` pass.
  - Local: `set -a; source .env.local; set +a; npx prisma validate` pass.
  - Local env contract: `node scripts/ops/validate_env_contract.mjs --file=.env.local` pass.
  - VPS deploy result: `DEPLOY_RESULT=PASS` (includes `wave2_smoke`, `wave3_smoke`, `wave4_smoke` passing on domain).
  - Local-vs-VPS hash parity: `PASS` for Wave parity file set.
  - VPS endpoint checks: `/api/health` 200, `manifest.json` 200, `sw.js` 200, `offline.html` 200, `passkey login options` 404 (expected), `/api/realtime/health` 401, `/api/users/me/export` 401.
  - Local endpoint spot checks: same status codes pass with retry-safe probes.

### 2026-02-26 06:10 UTC - Run Start
- Operator: Codex
- Scope: add user avatar subsystem (profile upload/update) and 2v2 teamup analytics without regressing alliance/wave behavior; validate local and sync/deploy to VPS.
- Notes: additive implementation only (no gameplay rule changes, no quick-night/auth regressions).

### 2026-02-26 06:38 UTC - Run End
- Summary: user avatars and alliance 2v2 teamup analytics are implemented, validated locally, deployed to VPS, and parity is green.
- Changes:
  - Added `User.avatar` schema field and migration:
    - `prisma/schema.prisma`
    - `prisma/migrations/20260226103000_wave4_user_avatar/migration.sql`
  - Added avatar support in auth/users API responses and profile update validation:
    - `server/api/routes/auth.js`
    - `server/api/routes/users.js`
  - Added profile avatar upload UX with client-side image normalization/compression:
    - `pages/ProfilePage.tsx`
    - `lib/account.ts`
    - `types.ts`
  - Added header user avatar rendering:
    - `components/AppHeader.tsx`
    - `App.tsx`
  - Added derived 2v2 teamup analytics in alliance stats response and UI surface:
    - `server/api/routes/alliances.js`
    - `lib/alliance.ts`
    - `components/Stats.tsx`
  - Hardened deploy smoke default for Wave 3 WS URL to include `/sync`:
    - `scripts/deploy_to_aria_vps.sh`
- Tests:
  - Local: `npm run build` pass.
  - Local: `set -a; source .env.local; set +a; npx prisma generate` pass.
  - Local: `set -a; source .env.local; set +a; npx prisma migrate deploy` pass (applied `20260226103000_wave4_user_avatar`).
  - Local: `set -a; source .env.local; set +a; npx prisma validate` pass.
  - Local API smoke: register + profile avatar patch + alliance history insert + `/api/alliances/:id/stats` teamups check pass.
  - VPS deploy: `npm run ops:deploy:vps` reached promote/synthetic/parity with pass; built-in wave3 smoke failed due WS URL mismatch (`200` non-upgrade), then rerun with explicit `WAVE3_SYNC_URL=wss://dominoyar.ir/sync` passed.
  - VPS smoke: `node scripts/ops/wave4_smoke.mjs` with `WAVE4_BASE_URL=https://dominoyar.ir` pass.
  - Live targeted smoke: register + avatar patch + alliance history create + teamup stats payload on domain pass (`teamups.length > 0`).
  - Domain synthetic: `npm run ops:synthetic` pass.
  - Final local-vs-VPS parity: `npm run ops:parity:vps` pass.

### 2026-02-26 07:05 UTC - Run Start
- Operator: Codex
- Scope: expand roadmap coverage for household/family subgroups inside alliance model and wire new item into hierarchical roadmap indexes.
- Notes: planning/docs update only; no runtime feature implementation in this sub-run.

### 2026-02-26 07:08 UTC - Run End
- Summary: household/family subgroup roadmap is now implementation-ready and fully indexed.
- Changes:
  - Added new mini-roadmap:
    - `docs/roadmaps/10-alliance-shared-identity/household-subgroups-and-cross-family-play.md`
  - Updated indexes and readiness/order metadata:
    - `docs/roadmaps/10-alliance-shared-identity/README.md`
    - `docs/ROADMAP.md`
    - `docs/roadmaps/IMPLEMENTATION_ORDER.md`
    - `docs/roadmaps/IMPLEMENTATION_READINESS.md`
    - `docs/roadmaps/README.md`
    - `docs/roadmaps/registry.json`
- Tests:
  - `npm run roadmap:registry:generate` pass (`REGISTRY_ENTRIES=66`).
  - `npm run roadmap:registry:check` pass.
  - `npm run roadmap:metadata:check` pass (`METADATA_FILE_COUNT=58`).
  - `npm run roadmap:index:check` pass (`ROADMAP_INDEX_REF_COUNT=76`).

### 2026-02-26 07:39 UTC - Run Start
- Operator: Codex
- Scope: continue from household subsystem partial state, finish end-to-end wiring (backend filters + client types/APIs + alliance/history/stats UI), then validate without regression.
- Notes: additive rollout only; login/register and quick night must remain unchanged.

### 2026-02-26 07:54 UTC - Run End
- Summary: household/family subgroup baseline is now fully implemented and validated locally end-to-end.
- Changes:
  - Completed household filter integration in alliance APIs:
    - `server/api/routes/alliances.js` (`history` and `stats` now accept `householdId` and return selected household metadata)
  - Added household client contracts and API helpers:
    - `types.ts`
    - `lib/alliance.ts`
  - Added household UI and management flows:
    - `pages/AlliancePage.tsx` (create subgroup, activate/deactivate, assign/remove users and players, set primary memberships)
    - `components/History.tsx` (household filter)
    - `components/Stats.tsx` (household filter)
  - Updated roadmap item snapshot to reflect implemented baseline:
    - `docs/roadmaps/10-alliance-shared-identity/household-subgroups-and-cross-family-play.md`
  - Applied new schema migration:
    - `prisma/migrations/20260226122000_wave5_household_subgroups/migration.sql`
- Tests:
  - `npm run build` pass.
  - `npx prisma validate` baseline fail expected without exported `DATABASE_URL`.
  - `set -a; source .env.local; set +a; npx prisma validate` pass.
  - `set -a; source .env.local; set +a; npx prisma migrate deploy && npx prisma generate` pass (applied household migration).
  - Local API household smoke pass: auth -> alliance -> household create -> player assign -> `history/stats?householdId` 200 with household metadata.
  - `npm run ops:wave2:smoke` pass.
  - `WAVE3_BASE_URL=http://127.0.0.1:4000 WAVE3_SYNC_URL=ws://127.0.0.1:8080 npm run ops:wave3:smoke` pass.

### 2026-02-26 07:56 UTC - Run Start
- Operator: Codex
- Scope: sync local -> VPS for household subgroup implementation, then verify parity and live production smokes.
- Notes: maintain zero-downtime promotion flow and non-regression checks.

### 2026-02-26 08:03 UTC - Run End
- Summary: household subgroup implementation is live on VPS and parity with local is restored.
- Changes:
  - Ran `ops:parity:vps` and confirmed VPS was behind on household-related files.
  - Deployed with `ops:deploy:vps` (migration, build, promote, restart, synthetic + parity + wave smokes).
  - Verified live household endpoints and filters via authenticated smoke against production domain.
- Tests:
  - Pre-deploy parity: `PARITY_RESULT=FAIL` (expected; VPS behind).
  - Deploy: `npm run ops:deploy:vps` => `DEPLOY_RESULT=PASS`.
  - Post-deploy parity: `PARITY_RESULT=PASS`.
  - Domain synthetic: pass (`/api/health`, `manifest.json`, `sw.js`, `offline.html`, app routes/status endpoints).
  - Domain wave smokes: wave2 pass, wave3 pass, wave4 pass.
  - Live household smoke: `LIVE_HOUSEHOLD_SMOKE=PASS` (create household, assign player, `history/stats?householdId` with household metadata).

### 2026-02-26 08:12 UTC - Run Start
- Operator: Codex
- Scope: continue household program by adding household-vs-household matchup analytics endpoint and UI, then validate and deploy.
- Notes: additive only; no changes to login/register and quick night behavior.

### 2026-02-26 08:35 UTC - Run End
- Summary: household matchup analytics are implemented locally (API + UI), validated with targeted smoke, and ready for VPS sync.
- Changes:
  - Added matchup analytics engine and endpoint:
    - `server/api/routes/alliances.js` (`GET /api/alliances/:id/matchups?dimension=household`)
  - Added client contracts:
    - `types.ts`
    - `lib/alliance.ts`
  - Added stats UI table for household-vs-household outcomes:
    - `components/Stats.tsx`
  - Updated roadmap snapshot to reflect matchup baseline completion:
    - `docs/roadmaps/10-alliance-shared-identity/household-subgroups-and-cross-family-play.md`
- Tests:
  - `npm run build` pass.
  - Targeted local matchup smoke pass:
    - create 2 households + 2 players, assign primary memberships, save alliance history night, assert matchups endpoint returns at least one matchup.
  - Non-regression:
    - `npm run ops:wave2:smoke` pass.
    - `WAVE3_BASE_URL=http://127.0.0.1:4000 WAVE3_SYNC_URL=ws://127.0.0.1:8080 npm run ops:wave3:smoke` pass.

### 2026-02-26 08:37 UTC - Run Start
- Operator: Codex
- Scope: deploy household matchup analytics to VPS, verify parity, and run production-domain matchup smoke.
- Notes: continue zero-downtime release process.

### 2026-02-26 08:47 UTC - Run End
- Summary: household matchup analytics are live on VPS and verified through domain-level API smoke.
- Changes:
  - Deployed local changes to VPS via `ops:deploy:vps`.
  - Synced frontend and backend matchup changes:
    - `components/Stats.tsx`
    - `server/api/routes/alliances.js`
    - `lib/alliance.ts`
    - `types.ts`
  - Confirmed roadmap metadata/index integrity remained valid.
- Tests:
  - Pre-deploy parity: `PARITY_RESULT=FAIL` (expected before sync).
  - Deploy: `npm run ops:deploy:vps` => `DEPLOY_RESULT=PASS`.
  - Post-deploy parity: `PARITY_RESULT=PASS`.
  - Domain synthetic + wave smokes during deploy: pass.
  - Live domain matchup smoke: pass (`LIVE_MATCHUP_SMOKE=PASS`) with household assignment + saved standard night + non-empty `dimension=household` matchups.
  - Final local checks: `npm run build` pass; baseline `npx prisma validate` fail expected without exported `DATABASE_URL`; env-loaded `npx prisma validate` pass.

### 2026-02-26 10:22 UTC - Run Start
- Operator: Codex
- Scope: continue alliance UX/stats depth by shipping account-avatar propagation across alliance/realtime surfaces and 2v2 teamup-vs-teamup analytics.
- Notes: preserve wave2/wave3 behavior and keep additive/non-breaking changes only.

### 2026-02-26 10:48 UTC - Run End
- Summary: avatar depth + teamup matchup analytics implemented locally, regression-smoke validated, roadmap status updated.
- Changes:
  - Added new teamup-vs-teamup analytics API:
    - `GET /api/alliances/:id/teamups/matchups`
    - `server/api/routes/alliances.js`
  - Added client contract and stats UI table:
    - `lib/alliance.ts`
    - `types.ts`
    - `components/Stats.tsx`
  - Added avatar propagation improvements:
    - members API includes avatar (`server/api/routes/alliances.js`)
    - realtime snapshots/messages include avatar (`server/realtimeCore.js`)
    - alliance UI now renders member/chat/household avatars and supports optional avatar on new alliance-player create (`pages/AlliancePage.tsx`)
    - header compact account chip now surfaces avatar (`components/AppHeader.tsx`)
  - Updated roadmap snapshots:
    - `docs/roadmaps/06-product-surface/profile-settings-and-security.md`
    - `docs/roadmaps/06-product-surface/history-stats-spectator.md`
    - `docs/roadmaps/10-alliance-shared-identity/ux-ui-alliance-surface.md`
- Tests:
  - `npm run build` pass.
  - `set -a; source .env.local; set +a; npx prisma validate` pass.
  - Targeted local avatar/teamup smoke: pass (`LOCAL_AVATAR_TEAMUP_SMOKE=PASS`).
  - Regression:
    - `npm run ops:wave2:smoke` pass.
    - `WAVE3_BASE_URL=http://127.0.0.1:4000 WAVE3_SYNC_URL=ws://127.0.0.1:8080 npm run ops:wave3:smoke` pass.

### 2026-02-26 10:55 UTC - Run Start
- Operator: Codex
- Scope: deploy avatar/teamup analytics continuation to VPS and verify local-vs-VPS parity plus domain-level smoke.
- Notes: zero-downtime promote flow and wave smoke gates required.

### 2026-02-26 11:01 UTC - Run End
- Summary: avatar propagation + teamup matchup analytics are live on VPS with parity restored.
- Changes:
  - Deployed via `npm run ops:deploy:vps`.
  - Synced and promoted:
    - `components/AppHeader.tsx`
    - `components/Stats.tsx`
    - `pages/AlliancePage.tsx`
    - `lib/alliance.ts`
    - `types.ts`
    - `server/api/routes/alliances.js`
    - `server/realtimeCore.js`
  - Verified live endpoint:
    - `GET /api/alliances/:id/teamups/matchups` (authenticated smoke)
  - Verified members payload now includes `user.avatar` in live API response.
- Tests:
  - Pre-deploy parity: `PARITY_RESULT=FAIL` (expected; VPS behind on changed files).
  - Deploy: `npm run ops:deploy:vps` => `DEPLOY_RESULT=PASS`.
  - Post-deploy parity: `PARITY_RESULT=PASS`.
  - Domain wave smokes during deploy:
    - wave2 pass
    - wave3 pass
    - wave4 pass
  - Targeted live smoke:
    - `LIVE_AVATAR_TEAMUP_SMOKE=PASS` (member avatar field + non-empty teamup matchup result).

### 2026-02-26 11:24 UTC - Run Start
- Operator: Codex
- Scope: finish Wave 5 teamup snapshot subsystem wiring (write-path refresh + snapshot-backed reads), add ops backfill/smoke automation, then validate and deploy.
- Notes: additive changes only; no gameplay-rule changes and no login/quick-night regressions.

### 2026-02-26 11:56 UTC - Run End
- Summary: Wave 5 teamup snapshot subsystem is complete, validated locally, deployed to VPS, and parity is green.
- Changes:
  - Completed snapshot runtime wiring:
    - `server/api/teamupSnapshots.js`
    - `server/api/routes/alliances.js`
    - `server/api/routes/history.js`
  - Added snapshot-first API responses with computed fallback:
    - `GET /api/alliances/:allianceId/stats` now includes `teamupsSource` (`snapshot|computed`)
    - `GET /api/alliances/:allianceId/teamups/matchups` now includes `matchupsSource` (`snapshot|computed`)
  - Added Wave 5 ops automation:
    - `scripts/ops/wave5_backfill_teamups.mjs` (dry/apply)
    - `scripts/ops/wave5_smoke.mjs`
    - package scripts and deploy pipeline hooks (`scripts/deploy_to_aria_vps.sh`)
  - Updated docs and roadmap snapshots:
    - `docs/roadmaps/10-alliance-shared-identity/shared-stats-data-model-and-migration.md`
    - `docs/roadmaps/10-alliance-shared-identity/README.md`
    - `docs/roadmaps/06-product-surface/history-stats-spectator.md`
    - `docs/FILES_INDEX.md`, `docs/STRUCTURE.md`, `docs/RUNBOOK.md`, `docs/ROADMAP.md`
- Tests:
  - Local baseline/final:
    - `npm run build` pass
    - `npx prisma validate` baseline fail expected (`DATABASE_URL` missing in shell)
    - `set -a; source .env.local; set +a; npx prisma validate` pass
    - `npx prisma migrate deploy` applied `20260226111000_wave5_teamup_snapshots`
    - `npx prisma generate` pass
  - Local smokes:
    - `ops:wave2:smoke` pass
    - `ops:wave3:smoke` pass
    - `wave4_smoke.mjs` pass
    - `ops:wave5:smoke` pass (default source=`snapshot`, filtered source=`computed`)
    - `ops:wave5:backfill:dry` and `ops:wave5:backfill:apply` pass
  - Roadmap/governance:
    - `roadmap:registry:generate`, `roadmap:registry:check`, `roadmap:metadata:check`, `roadmap:index:check` all pass
  - VPS/live:
    - deploy executed via `ops:deploy:vps` (connection dropped near final phase but independent post-deploy verification confirms completion)
    - `ops:parity:vps` pass
    - `ops:synthetic` pass
    - domain wave smokes pass: wave2, wave3, wave4, wave5

### 2026-04-10 UTC - Run Start
- Operator: Codex
- Scope: perform a documentation and research reset for the new product direction before implementation work begins.
- Notes: no code edits to product behavior; documentation only.

### 2026-04-10 UTC - Run End
- Summary: research phase reset is complete and the planning system now reflects the new direction.
- Changes:
  - Rewrote roadmap entrypoints:
    - `docs/ROADMAP.md`
    - `docs/README.md`
    - `docs/roadmaps/README.md`
    - `docs/roadmaps/IMPLEMENTATION_ORDER.md`
    - `docs/roadmaps/IMPLEMENTATION_READINESS.md`
  - Added new active research tracks:
    - `docs/roadmaps/11-stable-web-pwa/README.md`
    - `docs/roadmaps/11-stable-web-pwa/stable-scope-and-deletion-plan.md`
    - `docs/roadmaps/12-android-native/README.md`
    - `docs/roadmaps/12-android-native/offline-first-architecture.md`
    - `docs/roadmaps/12-android-native/biometric-and-passkey-strategy.md`
    - `docs/roadmaps/13-demo-web/README.md`
    - `docs/roadmaps/13-demo-web/promotion-policy.md`
    - `docs/roadmaps/13-demo-web/experiment-governance.md`
  - Updated supporting documentation indexes:
    - `docs/FILES_INDEX.md`
    - `docs/STRUCTURE.md`
  - Reclassified previous research:
    - active: stable web/PWA, Android native, demo web, auth, UI/accessibility, performance, devops
    - supporting: legacy PWA cross-platform, legacy product-surface, strategy future
- Verification:
  - confirmed documentation reflects the new three-track direction,
  - confirmed stable web/PWA retains PWA scope,
  - confirmed archived expansion topics are preserved but removed from active execution order,
  - confirmed local Android development prerequisites were previously checked and are adequate for follow-on implementation planning.

## 2026-05-14 - automation-scope removal and docs sync
- Scope: remove external automation workflow scope from project documentation; keep Domino app stack focused on web, PWA, API, and Android deliverables.
- Changes:
  - Removed all external automation workflow mentions from docs, scripts, and roadmap metadata.
  - Removed the deprecated automation roadmap directory from repository.
  - Updated roadmap and ops docs to stop referencing deprecated automation domains/checks.
- Result: External automation workflow is no longer part of active codebase/docs scope.

## 2026-05-14 - Dominoyar dedicated mail-domain prep
- Scope: align local docs/env templates with dedicated dominoyar domain and isolated mail identity.
- Changes:
  - Updated `.env.example` SMTP defaults to `smtp.dominoyar.ir` and `@dominoyar.ir` sender identities.
  - Updated `.env.example` WebAuthn RP defaults to `dominoyar.ir`.
  - Updated `docs/RUNBOOK.md` deployment/runtime verification targets to `dominoyar.ir` + `www.dominoyar.ir`.
  - Updated `DOCUMENTATION.md` email-delivery section to reflect dedicated domain mail configuration.
- Next: apply VPS OpenDKIM/Postfix domain mapping for `dominoyar.ir` and switch runtime SMTP env values.

## 2026-05-14 - Dominoyar mail runtime activation (credential-optional relay)
- Scope: make app mail delivery usable immediately on VPS without blocking on SMTP app credentials.
- Changes:
  - Updated `server/api/mailer.js` to allow SMTP transport with host/port only, while still using auth when credentials are present.
  - Updated `.env.example` SMTP defaults for `dominoyar.ir` with optional `SMTP_USER`/`SMTP_PASS`.
  - Updated docs (`DOCUMENTATION.md`, `docs/RUNBOOK.md`) to document credential-optional local relay mode.
- Result: app can send mail through local Postfix relay path while keeping dedicated `dominoyar.ir` sender identity.

## 2026-05-14 - Dominoyar SMTP runtime finalized on VPS
- Scope: finalize immediate mail delivery path for app notifications on production VPS.
- Changes:
  - Set VPS runtime SMTP env to local Postfix relay: `SMTP_HOST=127.0.0.1`, `SMTP_PORT=25`, empty SMTP auth, `SMTP_FROM="Dominoyar <noreply@dominoyar.ir>"`.
  - Updated `server/api/mailer.js` local-relay handling to use non-TLS local delivery mode for `127.0.0.1`/`localhost`.
  - Restarted `morodomino-domino-api` after env update.
- Result: app mail path is enabled with domain-isolated sender identity and without external SMTP credential dependency.

## 2026-05-14 - Dominoyar domain migration + SSL readiness pass
- Scope: switch active code/runtime defaults to `dominoyar.ir`, apply VPS host mapping updates, and attempt full SSL issuance for dominoyar-related hosts.
- Implemented:
  - Updated active backend defaults to `dominoyar.ir` (`server/api/index.js`, `server/api/routes/auth.js`).
  - Updated ops defaults to `dominoyar.ir` across deploy/preflight/probe/parity/rollback/TLS scripts.
  - Updated Android native API base default to `https://dominoyar.ir`.
  - Updated VPS nginx Domino host mapping to include `dominoyar.ir`, `www.dominoyar.ir`, `demo.dominoyar.ir`, `origin.dominoyar.ir`.
  - Updated VPS nginx mail host mapping to include `smtp.dominoyar.ir`.
  - Updated VPS runtime env domain values (`VITE_SYNC_URL`, `RP_ID`, `RP_ORIGIN`, `RP_NAME`) to dominoyar values.
- SSL issuance result:
  - `certbot --nginx` for dominoyar hosts failed with `NXDOMAIN` for `dominoyar.ir` hostnames at CA validation time.
  - Mail cert extension attempt failed: CA could not reach HTTP challenge on old mail hosts (`Timeout during connect`) and `smtp.dominoyar.ir` also returned `NXDOMAIN`.
- Deployment:
  - Deployed latest code/docs/runtime changes to VPS with health probes and parity checks passing on current live domain.
- Required external unblock:
  - Public DNS delegation/propagation for `dominoyar.ir` zone must be corrected so CA can resolve A records.
  - Inbound HTTP/80 reachability for ACME challenge must be open for covered hosts during issuance.

## 2026-05-14 - Domain cutover finalized; SSL pending owner action
- Scope: complete domain migration across the Domino system and document SSL dependency clearly.
- Completed:
  - Replaced remaining old-domain references across roadmap artifacts/log outputs to `dominoyar.ir` equivalents.
  - Kept VPS/app runtime aligned to `dominoyar.ir` defaults and deployed latest changes.
- SSL outcome:
  - Attempted automated certificate issuance/extension; blocked by public DNS/ACME validation failures during this window.
- Required owner follow-up:
  - Provide/activate SSL certificate coverage for `dominoyar.ir` hosts after domain approval is finalized.
  - Notify agent to rerun TLS/probe verification and complete final cert binding checks.

## 2026-05-14 - Domain migration deferred until registrar approval
- Decision: keep production runtime on `domino.ariaprojectsdashboard.ir` until `dominoyar.ir` is approved and fully resolvable.
- Actions taken:
  - Reverted active code/runtime defaults back to old domain for API/CORS/WebAuthn/ops scripts.
  - Kept migration readiness work documented for later cutover.
  - Redeployed and revalidated VPS deployment (`DEPLOY_RESULT=PASS`, `SYNTHETIC_PROBE=PASS`, `PARITY_RESULT=PASS`).
- Reminder:
  - Owner must provide active SSL coverage for `dominoyar.ir` once registrar approval and DNS propagation complete.
  - After SSL is available, rerun full domain cutover and TLS verification.

## 2026-05-16 - Dominoyar final cutover + wildcard SSL activation
- Scope: complete full Domino ecosystem migration to `dominoyar.ir`, retire old Domino domain usage, and activate SSL using owner-provided wildcard certificate bundle.
- SSL actions:
  - Verified source certificate files at `C:\Projects\morodomino\certificates`.
  - Installed wildcard cert/key on VPS:
    - `/etc/ssl/dominoyar/fullchain.pem`
    - `/etc/ssl/dominoyar/privkey.pem`
  - Updated Domino nginx vhost to serve only `dominoyar.ir`, `www.dominoyar.ir`, `demo.dominoyar.ir`, `origin.dominoyar.ir` with the new wildcard cert.
  - Added dedicated `smtp.dominoyar.ir` nginx TLS vhost using the same wildcard cert.
- Domain/runtime migration:
  - Confirmed active code/runtime defaults are `dominoyar.ir` across backend, WebAuthn, ops scripts, and Android API base.
  - Updated VPS runtime env values to dominoyar equivalents (`VITE_API_URL`, `FRONTEND_URL`, `WEBAUTHN_*`, `VITE_SYNC_URL`, `RP_*`).
  - Removed old Domino-specific mail/domain routing entries from active OpenDKIM and nginx mappings.
- Validation:
  - Deploy succeeded (`DEPLOY_RESULT=PASS`), synthetic probe passed, parity passed on `https://dominoyar.ir`.
  - Live HTTPS checks pass for `dominoyar.ir`, `www.dominoyar.ir`, `demo.dominoyar.ir`, `origin.dominoyar.ir`, and `smtp.dominoyar.ir`.
- Decision recorded:
  - `domino.ariaprojectsdashboard.ir` is retired for the Domino ecosystem and is no longer an active target.

## 2026-05-16 - Hard retirement of old Domino domain (no redirect policy)
- Scope: remove old Domino subdomain usage completely from active infrastructure with no redirects, keeping historical mention only in docs.
- Infrastructure cleanup:
  - Removed old Domino-related nginx host aliases and conditional blocks from active configs (`smtp-domino`, `n8n-domino`, `domino`, `www-domino`).
  - Removed old Domino cert material path usage from active nginx; Domino serves only on `dominoyar.ir` ecosystem hosts.
  - Deleted legacy Domino-specific nginx backup files and old Let's Encrypt directory for `domino.ariaprojectsdashboard.ir`.
  - Rehomed OpenDKIM key path to `/etc/opendkim/keys/dominoyar.ir/domino2026.private` and removed old-domain DKIM runtime references.
- Validation:
  - `https://dominoyar.ir/api/health` and related dominoyar hosts return successful responses.
  - Old domain endpoint no longer acts as a valid Domino target (fails TLS name match; no redirect behavior).
- Policy:
  - Old Domino domain is considered retired permanently for runtime and deployment.

## 2026-05-16 - Canonical host enforcement + demo lane isolation
- Scope: enforce dedicated-domain canonical behavior and separate demo experimentation lane from user-facing production host.
- Infrastructure changes:
  - Updated nginx Domino vhost strategy:
    - `dominoyar.ir` serves production app/runtime.
    - `www.dominoyar.ir` redirects to `dominoyar.ir`.
    - `demo.dominoyar.ir` serves a separate copy/runtime instance (`/var/www/morodomino/demo`, API port `14100`, sync port `14101`).
    - `origin.dominoyar.ir` is disabled for user traffic and returns `404`.
  - Added and enabled systemd services for demo lane:
    - `morodomino-demo-api.service`
    - `morodomino-demo-sync.service`
- Validation:
  - `dominoyar.ir/api/health` => `200`
  - `www.dominoyar.ir/api/health` => `301` to apex
  - `demo.dominoyar.ir/api/health` => `200` (separate lane)
  - `origin.dominoyar.ir/api/health` => `404`
- Result: production behavior is consistent with dedicated apex domain, while experiments are isolated to demo host.

## 2026-05-16 - Database cutover audit (dominoyar)
- Scope: verify DB readiness after domain migration and confirm user data continuity.
- Checks:
  - Prisma migration status: up to date (`14` migrations applied).
  - Data continuity: active `User` records preserved (`74` users).
  - Domain leakage scan: no user/recovery emails tied to retired old Domino domain.
  - Integrity scan: no orphan sessions, no duplicate usernames/emails.
- Cleanup performed:
  - Purged expired sessions from `Session` table (`163` removed), keeping active session set lean.
- Result:
  - No user-data transfer gap found; existing accounts are intact and active under new domain runtime.


## 2026-05-16 - Branding normalization (Dominoyar / دومینویار)
- Scope: finalize app naming across active Domino ecosystem surfaces and repair automation fallout from bulk replacements.
- Fixes:
  - Repaired Playwright local path config to use current working directory instead of hardcoded non-existent path.
  - Normalized Android app naming consistency by keeping `DominoyarDatabase` in matching file `DominoyarDatabase.kt`.
  - Updated Android local DB filename to `dominoyar.db` for branding consistency in app-local storage.
- Notes:
  - Legacy repository/package identifiers may remain in non-user-facing internals where renaming would create unnecessary migration risk.

## 2026-05-16 - Android passkey lifecycle hardening (management controls)
- Scope: continue Android security roadmap by closing passkey lifecycle gaps beyond register/login.
- Backend:
  - Added authenticated passkey management endpoints:
    - `GET /api/users/me/passkeys`
    - `DELETE /api/users/me/passkeys/:passkeyId`
  - Added security event emission on passkey deletion (`passkey_removed`).
- Android native:
  - Extended auth repository/API contract with passkey listing and deletion.
  - Added in-app passkey management surface (refresh + per-passkey removal) in authenticated screen.
  - Kept password fallback and existing biometric/passkey login behavior intact.
- Outcome:
  - Passkey lifecycle now covers register, login, inspect, and revoke from the app.

## 2026-05-16 - Android sensitive-action biometric enforcement (passkey revoke)
- Scope: close a security gap where passkey deletion could run without local re-auth in Android app.
- Change:
  - Wrapped passkey deletion action with `BiometricPrompt` challenge before calling revoke API.
  - Added explicit cancellation/error message when biometric confirmation fails.
- Outcome:
  - Passkey removal now requires a local possession/biometric check, aligning with sensitive-action policy.

## 2026-05-16 - Roadmap continuation: access hub release-integrity metadata
- Scope: advance roadmap 13 (distribution hub) toward controlled Android direct-download readiness.
- Product changes:
  - Access page now supports release integrity metadata next to direct Android download:
    - Android version
    - release date
    - SHA-256 hash
  - Strengthened download warning copy to require version/hash verification before install.
- Config changes:
  - Added env keys: `VITE_BAZAAR_APP_URL`, `VITE_MYKET_APP_URL`, `VITE_DIRECT_DOWNLOAD_URL`, `VITE_ANDROID_RELEASE_VERSION`, `VITE_ANDROID_RELEASE_DATE`, `VITE_ANDROID_RELEASE_SHA256`.
- Ops/docs changes:
  - Runbook updated with Android artifact hosting steps and metadata publication checklist.

## 2026-05-16 - Roadmap execution: Android release operations baseline
- Scope: continue roadmap 12/13 implementation by preparing repeatable Android release operations for VPS distribution.
- Added ops scripts:
  - `scripts/ops/android_release_metadata.sh`: computes SHA-256/date/size and prints env exports for access page metadata.
  - `scripts/ops/publish_android_release_to_vps.sh`: uploads signed artifact to VPS downloads path and prints metadata/env values.
- Added execution tracker:
  - `docs/roadmaps/artifacts/android-readiness-checklist-2026-05-16.md` with compatibility, security, offline, notifications, store-gate, and direct-download checklists.
- Result:
  - Android release/distribution lane now has concrete operational tooling and a checklist artifact for closeout.


## 2026-05-20 - SSH repair + Android release download path verified
- Scope: restore stable VPS access and validate the new Android direct-download lane.
- SSH remediation:
  - Created fresh `/tmp/aria_ssh_config`, `/tmp/aria_key`, and `/tmp/aria_known_hosts` with strict permissions.
  - Confirmed `ssh -F /tmp/aria_ssh_config aria-safe 'echo ok'` works.
- Release distribution:
  - Hardened `scripts/ops/publish_android_release_to_vps.sh` to publish an artifact plus `.sha256` sidecar.
  - Verified `https://dominoyar.ir/downloads/dominoyar-test.apk` returns `200` from the VPS/WCDN path.
  - Verified matching checksum file is served and matches the artifact hash.
- Result:
  - Android release hosting lane is now operational and ready for a real signed APK/AAB when available.


## 2026-05-20 - Android compliance gate tightened
- Scope: make the Android release verifier enforce the actual compliance docs instead of a loose placeholder.
- Change:
  - `android-native/compliance/verify_android_release_readiness.sh` now checks manifest/build metadata plus checklist and matrix docs.
  - `android-native/compliance/device_compatibility_matrix.md` now explicitly includes notification permission/channel/deeplink checks.
  - Updated the execution tracker to mark notification readiness items complete in the roadmap artifact.
- Result:
  - Repo-side Android compliance gate is now actionable and aligned with the documented release criteria.


## 2026-05-20 - Android notification lane implemented
- Scope: implement notification roadmap items in Android app beyond strategy docs.
- Implemented:
  - Added `POST_NOTIFICATIONS` permission declaration in Android manifest.
  - Added `AndroidNotificationManager` with:
    - channel creation (`dominoyar_security`, `dominoyar_game`)
    - Android 13+ permission request helper
    - security and game reminder notification helpers
    - deep-link intent target extra on tap
  - Integrated notification calls in main flows:
    - passkey registered
    - sensitive biometric confirmation
    - passkey removal
    - notifications enable toggle feedback
- Result:
  - Notification permission/channel/deeplink lane is implemented in code and reflected in compliance artifacts.


## 2026-05-20 - Android Gradle wrapper + WSL JDK bootstrap fixed
- Scope: restore Android build tooling using the pattern proven in `securechat`.
- Changes:
  - Added checked-in Gradle wrapper files under `android-native/android-app/` from the proven SecureChat setup.
  - Updated `gradlew` to run under WSL by using the Windows JDK 17 installation at `C:\Users\moroshani\AppData\Local\Java\jdk-17`.
  - Verified `./gradlew -v` works successfully from the Android app folder.
- Result:
  - Android build tooling is now bootstrapped; next step is actual SDK/assemble execution.
