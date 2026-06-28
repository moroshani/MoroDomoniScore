import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const timestamp = Date.now();
const testDir = path.join(process.cwd(), 'test-results', 'screenshots');

test.beforeAll(() => {
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
});

test('capture access page screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/access');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(testDir, `access-${timestamp}.png`), fullPage: true });
    expect(true).toBeTruthy();
});

test('capture auth page screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(testDir, `auth-${timestamp}.png`), fullPage: true });
    expect(true).toBeTruthy();
});

test('capture quick game setup screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: '۲ بازیکن' }).first().click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(testDir, `quickgame-setup-${timestamp}.png`), fullPage: true });
    expect(true).toBeTruthy();
});

test('capture scoring screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: '۲ بازیکن' }).first().click();
    await page.getByLabel('نام بازیکن ۱ را وارد کنید').fill('آزمایشی ۱');
    await page.getByLabel('نام بازیکن ۲ را وارد کنید').fill('آزمایشی ۲');
    await page.getByRole('button', { name: 'ادامه', exact: true }).click();
    await page.getByRole('button', { name: 'شروع بازی', exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(testDir, `scoring-${timestamp}.png`), fullPage: true });
    expect(true).toBeTruthy();
});

test('capture settings page screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(testDir, `settings-${timestamp}.png`), fullPage: true });
    expect(true).toBeTruthy();
});

test('capture profile page screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(testDir, `profile-${timestamp}.png`), fullPage: true });
    expect(true).toBeTruthy();
});