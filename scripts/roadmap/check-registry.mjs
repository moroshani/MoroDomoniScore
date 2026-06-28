#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ROADMAP_DIR = path.join(ROOT, 'docs', 'roadmaps');
const REGISTRY_FILE = path.join(ROADMAP_DIR, 'registry.json');
const ALLOWED_STATUS = new Set(['planned', 'in-progress', 'blocked', 'done', 'deprecated']);
const ALLOWED_RISK = new Set(['low', 'medium', 'high']);
const ALLOWED_CONTRACTS = new Set(Array.from({ length: 11 }, (_, i) => `C${i + 1}`));

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_legacy') continue;
      walk(full, out);
      continue;
    }
    if (entry.name.endsWith('.md')) out.push(path.relative(ROOT, full).split(path.sep).join('/'));
  }
  return out;
};

const parseYmd = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const dt = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

if (!fs.existsSync(REGISTRY_FILE)) {
  console.error(`Missing registry file: ${path.relative(ROOT, REGISTRY_FILE)}`);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
const errors = [];

if (!registry || typeof registry !== 'object') errors.push('Registry root must be an object.');
if (!Array.isArray(registry.entries)) errors.push('Registry must contain entries array.');

const entries = Array.isArray(registry.entries) ? registry.entries : [];
const ids = new Set();
const paths = new Set();

for (const [idx, entry] of entries.entries()) {
  const where = `entry[${idx}]`;
  for (const key of ['id', 'path', 'owner', 'status', 'risk_level', 'last_reviewed_utc', 'next_review_utc', 'contracts', 'metadata']) {
    if (!(key in entry)) errors.push(`${where}: missing key '${key}'`);
  }

  if (typeof entry.id !== 'string' || !entry.id.trim()) errors.push(`${where}: invalid id`);
  if (typeof entry.path !== 'string' || !entry.path.trim()) errors.push(`${where}: invalid path`);

  if (ids.has(entry.id)) errors.push(`${where}: duplicate id '${entry.id}'`);
  ids.add(entry.id);

  if (paths.has(entry.path)) errors.push(`${where}: duplicate path '${entry.path}'`);
  paths.add(entry.path);

  const fullPath = path.join(ROOT, entry.path || '');
  if (!fs.existsSync(fullPath)) errors.push(`${where}: missing file '${entry.path}'`);

  if (!ALLOWED_STATUS.has(entry.status)) errors.push(`${where}: invalid status '${entry.status}'`);
  if (!ALLOWED_RISK.has(entry.risk_level)) errors.push(`${where}: invalid risk_level '${entry.risk_level}'`);

  const last = parseYmd(entry.last_reviewed_utc || '');
  const next = parseYmd(entry.next_review_utc || '');
  if (!last) errors.push(`${where}: invalid last_reviewed_utc '${entry.last_reviewed_utc}'`);
  if (!next) errors.push(`${where}: invalid next_review_utc '${entry.next_review_utc}'`);
  if (last && next && next < last) errors.push(`${where}: next_review_utc before last_reviewed_utc`);

  if (!Array.isArray(entry.contracts) || entry.contracts.length === 0) {
    errors.push(`${where}: contracts must be non-empty array`);
  } else {
    for (const c of entry.contracts) {
      if (!ALLOWED_CONTRACTS.has(c)) errors.push(`${where}: invalid contract '${c}'`);
    }
  }

  const metadata = entry.metadata || {};
  for (const key of ['title', 'scope', 'current_implementation_snapshot', 'priority_tiers', 'verification_contract_references', 'risk_and_rollback_summary']) {
    if (!(key in metadata)) errors.push(`${where}: metadata missing '${key}'`);
  }

  if (!Array.isArray(metadata.priority_tiers) || metadata.priority_tiers.length === 0) {
    errors.push(`${where}: metadata.priority_tiers must be non-empty array`);
  }

  if (!Array.isArray(metadata.verification_contract_references) || metadata.verification_contract_references.length === 0) {
    errors.push(`${where}: metadata.verification_contract_references must be non-empty array`);
  }
}

const activeFiles = walk(ROADMAP_DIR).sort();
const missingInRegistry = activeFiles.filter((f) => !paths.has(f));
const extraInRegistry = [...paths].filter((p) => !activeFiles.includes(p)).sort();
if (missingInRegistry.length) errors.push(`Active files missing from registry: ${missingInRegistry.join(', ')}`);
if (extraInRegistry.length) errors.push(`Registry paths not in active files: ${extraInRegistry.join(', ')}`);

const today = new Date();
const stale = entries.filter((entry) => {
  const next = parseYmd(entry.next_review_utc || '');
  return next && next < new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
});

if (stale.length) {
  errors.push(`Stale roadmap entries: ${stale.map((x) => x.id).join(', ')}`);
}

if (errors.length) {
  console.error('REGISTRY_CHECK=FAIL');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('REGISTRY_CHECK=PASS');
console.log(`REGISTRY_ENTRY_COUNT=${entries.length}`);
console.log(`ACTIVE_FILE_COUNT=${activeFiles.length}`);
