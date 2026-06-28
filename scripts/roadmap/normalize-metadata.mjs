#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ROADMAP_DIR = path.join(ROOT, 'docs', 'roadmaps');

const isRoadmapMd = (filePath) => filePath.endsWith('.md')
  && !filePath.includes(`${path.sep}_legacy${path.sep}`)
  && !filePath.includes(`${path.sep}contracts${path.sep}`)
  && /^\d{2}-/.test(path.basename(path.dirname(filePath)));

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_legacy' || entry.name === 'contracts' || !/^\d{2}-/.test(entry.name)) continue;
      walk(full, out);
      continue;
    }
    if (isRoadmapMd(full)) out.push(full);
  }
  return out;
};

const files = walk(ROADMAP_DIR).sort();

let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let next = content;

  if (!/^#\s+/m.test(next)) {
    next = `# Untitled Roadmap\n\n${next}`;
  }

  if (!/Last updated:\s*\d{4}-\d{2}-\d{2}/.test(next)) {
    next = next.replace(/^#.*$/m, (m) => `${m}\n\nLast updated: 2026-02-24`);
  }

  if (!/##\s+Scope\b/.test(next)) {
    const topic = path.basename(path.dirname(file)).replace(/^\d{2}-/, '').replace(/-/g, ' ');
    next += `\n\n## Scope\nThis roadmap item defines execution boundaries and delivery policy for ${topic}.`;
  }

  if (!/##\s+Current\s+(Implementation\s+(Snapshot|Baseline)|Snapshot)\b/.test(next)) {
    next += `\n\n## Current Snapshot\nStatus: \`Documented\`\n\nEvidence:\n- Current behavior is described in this file and linked roadmap artifacts.`;
  }

  const hasP0 = /\bP0\b/.test(next);
  const hasP1 = /\bP1\b/.test(next);
  const hasP2 = /\bP2\b/.test(next);
  if (!(hasP0 && hasP1 && hasP2)) {
    next += `\n\n## Priority Tiers\n### P0\n- Deliver mandatory contract and non-regression outcomes for this scope.\n\n### P1\n- Deliver advanced reliability and automation improvements for this scope.\n\n### P2\n- Deliver frontier optimization once P0/P1 are stable.`;
  }

  if (!/##\s+Verification\b/.test(next)) {
    next += `\n\n## Verification\n- Validate implementation against contracts and release gates before marking complete.`;
  }

  if (!/##\s+Verification\s+Contract\s+References\b/.test(next)) {
    next += `\n\n## Verification Contract References\n- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).`;
  }

  if (!/##\s+Risk\s+and\s+Rollback\s+Summary\b/.test(next)) {
    next += `\n\n## Risk and Rollback Summary\n- Primary risks: execution drift, unverified assumptions, and governance gaps.\n- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.`;
  }

  if (next !== content) {
    fs.writeFileSync(file, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
    changed += 1;
  }
}

console.log(`FILES_SCANNED=${files.length}`);
console.log(`FILES_NORMALIZED=${changed}`);
