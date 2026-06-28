#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const fail = [];
const warn = [];

const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const forbiddenRuntimeFiles = [
  'components/History.tsx',
  'components/Stats.tsx',
  'components/AIAnalysisModal.tsx',
  'components/AIAvatarGeneratorModal.tsx',
  'components/PlayerManagementModal.tsx',
  'components/ProfileManager.tsx',
  'components/TrashTalkModal.tsx',
  'components/charts/BarChart.tsx',
  'lib/players.ts',
  'lib/stats.ts',
  'lib/storage.ts',
  'lib/alliance.ts',
  'server/sync-server.js',
  'server/api/routes/alliances.js',
  'server/api/routes/history.js',
  'server/api/routes/players.js',
  'server/api/routes/realtime.js'
];

for (const rel of forbiddenRuntimeFiles) {
  if (exists(rel)) fail.push(`forbidden_runtime_file=${rel}`);
}

const forbiddenEnvKeys = [
  'VITE_SYNC_URL',
  'SYNC_PORT',
  'ALLIANCE_IDENTITY_V1',
  'SCOPE_WORLD_ALLIANCE_V1',
  'CHAT_SURFACE_V1',
  'SYNC_OBSERVABILITY_V1',
  'ALLIANCE_INVITE_PEPPER'
];

if (exists('.env.example')) {
  const envExample = read('.env.example');
  for (const key of forbiddenEnvKeys) {
    if (new RegExp(`^${key}=`, 'm').test(envExample)) {
      fail.push(`forbidden_env_example_key=${key}`);
    }
  }
} else {
  fail.push('missing_env_example');
}

const expectedRoutes = new Set(['/', '/profile', '/settings', '/auth', '/access', '*']);
if (exists('App.tsx')) {
  const app = read('App.tsx');
  const routeMatches = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
  for (const route of routeMatches) {
    if (!expectedRoutes.has(route)) fail.push(`unexpected_app_route=${route}`);
  }
  for (const route of expectedRoutes) {
    if (!routeMatches.includes(route)) fail.push(`missing_app_route=${route}`);
  }
}

if (exists('server/api/index.js')) {
  const api = read('server/api/index.js');
  const forbiddenApiPatterns = [
    /routes\/alliances/,
    /routes\/history/,
    /routes\/players/,
    /routes\/realtime/,
    /\/api\/alliances/,
    /\/api\/history/,
    /\/api\/players/,
    /\/api\/realtime/
  ];
  for (const pattern of forbiddenApiPatterns) {
    if (pattern.test(api)) fail.push(`forbidden_api_composition=${pattern.source}`);
  }
}

if (exists('scripts/ops/rollback_last_release.sh')) {
  const rollback = read('scripts/ops/rollback_last_release.sh');
  if (/SYNC_SERVICE|morodomino-domino-sync/.test(rollback)) {
    fail.push('rollback_references_archived_sync_service');
  }
}

if (exists('docs/roadmaps/10-alliance-shared-identity/README.md')) {
  const allianceRoadmap = read('docs/roadmaps/10-alliance-shared-identity/README.md');
  if (!/Historical-only note:/.test(allianceRoadmap)) {
    warn.push('alliance_roadmap_missing_historical_note');
  }
}

console.log(`PRODUCT_SCOPE=${fail.length === 0 ? 'PASS' : 'FAIL'}`);
console.log('ACTIVE_TRACKS=stable-web-pwa,native-android,demo-web');
console.log(`FORBIDDEN_RUNTIME_FILE_COUNT=${forbiddenRuntimeFiles.length}`);
console.log(`FORBIDDEN_ENV_KEY_COUNT=${forbiddenEnvKeys.length}`);
if (warn.length > 0) console.log(`SCOPE_WARNINGS=${warn.join(',')}`);
if (fail.length > 0) console.log(`SCOPE_ERRORS=${fail.join(',')}`);

process.exit(fail.length === 0 ? 0 : 2);
