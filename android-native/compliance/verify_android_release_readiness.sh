#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="$ROOT/android-native/android-app"
APP_GRADLE="$APP_DIR/app/build.gradle.kts"
MANIFEST="$APP_DIR/app/src/main/AndroidManifest.xml"
CHECKLIST="$ROOT/android-native/compliance/myket_release_checklist.md"
MATRIX="$ROOT/android-native/compliance/device_compatibility_matrix.md"
README="$ROOT/android-native/compliance/README.md"

fail() {
  echo "CHECK=FAIL reason=$1"
  exit 1
}

[ -f "$APP_GRADLE" ] || fail "missing_app_gradle"
[ -f "$MANIFEST" ] || fail "missing_manifest"
[ -f "$CHECKLIST" ] || fail "missing_myket_checklist"
[ -f "$MATRIX" ] || fail "missing_device_matrix"
[ -f "$README" ] || fail "missing_compliance_readme"

grep -q 'applicationId = "com.morodomino.android"' "$APP_GRADLE" || fail "application_id_missing"
grep -q 'versionCode = ' "$APP_GRADLE" || fail "version_code_missing"
grep -q 'versionName = ' "$APP_GRADLE" || fail "version_name_missing"
grep -q 'targetSdk = ' "$APP_GRADLE" || fail "target_sdk_missing"
grep -q 'minSdk = ' "$APP_GRADLE" || fail "min_sdk_missing"
grep -q 'android.permission.INTERNET' "$MANIFEST" || fail "internet_permission_missing"

grep -q 'Stable `applicationId`.' "$CHECKLIST" || fail "checklist_app_id_missing"
grep -q 'Monotonic `versionCode`.' "$CHECKLIST" || fail "checklist_version_code_missing"
grep -q 'Signed release artifact ready.' "$CHECKLIST" || fail "checklist_signed_artifact_missing"
grep -q 'Runtime notification permission flow validated' "$MATRIX" || fail "matrix_notification_missing"
grep -q 'Offline' "$MATRIX" || fail "matrix_offline_missing"
grep -q 'Quick game setup/scoring' "$MATRIX" || fail "matrix_quick_game_missing"

echo "CHECK=PASS"
