#!/usr/bin/env bash
set -euo pipefail

DOMAINS=("$@")
if [ ${#DOMAINS[@]} -eq 0 ]; then
  DOMAINS=(
    "dominoyar.ir"
    "www.dominoyar.ir"
    "smtp.dominoyar.ir"
  )
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "tls_audit_error: openssl not found"
  exit 1
fi
if ! command -v curl >/dev/null 2>&1; then
  echo "tls_audit_error: curl not found"
  exit 1
fi

echo "TLS_AUDIT_STARTED=$(date -u +%Y-%m-%dT%H:%M:%SZ)"

for domain in "${DOMAINS[@]}"; do
  echo "---"
  echo "DOMAIN=$domain"

  http_code="$(curl -sS -L -o /dev/null -w '%{http_code}' --max-time 25 "https://$domain/" || true)"
  echo "HTTPS_CODE=$http_code"

  cert_info="$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null || true)"
  if [ -z "$cert_info" ]; then
    echo "TLS_CERT=unavailable"
  else
    echo "$cert_info" | sed 's/^/TLS_/g'
  fi

  if command -v dig >/dev/null 2>&1; then
    a_records="$(dig +short A "$domain" | tr '\n' ' ' | sed 's/ $//')"
    aaaa_records="$(dig +short AAAA "$domain" | tr '\n' ' ' | sed 's/ $//')"
    echo "DNS_A=${a_records:-none}"
    echo "DNS_AAAA=${aaaa_records:-none}"
  else
    resolved="$(getent ahosts "$domain" | awk '{print $1}' | sort -u | tr '\n' ' ' | sed 's/ $//')"
    echo "DNS_RESOLVED=${resolved:-none}"
  fi

  if [ "$domain" = "smtp.dominoyar.ir" ] || [ "$domain" = "dominoyar.ir" ]; then
    if command -v dig >/dev/null 2>&1; then
      spf="$(dig +short TXT "$domain" | tr '\n' ' ' | sed 's/ $//')"
      dmarc="$(dig +short TXT "_dmarc.$domain" | tr '\n' ' ' | sed 's/ $//')"
      echo "DNS_TXT_SPF=${spf:-none}"
      echo "DNS_TXT_DMARC=${dmarc:-none}"
    fi
  fi

done

echo "TLS_AUDIT_DONE=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
