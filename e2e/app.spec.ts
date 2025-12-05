import { test, expect } from '@playwright/test';

test.describe('Weather Tracker App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Weather/i);
  });

  test('should display the main heading', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    // Check for navigation elements
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });
});
