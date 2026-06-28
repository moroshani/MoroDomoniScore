#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ROADMAP_DIR = path.join(ROOT, 'docs', 'roadmaps');

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_legacy' || entry.name === 'contracts' || !/^\d{2}-/.test(entry.name)) continue;
      walk(full, out);
      continue;
    }
    if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
};

const files = walk(ROADMAP_DIR).sort();
const checks = [
  { name: 'title', test: (c) => /^#\s+.+/m.test(c), message: 'Missing title (# ...)' },
  { name: 'last_updated', test: (c) => /Last updated:\s*\d{4}-\d{2}-\d{2}/.test(c), message: 'Missing Last updated date' },
  { name: 'scope', test: (c) => /##\s+Scope\b/.test(c), message: 'Missing Scope section' },
  { name: 'current_snapshot', test: (c) => /##\s+Current\s+(Implementation\s+(Snapshot|Baseline)|Snapshot)\b/.test(c), message: 'Missing Current Implementation Snapshot/Baseline section' },
  { name: 'priorities', test: (c) => /\bP0\b/.test(c) && /\bP1\b/.test(c) && /\bP2\b/.test(c), message: 'Missing P0/P1/P2 priorities' },
  { name: 'verification', test: (c) => /##\s+Verification\b/.test(c), message: 'Missing Verification section' },
  { name: 'verification_contract_refs', test: (c) => /##\s+Verification\s+Contract\s+References\b/.test(c) || /\bC1\b/.test(c), message: 'Missing contract references (C*)' },
  { name: 'risk_rollback', test: (c) => /##\s+Risk\s+and\s+Rollback\s+Summary\b/.test(c), message: 'Missing Risk and Rollback Summary section' },
  { name: 'finalization_stamp', test: (c) => /##\s+Implementation-Ready\s+Finalization\s+\(2026-02-24\)/.test(c), message: 'Missing finalization stamp' }
];

const errors = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const check of checks) {
    if (!check.test(content)) {
      errors.push(`${path.relative(ROOT, file)}: ${check.message}`);
    }
  }
}

if (errors.length) {
  console.error('METADATA_CHECK=FAIL');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('METADATA_CHECK=PASS');
console.log(`METADATA_FILE_COUNT=${files.length}`);
