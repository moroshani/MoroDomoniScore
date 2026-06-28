#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 4 ]; then
  echo "usage: $0 <public-url> <version> <release-date> <sha256> [size-bytes]"
  exit 1
fi

PUBLIC_URL="$1"
VERSION="$2"
RELEASE_DATE="$3"
SHA256="$4"
SIZE_BYTES="${5:-}"

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_ENV="${APP_ENV:-/var/www/morodomino/app/.env}"

if [[ ! "$PUBLIC_URL" =~ ^https:// ]]; then
  echo "invalid_public_url_not_https"
  exit 2
fi

if [[ ! "$RELEASE_DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "invalid_release_date"
  exit 2
fi

if [[ ! "$SHA256" =~ ^[a-fA-F0-9]{64}$ ]]; then
  echo "invalid_sha256"
  exit 2
fi

if [ -n "$SIZE_BYTES" ] && [[ ! "$SIZE_BYTES" =~ ^[0-9]+$ ]]; then
  echo "invalid_size_bytes"
  exit 2
fi

ssh -F "$SSH_CFG" "$SSH_HOST" 'bash -s' -- "$APP_ENV" "$PUBLIC_URL" "$VERSION" "$RELEASE_DATE" "$SHA256" "$SIZE_BYTES" <<'EOF'
set -euo pipefail
APP_ENV="$1"
PUBLIC_URL="$2"
VERSION="$3"
RELEASE_DATE="$4"
SHA256="$5"
SIZE_BYTES="$6"

ensure_key() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" "$APP_ENV"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$APP_ENV"
  else
    printf '%s=%s\n' "$key" "$value" >> "$APP_ENV"
  fi
}

if [ -z "$SIZE_BYTES" ]; then
  SIZE_BYTES=0
fi

ensure_key VITE_DIRECT_DOWNLOAD_URL "$PUBLIC_URL"
ensure_key VITE_DIRECT_DOWNLOAD_SHA256_URL "${PUBLIC_URL}.sha256"
ensure_key VITE_ANDROID_RELEASE_VERSION "$VERSION"
ensure_key VITE_ANDROID_RELEASE_DATE "$RELEASE_DATE"
ensure_key VITE_ANDROID_RELEASE_SHA256 "$SHA256"
ensure_key VITE_ANDROID_RELEASE_SIZE_BYTES "$SIZE_BYTES"

grep -E '^VITE_(DIRECT_DOWNLOAD_URL|DIRECT_DOWNLOAD_SHA256_URL|ANDROID_RELEASE_VERSION|ANDROID_RELEASE_DATE|ANDROID_RELEASE_SHA256|ANDROID_RELEASE_SIZE_BYTES)=' "$APP_ENV"
EOF

echo "VPS_ANDROID_RELEASE_ENV_UPDATE=PASS"
