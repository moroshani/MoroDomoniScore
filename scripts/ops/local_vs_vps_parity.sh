#!/usr/bin/env bash
set -euo pipefail

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_PATH="${APP_PATH:-/var/www/morodomino/app}"
BASE_URL="${BASE_URL:-https://dominoyar.ir}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

files=(
  ".gitignore"
  ".gitattributes"
  ".env.example"
  "README.md"
  "DOCUMENTATION.md"
  "package.json"
  "package-lock.json"
  "App.tsx"
  "components/Auth.tsx"
  "components/ModeSelector.tsx"
  "components/Scoreboard.tsx"
  "components/TeamNameSetup.tsx"
  "context/GameContext.tsx"
  "pages/AccessPage.tsx"
  "pages/PlayPage.tsx"
  "pages/ProfilePage.tsx"
  "pages/SettingsPage.tsx"
  "public/manifest.json"
  "public/sw.js"
  "public/offline.html"
  "server/api/index.js"
  "server/api/routes/auth.js"
  "server/api/routes/users.js"
  "prisma/schema.prisma"
  "docs/RUNBOOK.md"
  "docs/README.md"
  "docs/ARCHITECTURE.md"
  "docs/SSH_HOST_AUDIT_2026-06-04.md"
  "scripts/deploy_to_aria_vps.sh"
  "scripts/ops/local_vs_vps_parity.sh"
  "tests/stable-smoke.spec.js"
  "android-native/android-app/app/build.gradle.kts"
  "android-native/android-app/app/proguard-rules.pro"
)

mismatch=0

echo "PARITY_STARTED=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
for rel in "${files[@]}"; do
  local_file="$ROOT_DIR/$rel"
  if [ ! -f "$local_file" ]; then
    echo "PARITY_MISSING_LOCAL=$rel"
    mismatch=1
    continue
  fi
  local_hash="$(sha256sum "$local_file" | awk '{print $1}')"
  remote_hash="$(ssh -F "$SSH_CFG" "$SSH_HOST" "sha256sum '$APP_PATH/$rel' 2>/dev/null | awk '{print \$1}'")"
  echo "PARITY_FILE=$rel local=$local_hash remote=${remote_hash:-missing}"
  if [ -z "$remote_hash" ] || [ "$local_hash" != "$remote_hash" ]; then
    mismatch=1
  fi
done

for path in /api/health /manifest.json /sw.js /offline.html / /profile /settings; do
  code="$(curl -sS -L -o /dev/null -w '%{http_code}' --max-time 30 "$BASE_URL$path" || true)"
  echo "PARITY_HTTP path=$path code=$code"
  if [ "$code" != "200" ]; then
    mismatch=1
  fi
done

for path in /api/users/me; do
  code="$(curl -sS -L -o /dev/null -w '%{http_code}' --max-time 30 "$BASE_URL$path" || true)"
  echo "PARITY_HTTP path=$path code=$code"
  if [ "$code" != "401" ]; then
    mismatch=1
  fi
done

if [ "$mismatch" -ne 0 ]; then
  echo "PARITY_RESULT=FAIL"
  exit 1
fi

echo "PARITY_RESULT=PASS"
