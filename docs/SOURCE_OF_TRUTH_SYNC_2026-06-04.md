# Source Of Truth Sync - 2026-06-04

Purpose: close local/VPS drift found after the worktree audit.

## Decision

The local repository is the source of truth for package metadata, ops scripts, and runbook docs.

The VPS source tree at `/var/www/morodomino/app` is a deployment mirror. Runtime services are not the authority for package/script/doc edits.

## Drift Found

- `package.json`: local had one additional script, `ops:android:release-env:vps`.
- `docs/RUNBOOK.md`: local had the 2026-06-04 SSH baseline and Android release-env helper command.
- `package-lock.json`: already matched.
- `scripts/ops/local_vs_vps_parity.sh`: matched before this sync, then was expanded locally to check package metadata and runbook drift.

## Sync Scope

Safe to sync without service restart:

- `package.json`
- `docs/RUNBOOK.md`
- `scripts/ops/local_vs_vps_parity.sh`

No `.env` values or secrets are part of this sync.

## Verification Contract

After sync, run:

```bash
SSH_CFG=C:/Projects/morodomino/ssh_config SSH_HOST=ariadashboardssh-win bash scripts/ops/local_vs_vps_parity.sh
```

Expected result: `PARITY_RESULT=PASS`.
