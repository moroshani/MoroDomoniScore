#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const fileArg = process.argv.find((arg) => arg.startsWith('--file='));
const filePath = fileArg ? fileArg.slice('--file='.length) : '.env.local';
const absolute = path.resolve(ROOT, filePath);

const requiredKeys = [
  'DATABASE_URL',
  'JWT_SECRET',
  'FRONTEND_URL',
  'API_PORT',
  'VITE_API_URL',
  'IMMORTAL_NAME',
  'IMMORTAL_USERNAME',
  'IMMORTAL_EMAIL',
  'IMMORTAL_PASSWORD'
];

const smtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
const distributionKeys = [
  'VITE_MYKET_APP_URL',
  'VITE_ENABLE_BAZAAR',
  'VITE_BAZAAR_APP_URL',
  'VITE_DIRECT_DOWNLOAD_URL',
  'VITE_DIRECT_DOWNLOAD_SHA256_URL',
  'VITE_ANDROID_RELEASE_VERSION',
  'VITE_ANDROID_RELEASE_DATE',
  'VITE_ANDROID_RELEASE_SHA256',
  'VITE_ANDROID_RELEASE_SIZE_BYTES'
];

if (!fs.existsSync(absolute)) {
  console.error(`ENV_CONTRACT=FAIL`);
  console.error(`MISSING_FILE=${absolute}`);
  process.exit(1);
}

const raw = fs.readFileSync(absolute, 'utf8');
const map = new Map();
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx <= 0) continue;
  const key = trimmed.slice(0, idx).trim();
  const value = trimmed.slice(idx + 1).trim();
  map.set(key, value);
}

const missing = [];
const empty = [];
const placeholders = [];
for (const key of requiredKeys) {
  if (!map.has(key)) {
    missing.push(key);
    continue;
  }
  const value = map.get(key) ?? '';
  if (!value) {
    empty.push(key);
    continue;
  }
  if (/replace-with-|change-me|example\.com/i.test(value)) {
    placeholders.push(key);
  }
}

const smtpPresent = smtpKeys.filter((key) => {
  const value = map.get(key);
  return typeof value === 'string' && value.trim().length > 0;
});
if (smtpPresent.length > 0 && smtpPresent.length < smtpKeys.length) {
  const smtpHost = (map.get('SMTP_HOST') || '').trim();
  const smtpPort = (map.get('SMTP_PORT') || '').trim();
  const smtpUser = (map.get('SMTP_USER') || '').trim();
  const smtpPass = (map.get('SMTP_PASS') || '').trim();
  const smtpFrom = (map.get('SMTP_FROM') || '').trim();
  const relayMode = smtpHost && smtpPort && smtpFrom && !smtpUser && !smtpPass;
  if (!relayMode) {
    for (const key of smtpKeys) {
      const value = map.get(key);
      if (!value || !value.trim()) {
        missing.push(key);
      }
    }
  }
}

const distributionErrors = [];
const read = (key) => (map.get(key) || '').trim();
const myketUrl = read('VITE_MYKET_APP_URL');
const bazaarEnabledRaw = read('VITE_ENABLE_BAZAAR').toLowerCase();
const bazaarEnabled = ['1', 'true', 'yes'].includes(bazaarEnabledRaw);
const bazaarUrl = read('VITE_BAZAAR_APP_URL');
const directDownloadUrl = read('VITE_DIRECT_DOWNLOAD_URL');
const directDownloadShaUrl = read('VITE_DIRECT_DOWNLOAD_SHA256_URL');
const releaseVersion = read('VITE_ANDROID_RELEASE_VERSION');
const releaseDate = read('VITE_ANDROID_RELEASE_DATE');
const releaseSha = read('VITE_ANDROID_RELEASE_SHA256');
const releaseSizeBytes = read('VITE_ANDROID_RELEASE_SIZE_BYTES');

if (myketUrl && !/^https:\/\//i.test(myketUrl)) {
  distributionErrors.push('invalid_myket_url_not_https');
}

if (bazaarEnabled && !bazaarUrl) {
  distributionErrors.push('missing_bazaar_url_when_enabled');
}
if (bazaarUrl && !/^https:\/\//i.test(bazaarUrl)) {
  distributionErrors.push('invalid_bazaar_url_not_https');
}

const metadataPresentCount = [directDownloadUrl, directDownloadShaUrl, releaseVersion, releaseDate, releaseSha, releaseSizeBytes].filter(Boolean).length;
if (metadataPresentCount > 0 && metadataPresentCount < 6) {
  distributionErrors.push('partial_direct_download_metadata');
}
if (directDownloadUrl && !/^https:\/\//i.test(directDownloadUrl)) {
  distributionErrors.push('invalid_direct_download_url_not_https');
}
if (directDownloadShaUrl && !/^https:\/\//i.test(directDownloadShaUrl)) {
  distributionErrors.push('invalid_direct_download_sha_url_not_https');
}
if (directDownloadUrl && directDownloadShaUrl && !directDownloadShaUrl.endsWith('.sha256')) {
  distributionErrors.push('invalid_direct_download_sha_url_suffix');
}
if (releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
  distributionErrors.push('invalid_release_date_format');
}
if (releaseSha && !/^[a-f0-9]{64}$/i.test(releaseSha)) {
  distributionErrors.push('invalid_release_sha256_format');
}
if (releaseSizeBytes && !/^\d+$/.test(releaseSizeBytes)) {
  distributionErrors.push('invalid_release_size_bytes_format');
}

const ok = missing.length === 0 && empty.length === 0 && placeholders.length === 0 && distributionErrors.length === 0;
console.log(`ENV_CONTRACT=${ok ? 'PASS' : 'FAIL'}`);
console.log(`ENV_FILE=${absolute}`);
console.log(`REQUIRED_KEY_COUNT=${requiredKeys.length}`);
console.log(`DISTRIBUTION_KEY_COUNT=${distributionKeys.length}`);
if (missing.length > 0) console.log(`MISSING_KEYS=${missing.join(',')}`);
if (empty.length > 0) console.log(`EMPTY_KEYS=${empty.join(',')}`);
if (placeholders.length > 0) console.log(`PLACEHOLDER_KEYS=${placeholders.join(',')}`);
if (distributionErrors.length > 0) console.log(`DISTRIBUTION_ERRORS=${distributionErrors.join(',')}`);

process.exit(ok ? 0 : 2);
