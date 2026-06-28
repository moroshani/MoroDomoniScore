#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const indexPath = path.join(ROOT, 'docs', 'ROADMAP.md');
const content = fs.readFileSync(indexPath, 'utf8');
const refs = [...content.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
const missing = [];
for (const p of refs) {
  if (!p.startsWith('docs/')) continue;
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) missing.push(p);
}
if (missing.length) {
  console.error('ROADMAP_INDEX_CHECK=FAIL');
  for (const p of missing) console.error(`- Missing: ${p}`);
  process.exit(1);
}
console.log('ROADMAP_INDEX_CHECK=PASS');
console.log(`ROADMAP_INDEX_REF_COUNT=${refs.length}`);
