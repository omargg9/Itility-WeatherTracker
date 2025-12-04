# AI-WeatherTracker Developer Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Code Style & Standards](#code-style--standards)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- OpenWeatherMap API key (free tier)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AI-WeatherTracker
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your OpenWeatherMap API key to `.env`:
```bash
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## Project Structure

```
AI-WeatherTracker/
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── widgets/       # Widget components
│   │   └── history/       # History/chart components
│   ├── context/           # React Context providers
│   │   ├── FavoritesContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useWeather.ts
│   │   ├── useGeolocation.ts
│   │   └── ...
│   ├── services/          # API services
│   │   ├── weatherService.ts
│   │   └── weatherHistoryService.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── weather.ts
│   │   ├── widget.ts
│   │   └── theme.ts
│   ├── utils/             # Utility functions
│   │   ├── animations.ts
│   │   └── forecastUtils.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   └── WidgetsPage.tsx
│   ├── i18n/              # Internationalization
│   ├── lib/               # Third-party configs
│   ├── assets/            # Static assets
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── docs/                  # Documentation
├── public/                # Public assets
└── ...config files
```

### Key Directories

- **components/**: Reusable UI components with JSDoc documentation
- **hooks/**: Custom hooks for data fetching and state management
- **services/**: API integration and data persistence
- **types/**: TypeScript interfaces and types
- **utils/**: Helper functions and constants
- **context/**: Global state management

---

## Development Workflow

### Running the App

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint
```

### Adding a New Feature

1. **Define Types** (if needed) in `src/types/`
2. **Create Service** (if API needed) in `src/services/`
3. **Create Hook** (if stateful) in `src/hooks/`
4. **Build Component** in `src/components/`
5. **Add Tests** alongside component
6. **Update Documentation**

### Example: Adding a New Weather Metric

1. Add type definition:
```typescript
// src/types/weather.ts
export interface UVIndex {
  value: number;
  level: string;
}
```

2. Update service:
```typescript
// src/services/weatherService.ts
/**
 * Get UV index for coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns UV index data
 */
getUVIndex: async (lat: number, lon: number): Promise<UVIndex> => {
  // Implementation
}
```

3. Create hook:
```typescript
// src/hooks/useUVIndex.ts
/**
 * Fetch UV index for coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns React Query result with UV data
 */
export function useUVIndex(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['uvIndex', lat, lon],
    queryFn: () => weatherService.getUVIndex(lat!, lon!),
    enabled: lat !== null && lon !== null,
  });
}
```

4. Create component:
```typescript
// src/components/UVIndexDisplay.tsx
/**
 * Displays UV index with safety recommendations
 * @param lat - Latitude
 * @param lon - Longitude
 */
export default function UVIndexDisplay({ lat, lon }: Props) {
  const { data } = useUVIndex(lat, lon);
  // Implementation
}
```

---

## Code Style & Standards

### TypeScript

- **Strict mode enabled** - No implicit any
- **Explicit return types** for functions
- **Interface over type** for object shapes
- **Enum for constants** when appropriate

### React

- **Functional components only**
- **Hooks for all state management**
- **Props destructuring** in component signature
- **Named exports** for utilities, default for components

### JSDoc Comments

All public functions, components, and hooks must have JSDoc:

```typescript
/**
 * Brief description of what this does
 * @param paramName - Description
 * @returns Description of return value
 */
export function myFunction(paramName: string): ReturnType {
  // Implementation
}
```

### Naming Conventions

- **Components**: PascalCase (`WeatherDisplay.tsx`)
- **Hooks**: camelCase with `use` prefix (`useWeather.ts`)
- **Services**: camelCase with `Service` suffix (`weatherService.ts`)
- **Types**: PascalCase (`WeatherData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FAVORITES`)
- **Files**: Match export name

### File Organization

```typescript
// 1. Imports (grouped and sorted)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { WeatherData } from '@/types/weather';

// 2. Type definitions
interface Props {
  weather: WeatherData;
}

// 3. Constants
const CACHE_TIME = 5 * 60 * 1000;

// 4. Component/function
export default function Component({ weather }: Props) {
  // Implementation
}
```

### Animation Best Practices

- **Respect reduced motion**: Use `useReducedMotion()` hook
- **Keep animations subtle**: < 300ms for most interactions
- **Use pre-defined variants**: Import from `utils/animations.ts`
- **Progressive enhancement**: Ensure functionality without animations

---

## Testing

### Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Component from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage

# UI mode (recommended)
npm run test:ui
```

### Test Coverage Goals

- **Components**: 80%+ coverage
- **Hooks**: 90%+ coverage
- **Services**: 90%+ coverage
- **Utils**: 100% coverage

---

## Deployment

### Environment Variables

Production requires:
```bash
VITE_OPENWEATHER_API_KEY=your_production_key
```

### Build & Deploy

```bash
# Build for production
npm run build

# Output in dist/ directory
```

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Performance Optimization

- **Code splitting**: Automatic with Vite
- **Image optimization**: Use WebP format
- **Lazy loading**: Use React.lazy() for routes
- **Caching**: React Query handles data caching
- **Bundle analysis**: `npm run build -- --analyze`

---

## Troubleshooting

### Common Issues

#### API Key Not Working

```bash
# Check .env file exists
ls -la .env

# Verify VITE_ prefix
grep VITE_ .env

# Restart dev server after changes
npm run dev
```

#### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit

# Update dependencies
npm update

# Clear cache
rm -rf node_modules .vite
npm install
```

#### Build Failures

```bash
# Clear build cache
rm -rf dist

# Rebuild
npm run build
```

#### Animation Performance

- Check `useReducedMotion()` is implemented
- Verify Framer Motion version compatibility
- Use Chrome DevTools Performance tab
- Reduce animation complexity

### Debug Mode

Enable React Query DevTools:

```typescript
// main.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Logging

```typescript
// Enable detailed logging
const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    error: console.error,
  },
});
```

---

## Best Practices Checklist

Before committing:

- [ ] JSDoc comments added
- [ ] TypeScript types defined
- [ ] Tests written and passing
- [ ] No ESLint errors
- [ ] Reduced motion support
- [ ] Error boundaries in place
- [ ] Loading states handled
- [ ] Accessibility checked
- [ ] Mobile responsive
- [ ] Documentation updated

---

## Contributing

1. Create feature branch
2. Make changes with proper JSDoc
3. Write tests
4. Run linter and tests
5. Update documentation
6. Submit pull request

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vite Guide](https://vitejs.dev/guide/)
- [OpenWeatherMap API](https://openweathermap.org/api)

---

**Last Updated:** December 4, 2025
