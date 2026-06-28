#!/usr/bin/env bash
set -euo pipefail

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_PATH="${APP_PATH:-/var/www/morodomino/app}"
PREVIOUS_PATH="${PREVIOUS_PATH:-/var/www/morodomino/app.previous}"
BASE_URL="${BASE_URL:-https://dominoyar.ir}"
API_SERVICE="${API_SERVICE:-morodomino-domino-api}"

echo "[rollback] host=$SSH_HOST from=$PREVIOUS_PATH to=$APP_PATH"

ssh -F "$SSH_CFG" "$SSH_HOST" "APP_PATH='$APP_PATH' PREVIOUS_PATH='$PREVIOUS_PATH' API_SERVICE='$API_SERVICE' bash -s" <<'EOS'
set -euo pipefail

if [ ! -d "$PREVIOUS_PATH" ]; then
  echo "rollback_error: previous release path missing -> $PREVIOUS_PATH"
  exit 21
fi

if [ ! -f "$APP_PATH/.env" ]; then
  echo "rollback_error: missing active .env at $APP_PATH/.env"
  exit 22
fi

rsync -a --delete --exclude '.env' "$PREVIOUS_PATH/" "$APP_PATH/"
systemctl restart "$API_SERVICE" nginx
systemctl is-active "$API_SERVICE" nginx >/dev/null

echo "rollback_remote_ok=true"
EOS

curl -fsS --max-time 30 "$BASE_URL/api/health" >/dev/null
curl -fsS --max-time 30 "$BASE_URL/manifest.json" >/dev/null
curl -fsS --max-time 30 "$BASE_URL/sw.js" >/dev/null

echo "rollback_ok=true"
