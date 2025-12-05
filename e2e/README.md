# E2E Testing with Playwright

This directory contains end-to-end tests for the AI-WeatherTracker application using Playwright.

## Test Structure

- `app.spec.ts` - Basic app functionality and navigation
- `weather-search.spec.ts` - Weather search and display features
- `favorites.spec.ts` - Favorites management functionality
- `theme.spec.ts` - Dark/light theme toggling
- `responsive.spec.ts` - Responsive design across devices
- `accessibility.spec.ts` - Accessibility compliance

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests with browser visible
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

### Generate tests using Playwright Inspector
```bash
npm run test:e2e:codegen
```

## Test Configuration

The tests are configured in `playwright.config.ts` and include:

- **Browsers:** Chromium, Firefox, WebKit
- **Mobile:** Chrome on Pixel 5, Safari on iPhone 12
- **Screenshots:** Captured on failure
- **Traces:** Recorded on first retry
- **Dev Server:** Automatically starts Vite on port 5173

## Writing New Tests

1. Create a new `.spec.ts` file in the `e2e` directory
2. Import test utilities: `import { test, expect } from '@playwright/test';`
3. Use descriptive test names and organize with `test.describe()`
4. Follow the existing patterns for consistency

### Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    const element = page.getByRole('button', { name: /click me/i });
    await element.click();
    await expect(page).toHaveURL(/success/);
  });
});
```

## Best Practices

1. **Use semantic selectors** - Prefer `getByRole`, `getByLabel`, `getByPlaceholder` over CSS selectors
2. **Wait for elements** - Use `await expect(element).toBeVisible()` instead of timeouts
3. **Test user flows** - Focus on real user interactions, not implementation details
4. **Keep tests independent** - Each test should work in isolation
5. **Use page objects** - For complex pages, consider creating page object models

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Tests are flaky
- Use proper waiting strategies (`waitForLoadState`, `waitForSelector`)
- Avoid hard-coded `waitForTimeout` when possible
- Check for race conditions

### Browser not launching
- Run `npx playwright install` to ensure browsers are installed
- Check system dependencies with `npx playwright install-deps`

### Tests failing in CI but passing locally
- Ensure CI has sufficient resources
- Check for timing differences
- Review CI logs for specific errors

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
