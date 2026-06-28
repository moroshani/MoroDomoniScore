#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <artifact-path> [public-filename]"
  exit 1
fi

ARTIFACT_PATH="$1"
PUBLIC_FILENAME="${2:-$(basename "$ARTIFACT_PATH")}"

if [ ! -f "$ARTIFACT_PATH" ]; then
  echo "artifact_not_found: $ARTIFACT_PATH"
  exit 1
fi

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
REMOTE_DOWNLOADS_DIR="${REMOTE_DOWNLOADS_DIR:-/var/www/morodomino/downloads}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-https://dominoyar.ir/downloads}"
REMOTE_PATH="$REMOTE_DOWNLOADS_DIR/$PUBLIC_FILENAME"
PUBLIC_URL="$PUBLIC_BASE_URL/$PUBLIC_FILENAME"

echo "[1/3] ensure remote downloads dir"
ssh -F "$SSH_CFG" "$SSH_HOST" "set -euo pipefail; sudo mkdir -p '$REMOTE_DOWNLOADS_DIR'; sudo chown \$(id -un):\$(id -gn) '$REMOTE_DOWNLOADS_DIR'"

echo "[2/3] upload artifact"
scp -F "$SSH_CFG" "$ARTIFACT_PATH" "$SSH_HOST:$REMOTE_PATH"
ssh -F "$SSH_CFG" "$SSH_HOST" "set -euo pipefail; chmod 644 '$REMOTE_PATH'"

SHA256="$(sha256sum "$ARTIFACT_PATH" | awk '{print $1}')"
ssh -F "$SSH_CFG" "$SSH_HOST" "set -euo pipefail; printf '%s  %s\n' '$SHA256' '$PUBLIC_FILENAME' > '$REMOTE_DOWNLOADS_DIR/$PUBLIC_FILENAME.sha256'; chmod 644 '$REMOTE_DOWNLOADS_DIR/$PUBLIC_FILENAME.sha256'"

echo "[3/3] print metadata"
"$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/scripts/ops/android_release_metadata.sh" "$ARTIFACT_PATH" "$PUBLIC_URL"

echo "PUBLISH_RESULT=PASS"
