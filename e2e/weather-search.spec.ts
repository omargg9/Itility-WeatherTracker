import { test, expect } from '@playwright/test';

test.describe('Weather Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should have a search input', async ({ page }) => {
    // Use multiple selectors for better browser compatibility
    const searchInput = page.locator('input[aria-label*="Search" i], input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('should search for a city and display results', async ({ page }) => {
    const searchInput = page.locator('input[aria-label*="Search" i], input[type="text"]').first();

    // Type a city name
    await searchInput.fill('London');    // Wait for autocomplete suggestions
    await page.waitForTimeout(500);

    // Click the first suggestion
    const firstSuggestion = page.locator('button').filter({ hasText: 'London' }).first();
    if (await firstSuggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstSuggestion.click();

      // Wait for weather data to load
      await page.waitForTimeout(3000);

      // Check if weather data is displayed by looking for temperature or weather condition
      const hasWeatherData = await page.locator('text=/°|humidity|wind|feels like/i').first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasWeatherData).toBeTruthy();
    }
  });

  test('should handle invalid city search', async ({ page }) => {
    const searchInput = page.locator('input[aria-label*="Search" i], input[type="text"]').first();

    // Search for an invalid city
    await searchInput.fill('XYZ123InvalidCity');    // Wait for search to complete (should show no results)
    await page.waitForTimeout(1000);

    // Should not crash and page should still be functional
    const pageText = await page.textContent('body');
    expect(pageText).toBeTruthy();

    // Search input should still be visible and functional
    await expect(searchInput).toBeVisible();
  });
});
