#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://dominoyar.ir}"

check_code() {
  local path="$1"
  local expected="$2"
  local code
  code="$(curl -sS -L -o /tmp/probe_body -w '%{http_code}' --max-time 30 "$BASE_URL$path" || true)"
  echo "PROBE path=$path code=$code expected=$expected"
  if [ "$code" != "$expected" ]; then
    echo "probe_error: unexpected status for $path"
    cat /tmp/probe_body || true
    return 1
  fi
}

check_code "/api/health" "200"
check_code "/manifest.json" "200"
check_code "/sw.js" "200"
check_code "/offline.html" "200"
check_code "/" "200"
check_code "/profile" "200"
check_code "/settings" "200"
check_code "/api/users/me" "401"

headers="$(curl -sS -I --max-time 30 "$BASE_URL/api/health")"
echo "$headers" | grep -iq '^strict-transport-security:' || { echo "probe_error: missing strict-transport-security"; exit 2; }
echo "$headers" | grep -iq '^content-security-policy:' || { echo "probe_error: missing content-security-policy"; exit 3; }

echo "SYNTHETIC_PROBE=PASS"
