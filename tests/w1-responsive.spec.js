import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test.setTimeout(300000);

const widths = [320, 360, 375, 390, 412, 430, 768, 1024, 1366, 1920];
const routes = ['/', '/profile', '/settings'];
const base = 'http://127.0.0.1:4173';
const defaultUsername = process.env.W1_UI_USERNAME || 'moroshaniofficil';
const defaultPassword = process.env.W1_UI_PASSWORD || 'LocalImmortal!123';

test('responsive contract sweep', async ({ page }) => {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('ایمیل یا نام کاربری').fill(defaultUsername);
  await page.getByPlaceholder('رمز عبور').fill(defaultPassword);
  await page.getByRole('button', { name: 'ورود', exact: true }).click();
  await page.waitForTimeout(1000);

  const results = [];
  for (const route of routes) {
    for (const width of widths) {
      const height = width >= 1024 ? 900 : 844;
      await page.setViewportSize({ width, height });
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      const metrics = await page.evaluate(() => {
        const body = document.body;
        const doc = document.documentElement;
        const hasOverflow = doc.scrollWidth > window.innerWidth + 1 || body.scrollWidth > window.innerWidth + 1;
        return {
          scrollWidth: doc.scrollWidth,
          bodyScrollWidth: body.scrollWidth,
          viewportWidth: window.innerWidth,
          hasOverflow
        };
      });
      const token = route === '/' ? 'home' : route.slice(1);
      const screenshotPath = `test-results/wave1-responsive/${token}-${width}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.push({ route, width, ...metrics, screenshotPath });
      expect(metrics.hasOverflow, `overflow at ${route} width ${width}`).toBeFalsy();
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalChecks: results.length,
    overflowFailures: results.filter((item) => item.hasOverflow),
    checks: results
  };
  fs.writeFileSync('test-results/wave1-responsive/report.json', JSON.stringify(report, null, 2));
});
