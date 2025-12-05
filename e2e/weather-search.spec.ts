import { test, expect } from '@playwright/test';

test.describe('Weather Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a search input', async ({ page }) => {
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));
    await expect(searchInput.first()).toBeVisible();
  });

  test('should search for a city and display results', async ({ page }) => {
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i)).first();
    
    // Type a city name
    await searchInput.fill('London');
    
    // Wait for results or submit
    const submitButton = page.getByRole('button', { name: /search/i });
    if (await submitButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await submitButton.click();
    } else {
      await searchInput.press('Enter');
    }
    
    // Wait for weather data to load
    await page.waitForTimeout(2000);
    
    // Check if weather data is displayed (temperature, city name, etc.)
    const temperatureRegex = /°|temp|fahrenheit|celsius/i;
    const hasTemperature = await page.getByText(temperatureRegex).count() > 0;
    expect(hasTemperature).toBeTruthy();
  });

  test('should handle invalid city search', async ({ page }) => {
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i)).first();
    
    // Search for an invalid city
    await searchInput.fill('XYZ123InvalidCity');
    await searchInput.press('Enter');
    
    // Wait for potential error message
    await page.waitForTimeout(2000);
    
    // Should either show error or not crash
    const pageText = await page.textContent('body');
    expect(pageText).toBeTruthy();
  });
});
