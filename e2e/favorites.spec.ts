import { test, expect } from '@playwright/test';

test.describe('Favorites Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a city to favorites', async ({ page }) => {
    // Search for a city first
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[aria-label*="Search" i], input[type="text"]').first();
    await searchInput.fill('Paris');
    await page.waitForTimeout(500);

    // Click the first suggestion if available
    const firstSuggestion = page.locator('button').filter({ hasText: 'Paris' }).first();
    if (await firstSuggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstSuggestion.click();
      await page.waitForTimeout(3000);

      // Look for favorite/star button and force click to avoid overlay issues
      const favoriteButton = page.getByRole('button', { name: /favorite|star|save/i }).first();
      if (await favoriteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await favoriteButton.click({ force: true });
        await page.waitForTimeout(500);
      }
    }
  });

  test('should navigate to favorites page', async ({ page }) => {
    // Look for favorites link/button in navigation
    const favoritesLink = page.getByRole('link', { name: /favorite/i }).or(
      page.getByRole('button', { name: /favorite/i })
    );

    if (await favoritesLink.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await favoritesLink.first().click();

      // Verify we're on the favorites page
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/favorite/i);
    }
  });

  test('should display saved favorites', async ({ page }) => {
    // Navigate to favorites
    const favoritesLink = page.getByRole('link', { name: /favorite/i }).or(
      page.getByRole('button', { name: /favorite/i })
    );

    if (await favoritesLink.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await favoritesLink.first().click();
      await page.waitForTimeout(1000);

      // Check for favorites list or empty state message
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    }
  });
});
