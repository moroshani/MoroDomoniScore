#!/usr/bin/env bash
set -euo pipefail

SSH_CFG="${SSH_CFG:-/mnt/c/Projects/morodomino/ssh_config}"
SSH_HOST="${SSH_HOST:-ariadashboardssh}"
APP_PATH="${APP_PATH:-/var/www/morodomino/app}"
PREVIOUS_PATH="${PREVIOUS_PATH:-/var/www/morodomino/app.previous}"
DRY_RUN="${DRY_RUN:-0}"

echo "[surface-clean] host=$SSH_HOST app=$APP_PATH previous=$PREVIOUS_PATH dry_run=$DRY_RUN"

ssh -F "$SSH_CFG" "$SSH_HOST" "APP_PATH='$APP_PATH' PREVIOUS_PATH='$PREVIOUS_PATH' DRY_RUN='$DRY_RUN' bash -s" <<'EOS'
set -euo pipefail

paths=(
  "android-native/android-app/.gradle"
  "android-native/android-app/app/build"
  "test-results"
  "playwright-report"
  "Yekan Bakh - Pro"
  "YekanBakh4 Pro"
  ".env.local"
)

clean_base() {
  local base="$1"
  [ -d "$base" ] || return 0

  local resolved_base
  resolved_base="$(realpath "$base")"
  case "$resolved_base" in
    /var/www/morodomino/*) ;;
    *)
      echo "surface_clean_error: refusing base outside /var/www/morodomino -> $resolved_base"
      exit 31
      ;;
  esac

  echo "SURFACE_BASE=$resolved_base"
  for rel in "${paths[@]}"; do
    local target="$resolved_base/$rel"
    if [ ! -e "$target" ]; then
      echo "SURFACE_MISSING=$target"
      continue
    fi

    local parent
    parent="$(realpath "$(dirname "$target")")"
    case "$parent" in
      "$resolved_base"|"$resolved_base"/*) ;;
      *)
        echo "surface_clean_error: refusing target outside base -> $target"
        exit 32
        ;;
    esac

    local size
    size="$(du -sh "$target" | awk '{print $1}')"
    echo "SURFACE_REMOVE=$target size=$size"
    if [ "$DRY_RUN" != "1" ]; then
      rm -rf -- "$target"
    fi
  done
}

clean_base "$APP_PATH"
clean_base "$PREVIOUS_PATH"

echo "SURFACE_CLEAN_RESULT=PASS"
EOS
