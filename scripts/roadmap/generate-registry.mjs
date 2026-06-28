#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ROADMAP_DIR = path.join(ROOT, 'docs', 'roadmaps');
const REGISTRY_FILE = path.join(ROADMAP_DIR, 'registry.json');

const now = new Date();
const y = now.getUTCFullYear();
const m = String(now.getUTCMonth() + 1).padStart(2, '0');
const d = String(now.getUTCDate()).padStart(2, '0');
const today = `${y}-${m}-${d}`;
const generatedAt = now.toISOString();

const addDays = (isoDate, days) => {
  const dt = new Date(`${isoDate}T00:00:00.000Z`);
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_legacy') continue;
      walk(full, out);
      continue;
    }
    if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
};

const activeFiles = walk(ROADMAP_DIR).sort();

const rel = (file) => path.relative(ROOT, file).split(path.sep).join('/');

const topicMeta = (relativePath) => {
  const topic = relativePath.replace('docs/roadmaps/', '').split('/')[0];
  const defaults = {
    owner: 'product-engineering',
    status: 'planned',
    risk_level: 'medium',
    review_days: 45,
    contracts: ['C1', 'C9', 'C10']
  };

  if (topic === 'contracts' || topic === '01-foundation') {
    return { ...defaults, owner: 'governance', status: 'done', risk_level: 'high', review_days: 30, contracts: ['C9', 'C10'] };
  }
  if (topic === '02-pwa-cross-platform') {
    return { ...defaults, owner: 'pwa-platform', risk_level: 'high', review_days: 45, contracts: ['C1', 'C3', 'C4', 'C8', 'C9', 'C10', 'C11'] };
  }
  if (topic === '03-auth-session-security') {
    return { ...defaults, owner: 'security-auth', risk_level: 'high', review_days: 30, contracts: ['C1', 'C2', 'C6', 'C9', 'C10', 'C11'] };
  }
  if (topic === '04-ui-responsive-accessibility') {
    return { ...defaults, owner: 'ui-ux', risk_level: 'medium', review_days: 45, contracts: ['C1', 'C4', 'C5', 'C9', 'C10'] };
  }
  if (topic === '05-performance-reliability') {
    return { ...defaults, owner: 'performance-reliability', risk_level: 'high', review_days: 30, contracts: ['C1', 'C7', 'C8', 'C9', 'C10'] };
  }
  if (topic === '06-product-surface') {
    return { ...defaults, owner: 'product-engineering', risk_level: 'high', review_days: 45, contracts: ['C1', 'C2', 'C4', 'C5', 'C9', 'C10', 'C11'] };
  }
  if (topic === '07-devops-release') {
    return { ...defaults, owner: 'platform-ops', risk_level: 'high', review_days: 30, contracts: ['C1', 'C7', 'C8', 'C9', 'C10'] };
  }
    return { ...defaults, owner: 'automation-ops', risk_level: 'medium', review_days: 30, contracts: ['C1', 'C7', 'C9', 'C10'] };
  }
  if (topic === '09-strategy-future') {
    return { ...defaults, owner: 'strategy', risk_level: 'medium', review_days: 60, contracts: ['C1', 'C9', 'C10'] };
  }
  if (topic === '10-alliance-shared-identity') {
    return { ...defaults, owner: 'collaboration-platform', risk_level: 'high', review_days: 30, contracts: ['C1', 'C2', 'C3', 'C4', 'C6', 'C8', 'C9', 'C10', 'C11'] };
  }
  if (relativePath === 'docs/roadmaps/README.md' || relativePath === 'docs/roadmaps/IMPLEMENTATION_ORDER.md' || relativePath === 'docs/roadmaps/IMPLEMENTATION_READINESS.md') {
    return { ...defaults, owner: 'governance', status: 'done', risk_level: 'medium', review_days: 30, contracts: ['C9', 'C10'] };
  }
  return defaults;
};

const parseMetadata = (content, relativePath, contracts) => {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const statusMatch = content.match(/^Status:\s*(.+)$/m);
  const scopeMatch = content.match(/^##\s+Scope\s*\n([^#\n].*)/m);
  const hasP0 = /\bP0\b/.test(content);
  const hasP1 = /\bP1\b/.test(content);
  const hasP2 = /\bP2\b/.test(content);
  const priorityTiers = [hasP0 ? 'P0' : null, hasP1 ? 'P1' : null, hasP2 ? 'P2' : null].filter(Boolean);

  return {
    title: titleMatch ? titleMatch[1].trim() : path.basename(relativePath),
    scope: scopeMatch ? scopeMatch[1].trim() : `Roadmap scope for ${relativePath}`,
    current_implementation_snapshot: statusMatch ? statusMatch[1].trim() : 'Documented in roadmap file.',
    priority_tiers: priorityTiers.length ? priorityTiers : ['P0'],
    verification_contract_references: contracts,
    risk_and_rollback_summary: 'See section "Risk and Rollback Summary" in roadmap file.'
  };
};

const entries = activeFiles.map((file) => {
  const relativePath = rel(file);
  const content = fs.readFileSync(file, 'utf8');
  const meta = topicMeta(relativePath);
  const id = relativePath.replace('docs/roadmaps/', '').replace(/\.md$/, '');

  return {
    id,
    path: relativePath,
    owner: meta.owner,
    status: meta.status,
    risk_level: meta.risk_level,
    last_reviewed_utc: today,
    next_review_utc: addDays(today, meta.review_days),
    contracts: meta.contracts,
    metadata: parseMetadata(content, relativePath, meta.contracts)
  };
});

const registry = {
  version: 1,
  generated_at_utc: generatedAt,
  source: 'scripts/roadmap/generate-registry.mjs',
  entries
};

const shouldWrite = process.argv.includes('--write');
const json = `${JSON.stringify(registry, null, 2)}\n`;
if (shouldWrite) {
  fs.writeFileSync(REGISTRY_FILE, json, 'utf8');
  console.log(`REGISTRY_WRITTEN=${path.relative(ROOT, REGISTRY_FILE)}`);
}

console.log(`REGISTRY_ENTRIES=${entries.length}`);
