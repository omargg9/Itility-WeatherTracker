import { test, expect } from '@playwright/test';

test.describe('Weather Tracker App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Weather/i);
  });

  test('should display the main heading', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    // Look for any visible heading (some might be hidden on mobile)
    const heading = page.locator('h1:visible, h2:visible').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should have responsive navigation', async ({ page }) => {
    // Check for navigation elements
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });
});
