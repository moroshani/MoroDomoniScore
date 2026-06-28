#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MYKET_CHECKLIST="$ROOT/android-native/compliance/myket_release_checklist.md"
BAZAAR_CHECKLIST="$ROOT/android-native/compliance/bazaar_release_checklist.md"
ENV_FILE="${1:-$ROOT/.env.local}"

fail() {
  echo "DUAL_STORE_CHECK=FAIL reason=$1"
  exit 1
}

[ -f "$MYKET_CHECKLIST" ] || fail "missing_myket_checklist"
[ -f "$BAZAAR_CHECKLIST" ] || fail "missing_bazaar_checklist"
[ -f "$ENV_FILE" ] || fail "missing_env_file"

grep -q 'Myket policy/rules review completed in panel before submission.' "$MYKET_CHECKLIST" || fail "myket_policy_gate_missing"
grep -q 'Cafe Bazaar Release Checklist' "$BAZAAR_CHECKLIST" || fail "bazaar_checklist_header_missing"
grep -q 'Publish/policy rules reviewed in Bazaar panel before submission.' "$BAZAAR_CHECKLIST" || fail "bazaar_policy_gate_missing"

# Required distribution env keys for release hub metadata
grep -q '^VITE_MYKET_APP_URL=' "$ENV_FILE" || fail "env_missing_myket_url"
grep -q '^VITE_DIRECT_DOWNLOAD_URL=' "$ENV_FILE" || fail "env_missing_direct_download_url"
grep -q '^VITE_DIRECT_DOWNLOAD_SHA256_URL=' "$ENV_FILE" || fail "env_missing_direct_download_sha256_url"
grep -q '^VITE_ANDROID_RELEASE_VERSION=' "$ENV_FILE" || fail "env_missing_release_version"
grep -q '^VITE_ANDROID_RELEASE_DATE=' "$ENV_FILE" || fail "env_missing_release_date"
grep -q '^VITE_ANDROID_RELEASE_SHA256=' "$ENV_FILE" || fail "env_missing_release_sha256"
grep -q '^VITE_ANDROID_RELEASE_SIZE_BYTES=' "$ENV_FILE" || fail "env_missing_release_size_bytes"

# Optional Bazaar lane flag and URL contract:
# - if enabled, Bazaar URL must be provided
if grep -q '^VITE_ENABLE_BAZAAR=' "$ENV_FILE"; then
  BAZAAR_ENABLED="$(grep '^VITE_ENABLE_BAZAAR=' "$ENV_FILE" | tail -n1 | cut -d'=' -f2- | tr -d '[:space:]' | tr '[:upper:]' '[:lower:]')"
  if [ "$BAZAAR_ENABLED" = "1" ] || [ "$BAZAAR_ENABLED" = "true" ] || [ "$BAZAAR_ENABLED" = "yes" ]; then
    grep -q '^VITE_BAZAAR_APP_URL=' "$ENV_FILE" || fail "env_missing_bazaar_url_key"
    BAZAAR_URL="$(grep '^VITE_BAZAAR_APP_URL=' "$ENV_FILE" | tail -n1 | cut -d'=' -f2- | tr -d '[:space:]')"
    [ -n "$BAZAAR_URL" ] || fail "env_empty_bazaar_url_when_enabled"
  fi
fi

echo "DUAL_STORE_CHECK=PASS"
