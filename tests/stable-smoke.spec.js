import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const password = 'StableQuick!123';
const updatedPassword = 'StableQuick!456';
const registeredUser = {
  name: `Stable User ${timestamp}`,
  username: `stableuser${timestamp}`,
  email: `stableuser${timestamp}@example.com`
};

const login = async (page, identifier = registeredUser.username, secret = password) => {
  await page.goto('/auth');
  await page.getByPlaceholder('ایمیل یا نام کاربری').fill(identifier);
  await page.getByPlaceholder('رمز عبور').fill(secret);
  await page.getByRole('button', { name: 'ورود', exact: true }).click();
  await expect(page.getByText('یکی از حالت های سریع بازی را انتخاب کنید')).toBeVisible();
};

const openMenu = async (page) => {
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  await expect(page.getByRole('button', { name: 'خروج از حساب' })).toBeVisible();
};

test('stable auth, quick game, settings, profile, and pwa surfaces work', async ({ page, request }) => {
  await page.goto('/access');
  await page.getByRole('button', { name: 'ثبت‌نام', exact: true }).click();
  await page.getByPlaceholder('نام کامل').fill(registeredUser.name);
  await page.getByPlaceholder('نام کاربری').fill(registeredUser.username);
  await page.getByPlaceholder('ایمیل').fill(registeredUser.email);
  await page.getByPlaceholder('رمز عبور').fill(password);
  await page.getByRole('button', { name: 'ثبت نام', exact: true }).click();

  await expect(page.getByText('یکی از حالت های سریع بازی را انتخاب کنید')).toBeVisible();

  await page.getByRole('button', { name: '۲ بازیکن' }).click();
  await page.getByLabel('نام بازیکن ۱ را وارد کنید').fill('علی');
  await page.getByLabel('نام بازیکن ۲ را وارد کنید').fill('رضا');
  await page.getByRole('button', { name: 'ادامه', exact: true }).click();
  await page.getByRole('button', { name: 'شروع بازی', exact: true }).click();
  await expect(page.getByText('علی')).toBeVisible();
  await expect(page.getByText('رضا')).toBeVisible();
  await page.getByRole('button', { name: 'بازنشانی', exact: true }).click();

  await page.getByRole('button', { name: '۳ بازیکن' }).click();
  await page.getByLabel('نام بازیکن ۱ را وارد کنید').fill('آرش');
  await page.getByLabel('نام بازیکن ۲ را وارد کنید').fill('نوید');
  await page.getByLabel('نام بازیکن ۳ را وارد کنید').fill('سام');
  await page.getByRole('button', { name: 'ادامه', exact: true }).click();
  await page.getByRole('button', { name: 'شروع بازی', exact: true }).click();
  await expect(page.getByText('آرش')).toBeVisible();
  await expect(page.getByText('نوید')).toBeVisible();
  await expect(page.getByText('سام')).toBeVisible();
  await page.getByRole('button', { name: 'بازنشانی', exact: true }).click();

  await page.getByRole('button', { name: '۴ بازیکن' }).click();
  await page.getByLabel('تیم ۱ را وارد کنید').fill('تیم آبی');
  await page.getByLabel('تیم ۲ را وارد کنید').fill('تیم قرمز');
  await page.getByRole('button', { name: 'ادامه', exact: true }).click();
  await page.getByRole('button', { name: 'شروع بازی', exact: true }).click();
  await expect(page.getByText('تیم آبی')).toBeVisible();
  await expect(page.getByText('تیم قرمز')).toBeVisible();

  await openMenu(page);
  await page.getByText('حالت نمایش').locator('..').getByRole('button').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'بستن', exact: true }).click();

  await openMenu(page);
  await page.getByRole('link', { name: 'تنظیمات' }).click();
  await expect(page.getByRole('heading', { name: 'تنظیمات برنامه' })).toBeVisible();
  await expect(page.getByText('پشتیبانی سرویس‌ورکر:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'بررسی بروزرسانی' })).toBeVisible();
  await page.getByRole('button', { name: 'وضعیت' }).first().click();

  await page.getByRole('button', { name: 'رفتن به پروفایل' }).click();
  await expect(page.getByRole('heading', { name: 'پروفایل' })).toBeVisible();
  await page.getByLabel('نام').fill(`${registeredUser.name} Updated`);
  await page.getByLabel('نام کاربری').fill(`${registeredUser.username}u`);
  await page.getByLabel('ایمیل').fill(`updated-${registeredUser.email}`);
  await page.getByRole('button', { name: 'ذخیره تغییرات' }).click();
  await expect(page.getByText('اطلاعات حساب بروزرسانی شد.')).toBeVisible();

  await page.getByLabel('رمز فعلی').fill(password);
  await page.getByLabel('رمز جدید').fill(updatedPassword);
  await page.getByRole('button', { name: 'تغییر رمز عبور' }).click();
  await expect(page.getByText('رمز عبور با موفقیت تغییر کرد.')).toBeVisible();

  await openMenu(page);
  await page.getByRole('button', { name: 'خروج از حساب' }).click();
  await expect(page.getByRole('button', { name: 'ورود', exact: true })).toBeVisible();

  await login(page, `updated-${registeredUser.email}`, updatedPassword);

  const manifest = await request.get('/manifest.json');
  expect(manifest.ok()).toBeTruthy();

  const sw = await request.get('/sw.js');
  expect(sw.ok()).toBeTruthy();
});
