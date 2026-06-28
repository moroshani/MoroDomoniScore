#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <artifact-path> [public-url]"
  exit 1
fi

ARTIFACT_PATH="$1"
PUBLIC_URL="${2:-}"

if [ ! -f "$ARTIFACT_PATH" ]; then
  echo "artifact_not_found: $ARTIFACT_PATH"
  exit 1
fi

FILENAME="$(basename "$ARTIFACT_PATH")"
RELEASE_DATE="$(date -u +%Y-%m-%d)"
SHA256="$(sha256sum "$ARTIFACT_PATH" | awk '{print $1}')"
SIZE_BYTES="$(stat -c%s "$ARTIFACT_PATH")"

echo "ANDROID_ARTIFACT=$FILENAME"
echo "ANDROID_RELEASE_DATE=$RELEASE_DATE"
echo "ANDROID_SIZE_BYTES=$SIZE_BYTES"
echo "ANDROID_SHA256=$SHA256"
if [ -n "$PUBLIC_URL" ]; then
  echo "ANDROID_PUBLIC_URL=$PUBLIC_URL"
fi

echo
echo "ENV_EXPORTS_BEGIN"
echo "VITE_DIRECT_DOWNLOAD_URL=${PUBLIC_URL}"
if [ -n "$PUBLIC_URL" ]; then
  echo "VITE_DIRECT_DOWNLOAD_SHA256_URL=${PUBLIC_URL}.sha256"
fi
echo "VITE_ANDROID_RELEASE_DATE=${RELEASE_DATE}"
echo "VITE_ANDROID_RELEASE_SHA256=${SHA256}"
echo "VITE_ANDROID_RELEASE_SIZE_BYTES=${SIZE_BYTES}"
echo "ENV_EXPORTS_END"
