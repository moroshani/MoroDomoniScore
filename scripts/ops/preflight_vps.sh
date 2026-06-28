#!/usr/bin/env bash
set -euo pipefail

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_PATH="${APP_PATH:-/var/www/morodomino/app}"
DOMAIN="${DOMAIN:-dominoyar.ir}"
API_SERVICE="${API_SERVICE:-morodomino-domino-api}"
SKIP_DOMAIN_HEALTH="${SKIP_DOMAIN_HEALTH:-0}"

echo "[preflight] host=$SSH_HOST app=$APP_PATH domain=$DOMAIN"

ssh -F "$SSH_CFG" "$SSH_HOST" "APP_PATH='$APP_PATH' DOMAIN='$DOMAIN' API_SERVICE='$API_SERVICE' SKIP_DOMAIN_HEALTH='$SKIP_DOMAIN_HEALTH' bash -s" <<'EOS'
set -euo pipefail

if [ ! -d "$APP_PATH" ]; then
  echo "preflight_error: app path missing -> $APP_PATH"
  exit 11
fi

if [ ! -f "$APP_PATH/.env" ]; then
  echo "preflight_error: missing $APP_PATH/.env"
  exit 12
fi

missing=0
while IFS= read -r key; do
  [ -z "$key" ] && continue
  if ! grep -q "^${key}=" "$APP_PATH/.env"; then
    echo "preflight_error: missing env key -> $key"
    missing=1
    continue
  fi
  value="$(grep "^${key}=" "$APP_PATH/.env" | tail -n1 | cut -d'=' -f2-)"
  if [ -z "$value" ]; then
    echo "preflight_error: empty env key -> $key"
    missing=1
  fi
done <<'KEYS'
DATABASE_URL
JWT_SECRET
FRONTEND_URL
API_PORT
VITE_API_URL
IMMORTAL_NAME
IMMORTAL_USERNAME
IMMORTAL_EMAIL
IMMORTAL_PASSWORD
KEYS

if [ "$missing" -ne 0 ]; then
  exit 13
fi

smtp_keys=(SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS SMTP_FROM)
smtp_present=0
for key in "${smtp_keys[@]}"; do
  value="$(grep "^${key}=" "$APP_PATH/.env" 2>/dev/null | tail -n1 | cut -d'=' -f2- || true)"
  if [ -n "$value" ]; then
    smtp_present=$((smtp_present + 1))
  fi
done
if [ "$smtp_present" -gt 0 ] && [ "$smtp_present" -lt ${#smtp_keys[@]} ]; then
  smtp_host="$(grep '^SMTP_HOST=' "$APP_PATH/.env" 2>/dev/null | tail -n1 | cut -d'=' -f2- || true)"
  smtp_port="$(grep '^SMTP_PORT=' "$APP_PATH/.env" 2>/dev/null | tail -n1 | cut -d'=' -f2- || true)"
  smtp_user="$(grep '^SMTP_USER=' "$APP_PATH/.env" 2>/dev/null | tail -n1 | cut -d'=' -f2- || true)"
  smtp_pass="$(grep '^SMTP_PASS=' "$APP_PATH/.env" 2>/dev/null | tail -n1 | cut -d'=' -f2- || true)"
  smtp_from="$(grep '^SMTP_FROM=' "$APP_PATH/.env" 2>/dev/null | tail -n1 | cut -d'=' -f2- || true)"
  if [ -n "$smtp_host" ] && [ -n "$smtp_port" ] && [ -n "$smtp_from" ] && [ -z "$smtp_user" ] && [ -z "$smtp_pass" ]; then
    :
  else
    echo "preflight_error: SMTP env keys must be all set/all empty, or relay mode (HOST+PORT+FROM with empty USER/PASS)"
    exit 18
  fi
fi

for svc in "$API_SERVICE" nginx; do
  if [ "$(systemctl show "${svc}.service" -p LoadState --value 2>/dev/null || true)" != "loaded" ]; then
    echo "preflight_error: missing systemd service -> $svc"
    exit 14
  fi
done

disk_avail_kb="$(df -Pk "$APP_PATH" | awk 'NR==2 {print $4}')"
if [ "${disk_avail_kb:-0}" -lt 1048576 ]; then
  echo "preflight_error: free disk less than 1GB"
  exit 15
fi

database_url="$(grep '^DATABASE_URL=' "$APP_PATH/.env" | tail -n1 | cut -d'=' -f2-)"
if [ -z "$database_url" ]; then
  echo "preflight_error: DATABASE_URL missing after parse"
  exit 19
fi
db_probe="$(node -e 'const u=new URL(process.argv[1]); process.stdout.write(`${u.hostname}:${u.port || 5432}`)' "$database_url")"
db_host="${db_probe%:*}"
db_port="${db_probe#*:}"
if ! pg_isready -h "$db_host" -p "$db_port" >/dev/null 2>&1; then
  echo "preflight_error: postgres not ready at ${db_host}:${db_port}"
  exit 16
fi

if [ "$SKIP_DOMAIN_HEALTH" != "1" ]; then
  if ! curl -fsS --max-time 20 "https://$DOMAIN/api/health" >/dev/null; then
    echo "preflight_error: domain health check failed for https://$DOMAIN/api/health"
    exit 17
  fi
else
  echo "preflight_warn: domain health check skipped (SKIP_DOMAIN_HEALTH=1)"
fi

echo "preflight_ok=true"
EOS
