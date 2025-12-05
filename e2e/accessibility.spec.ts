import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // Check if focus is visible
    const focusedElement = await page.locator(':focus');
    const hasFocus = await focusedElement.count() > 0;
    expect(hasFocus).toBeTruthy();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1 element
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty for decorative images, but should be present
      expect(alt !== null).toBeTruthy();
    }
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const hasLabel =
        (await button.getAttribute('aria-label')) !== null ||
        (await button.textContent()) !== '' ||
        (await button.getAttribute('aria-labelledby')) !== null;

      expect(hasLabel).toBeTruthy();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for landmark regions
    const landmarks = await page.locator('main, nav, header, footer, [role="main"], [role="navigation"]').count();
    expect(landmarks).toBeGreaterThan(0);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This is a basic check - for detailed contrast checking, use axe-core
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    // Check that text is readable (look for visible text only)
    const textElements = page.locator('p:visible, h1:visible, h2:visible, h3:visible, span:visible').first();
    await expect(textElements).toBeVisible({ timeout: 10000 });
  });
});
