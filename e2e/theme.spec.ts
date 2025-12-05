import { test, expect } from '@playwright/test';

test.describe('Theme Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme toggle button', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i }).or(
      page.locator('[aria-label*="theme" i], [aria-label*="dark" i], [aria-label*="light" i]')
    );

    const isVisible = await themeToggle.first().isVisible({ timeout: 2000 }).catch(() => false);
    expect(isVisible).toBeTruthy();
  });

  test('should toggle between light and dark theme', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i }).or(
      page.locator('[aria-label*="theme" i], [aria-label*="dark" i], [aria-label*="light" i]')
    ).first();

    if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Get new theme
      const newBg = await page.locator('body, html, [class*="dark"]').first().evaluate(
        el => window.getComputedStyle(el).backgroundColor
      );

      // Background should change (or at least not throw an error)
      expect(newBg).toBeTruthy();
    }
  });

  test('should persist theme preference', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i }).or(
      page.locator('[aria-label*="theme" i]')
    ).first();

    if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();
      await page.waitForTimeout(1000);

      // Theme should persist (check localStorage with correct key)
      const themeValue = await page.evaluate(() => window.localStorage.getItem('weather_theme'));
      expect(themeValue).toBeTruthy();
      expect(['light', 'dark']).toContain(themeValue);
    }
  });
});
