#!/usr/bin/env bash
set -euo pipefail

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_PATH="${APP_PATH:-/var/www/morodomino/app}"

echo "[dr] host=$SSH_HOST app=$APP_PATH"

ssh -F "$SSH_CFG" "$SSH_HOST" "APP_PATH='$APP_PATH' bash -s" <<'EOS'
set -euo pipefail

if [ ! -f "$APP_PATH/.env" ]; then
  echo "dr_error: missing $APP_PATH/.env"
  exit 31
fi

database_url="$(grep '^DATABASE_URL=' "$APP_PATH/.env" | tail -n1 | cut -d'=' -f2-)"
if [ -z "$database_url" ]; then
  echo "dr_error: DATABASE_URL missing"
  exit 32
fi

ts="$(date +%Y%m%d%H%M%S)"
dump="/tmp/morodomino-dr-${ts}.dump"
tmp_db="morodomino_restore_${ts}"

echo "dr_step=backup_dump"
pg_dump "$database_url" -Fc -f "$dump"

echo "dr_step=create_restore_db"
sudo -u postgres createdb "$tmp_db"

cleanup() {
  sudo -u postgres dropdb --if-exists "$tmp_db" >/dev/null 2>&1 || true
  rm -f "$dump"
}
trap cleanup EXIT

echo "dr_step=restore_dump"
sudo -u postgres pg_restore --no-owner --no-privileges -d "$tmp_db" "$dump"

echo "dr_step=verify_restore"
sudo -u postgres psql "$tmp_db" -Atqc 'SELECT count(*) FROM "User";' >/tmp/morodomino-dr-user-count.txt
user_count="$(cat /tmp/morodomino-dr-user-count.txt)"
echo "dr_restore_user_count=${user_count:-0}"

echo "DR_BACKUP_VERIFY=PASS"
EOS
