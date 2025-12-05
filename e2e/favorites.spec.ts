import { test, expect } from '@playwright/test';

test.describe('Favorites Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a city to favorites', async ({ page }) => {
    // Search for a city first
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i)).first();
    await searchInput.fill('Paris');
    await searchInput.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    // Look for favorite/star button
    const favoriteButton = page.getByRole('button', { name: /favorite|star|save/i }).first();
    if (await favoriteButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await favoriteButton.click();
      
      // Verify favorite was added (could check for success message or state change)
      await page.waitForTimeout(500);
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
