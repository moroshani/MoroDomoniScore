#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';

const ROOT = process.cwd();
const ARTIFACT_DIR = path.join(ROOT, 'docs', 'roadmaps', 'artifacts');
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const run = (name, cmd, args, env = process.env) => {
  const startedAt = new Date().toISOString();
  const r = spawnSync(cmd, args, { cwd: ROOT, env, encoding: 'utf8' });
  const endedAt = new Date().toISOString();
  const ok = r.status === 0;
  return {
    name,
    command: `${cmd} ${args.join(' ')}`,
    ok,
    status: r.status,
    started_at_utc: startedAt,
    ended_at_utc: endedAt,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim()
  };
};

const runId = new Date().toISOString();
const results = [];

const normalizeResult = run('normalize_metadata', 'node', ['scripts/roadmap/normalize-metadata.mjs']);
const normalizedMatch = (normalizeResult.stdout || '').match(/FILES_NORMALIZED=(\d+)/);
const normalizedCount = normalizedMatch ? Number(normalizedMatch[1]) : NaN;
if (Number.isFinite(normalizedCount) && normalizedCount > 0) {
  normalizeResult.ok = false;
  normalizeResult.status = 2;
  normalizeResult.stderr = [
    normalizeResult.stderr || '',
    `Wave 0 requires clean metadata. Found ${normalizedCount} auto-normalized files; rerun and commit changes.`
  ].filter(Boolean).join('\n');
}
results.push(normalizeResult);
results.push(run('generate_registry', 'node', ['scripts/roadmap/generate-registry.mjs', '--write']));
results.push(run('check_registry', 'node', ['scripts/roadmap/check-registry.mjs']));
results.push(run('check_metadata', 'node', ['scripts/roadmap/check-metadata.mjs']));
results.push(run('check_index', 'node', ['scripts/roadmap/check-index.mjs']));

results.push(run('build', 'npm', ['run', 'build']));

let prismaEnv = { ...process.env };
const envLocal = path.join(ROOT, '.env.local');
if (fs.existsSync(envLocal)) {
  const loaded = dotenv.config({ path: envLocal });
  if (!loaded.error) prismaEnv = { ...prismaEnv, ...loaded.parsed };
}
results.push(run('prisma_validate', 'npx', ['prisma', 'validate'], prismaEnv));

const allOk = results.every((r) => r.ok);
const status = {
  wave: 'Wave 0',
  run_at_utc: runId,
  pass: allOk,
  checks: results,
  gates: {
    G0_research_gate: results.find((r) => r.name === 'check_metadata')?.ok && results.find((r) => r.name === 'check_registry')?.ok,
    G1_design_gate: results.find((r) => r.name === 'check_metadata')?.ok,
    G2_build_gate: results.find((r) => r.name === 'build')?.ok && results.find((r) => r.name === 'prisma_validate')?.ok,
    G6_governance_gate: results.find((r) => r.name === 'check_registry')?.ok && results.find((r) => r.name === 'check_index')?.ok
  },
  contracts: {
    C1: results.find((r) => r.name === 'build')?.ok && results.find((r) => r.name === 'prisma_validate')?.ok,
    C9: results.find((r) => r.name === 'check_metadata')?.ok,
    C10: results.find((r) => r.name === 'check_registry')?.ok && results.find((r) => r.name === 'check_index')?.ok
  }
};

const jsonPath = path.join(ARTIFACT_DIR, 'wave0-gate-status.json');
fs.writeFileSync(jsonPath, `${JSON.stringify(status, null, 2)}\n`, 'utf8');

const mdLines = [];
mdLines.push('# Wave 0 Governance Signoff');
mdLines.push('');
mdLines.push(`Generated: ${runId}`);
mdLines.push('');
mdLines.push(`Overall status: ${allOk ? 'PASS' : 'FAIL'}`);
mdLines.push('');
mdLines.push('## Gate Status');
for (const [gate, gatePass] of Object.entries(status.gates)) {
  mdLines.push(`- ${gate}: ${gatePass ? 'PASS' : 'FAIL'}`);
}
mdLines.push('');
mdLines.push('## Contract Status');
for (const [contract, contractPass] of Object.entries(status.contracts)) {
  mdLines.push(`- ${contract}: ${contractPass ? 'PASS' : 'FAIL'}`);
}
mdLines.push('');
mdLines.push('## Check Results');
for (const check of results) {
  mdLines.push(`- ${check.name}: ${check.ok ? 'PASS' : 'FAIL'} (${check.command})`);
}
mdLines.push('');
mdLines.push('## Notes');
mdLines.push('- This artifact is the Wave 0 governance signoff output required by the 01-foundation roadmap.');
mdLines.push('- If any check fails, Wave 0 is not complete and implementation should not proceed.');

const mdPath = path.join(ARTIFACT_DIR, 'wave0-governance-signoff.md');
fs.writeFileSync(mdPath, `${mdLines.join('\n')}\n`, 'utf8');

console.log(`WAVE0_STATUS=${allOk ? 'PASS' : 'FAIL'}`);
console.log(`WAVE0_JSON=${path.relative(ROOT, jsonPath)}`);
console.log(`WAVE0_MD=${path.relative(ROOT, mdPath)}`);

if (!allOk) process.exit(1);
