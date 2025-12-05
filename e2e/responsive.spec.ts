import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Wait for page to load
      await page.waitForTimeout(1000);
      
      // Check if main content is visible
      const body = await page.locator('body');
      await expect(body).toBeVisible();
      
      // Take a screenshot for visual verification
      await page.screenshot({ 
        path: `e2e/screenshots/${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
    });
  }

  test('should have mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Look for hamburger menu or mobile navigation
    const mobileMenu = page.locator('[aria-label*="menu" i], button[class*="menu" i]').first();
    const hasMobileNav = await mobileMenu.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Should have some form of navigation (even if different on mobile)
    expect(hasMobileNav || await page.locator('nav').isVisible()).toBeTruthy();
  });
});
