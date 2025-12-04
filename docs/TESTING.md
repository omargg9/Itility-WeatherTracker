# Testing Guide

## Overview

This project uses **Vitest** as the test runner with **React Testing Library** for component testing. We maintain high code coverage standards to ensure code quality and reliability.

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI/CD)
npm run test:run

# Run tests with UI (visual test runner)
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run typecheck

# Run all checks (lint + typecheck + tests)
npm run ci
```

## Code Coverage

### Current Coverage

**Overall: 92.24%**

| Metric     | Target | Current |
|------------|--------|---------|
| Statements | 80%    | 92.24%  |
| Branches   | 70%    | 73.11%  |
| Functions  | 80%    | 93.33%  |
| Lines      | 80%    | 91.74%  |

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report in browser
open coverage/index.html
```

The coverage report includes:
- **Text summary** in terminal
- **HTML report** in `coverage/index.html`
- **JSON data** in `coverage/coverage-final.json`
- **LCOV format** in `coverage/lcov.info`

### Coverage Thresholds

The project enforces minimum coverage thresholds:

```typescript
thresholds: {
  lines: 80,
  functions: 80,
  branches: 70,
  statements: 80,
}
```

Tests will fail if coverage drops below these thresholds.

## Writing Tests

### Component Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import MyComponent from './MyComponent';

// Helper to wrap components that need context
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithTheme(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const { user } = renderWithTheme(<MyComponent />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeather } from './useWeather';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useWeather', () => {
  it('should fetch weather data', async () => {
    const { result } = renderHook(
      () => useWeather(40.7128, -74.0060),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

### Testing Async Components

```typescript
import { waitFor } from '@testing-library/react';

it('should load and display data', async () => {
  render(<AsyncComponent />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

## Test Organization

```
src/
├── components/
│   ├── MyComponent.tsx
│   └── MyComponent.test.tsx          # Component tests
├── hooks/
│   ├── useWeather.ts
│   └── useWeather.test.tsx           # Hook tests
├── context/
│   ├── ThemeContext.tsx
│   └── ThemeContext.test.tsx         # Context tests
└── test/
    └── setup.ts                       # Global test setup
```

## Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ✅ Good - Tests what user sees
expect(screen.getByText('Welcome')).toBeInTheDocument();

// ❌ Bad - Tests implementation details
expect(component.state.isVisible).toBe(true);
```

### 2. Use Accessible Queries

```typescript
// ✅ Good - Use semantic queries
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email address');

// ❌ Bad - Use test IDs only as last resort
screen.getByTestId('submit-button');
```

### 3. Wait for Async Updates

```typescript
// ✅ Good - Wait for changes
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// ❌ Bad - Don't use arbitrary timeouts
setTimeout(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
}, 1000);
```

### 4. Mock External Dependencies

```typescript
import { vi } from 'vitest';

// Mock API calls
vi.mock('@/services/weatherService', () => ({
  getWeather: vi.fn().mockResolvedValue(mockWeatherData),
}));
```

### 5. Clean Up After Tests

```typescript
import { afterEach } from 'vitest';

afterEach(() => {
  // Cleanup happens automatically with React Testing Library
  // But you can add custom cleanup here
  localStorage.clear();
});
```

## GitHub Actions Integration

### Automated Testing

Every push and pull request runs:
1. **Linter** - Code style checks
2. **TypeScript** - Type checking
3. **Tests** - Full test suite with coverage
4. **Build** - Production build verification

### Coverage Reports

- Coverage reports are uploaded as artifacts
- PRs get automatic coverage comments
- Coverage badge updates on main branch

### Setting Up

1. **No additional secrets needed** for basic testing
2. **Optional**: Add `CODECOV_TOKEN` for Codecov integration
3. **Optional**: Add Vercel secrets for deployment

## Continuous Integration

### Local Pre-commit Check

Run all checks before committing:

```bash
npm run ci
```

This runs:
- ESLint
- TypeScript check
- Full test suite

### GitHub Actions Workflows

**`.github/workflows/test.yml`** - Basic testing
- Runs on every push/PR
- Generates coverage reports
- Comments coverage on PRs

**`.github/workflows/ci.yml`** - Full CI/CD (optional)
- Tests + Build + Deploy
- Vercel integration
- Production/preview deployments

## Troubleshooting

### Tests Failing Locally But Pass in CI

```bash
# Clear caches
rm -rf node_modules coverage
npm install
npm run test:run
```

### Coverage Report Not Generated

```bash
# Ensure coverage package is installed
npm install -D @vitest/coverage-v8
```

### Context Provider Errors

```typescript
// Always wrap components that use context
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
```

### Timeout Errors

```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // Test code
}, { timeout: 10000 }); // 10 seconds
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Playground](https://testing-playground.com/)

---

**Last Updated:** December 4, 2025
