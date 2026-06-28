import { defineConfig } from '@playwright/test';
import path from 'node:path';

const repo = process.cwd();
const node = process.execPath;
const vite = path.join(repo, 'node_modules', 'vite', 'bin', 'vite.js');
const quote = (value) => `"${value.replace(/"/g, '\\"')}"`;

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined
  },
  webServer: [
    {
      command: `${quote(node)} server/api/index.js`,
      url: 'http://127.0.0.1:4000/api/health',
      reuseExistingServer: true,
      timeout: 120000
    },
    {
      command: `${quote(node)} ${quote(vite)} --host 127.0.0.1 --port 4173`,
      env: {
        VITE_API_URL: 'http://127.0.0.1:4000'
      },
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: true,
      timeout: 120000
    }
  ]
});
