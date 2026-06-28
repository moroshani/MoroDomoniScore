#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_PATH="${APP_PATH:-/var/www/morodomino/app}"
RELEASE_PATH="${RELEASE_PATH:-/var/www/morodomino/app.release}"
PREVIOUS_PATH="${PREVIOUS_PATH:-/var/www/morodomino/app.previous}"
BASE_URL="${BASE_URL:-https://dominoyar.ir}"
API_SERVICE="${API_SERVICE:-morodomino-domino-api}"
SKIP_DOMAIN_HEALTH="${SKIP_DOMAIN_HEALTH:-0}"
SKIP_REMOTE_CHECKS="${SKIP_REMOTE_CHECKS:-0}"
ARCHIVE="/tmp/morodomino-stable-$(date +%Y%m%d%H%M%S).tgz"
REMOTE_ARCHIVE="/tmp/$(basename "$ARCHIVE")"

run_retry() {
  local attempts="$1"
  local delay_seconds="$2"
  shift 2
  local run=1
  until "$@"; do
    local code=$?
    if [ "$run" -ge "$attempts" ]; then
      return "$code"
    fi
    echo "retry: attempt $run/$attempts failed, retrying in ${delay_seconds}s"
    sleep "$delay_seconds"
    run=$((run + 1))
  done
}

echo "[0/8] VPS preflight"
run_retry 3 4 env SSH_CFG="$SSH_CFG" SSH_HOST="$SSH_HOST" APP_PATH="$APP_PATH" DOMAIN="${BASE_URL#https://}" API_SERVICE="$API_SERVICE" SKIP_DOMAIN_HEALTH="$SKIP_DOMAIN_HEALTH"   "$REPO_ROOT/scripts/ops/preflight_vps.sh"

echo "[1/8] Packing local project"
tar -czf "$ARCHIVE"   --exclude='.git'   --exclude='node_modules'   --exclude='dist'   --exclude='dist-ssr'   --exclude='test-results'   --exclude='playwright-report'   --exclude='.env'   --exclude='.env.local'   --exclude='.env.development.local'   --exclude='.env.production.local'   --exclude='.env.test.local'   --exclude='Yekan Bakh - Pro'   --exclude='YekanBakh4 Pro'   --exclude='android-native/android-app/.gradle'   --exclude='android-native/android-app/app/build'   --exclude='android-native/android-app/local.properties'   -C "$REPO_ROOT" .

echo "[2/8] Uploading archive"
run_retry 6 6 scp -F "$SSH_CFG" "$ARCHIVE" "$SSH_HOST:$REMOTE_ARCHIVE"

echo "[3/8] Preparing release directory"
run_retry 4 5 ssh -F "$SSH_CFG" "$SSH_HOST" "set -euo pipefail
mkdir -p '$RELEASE_PATH'
rm -rf '$RELEASE_PATH'/*
tar -xzf '$REMOTE_ARCHIVE' -C '$RELEASE_PATH'
if [ -f '$APP_PATH/.env' ]; then cp '$APP_PATH/.env' '$RELEASE_PATH/.env'; fi
rm -f '$REMOTE_ARCHIVE'
"

echo "[4/8] Install, migrate, and build"
run_retry 4 8 ssh -F "$SSH_CFG" "$SSH_HOST" "set -euo pipefail
cd '$RELEASE_PATH'
node scripts/ops/validate_env_contract.mjs --file=.env
npm ci --no-audit --no-fund --loglevel=error
npx prisma migrate deploy
npx prisma generate
npm run build
"

echo "[5/8] Promote release and restart services"
run_retry 4 6 ssh -F "$SSH_CFG" "$SSH_HOST" "set -euo pipefail
mkdir -p '$PREVIOUS_PATH'
rm -rf '$PREVIOUS_PATH'/*
if [ -d '$APP_PATH' ]; then
  rsync -a --delete --exclude '.env' '$APP_PATH/' '$PREVIOUS_PATH/'
fi
rsync -a --delete --exclude '.env' '$RELEASE_PATH/' '$APP_PATH/'
rm -rf '$RELEASE_PATH'
sudo systemctl restart '$API_SERVICE' nginx
sudo systemctl is-active '$API_SERVICE' nginx >/dev/null
"

echo "[6/8] Domain synthetic checks"
if [ "$SKIP_REMOTE_CHECKS" = "1" ]; then
  echo "SYNTHETIC_PROBE=SKIPPED"
  echo "[7/8] Local vs VPS parity checks"
  echo "PARITY_RESULT=SKIPPED"
else
  run_retry 12 5 env BASE_URL="$BASE_URL" "$REPO_ROOT/scripts/ops/synthetic_probe.sh"

  echo "[7/8] Local vs VPS parity checks"
  SSH_CFG="$SSH_CFG" SSH_HOST="$SSH_HOST" APP_PATH="$APP_PATH" BASE_URL="$BASE_URL"   "$REPO_ROOT/scripts/ops/local_vs_vps_parity.sh"
fi

echo "[8/8] Cleanup local archive"
rm -f "$ARCHIVE"

echo "DEPLOY_RESULT=PASS"
