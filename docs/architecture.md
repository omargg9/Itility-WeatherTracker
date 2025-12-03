
# Architecture Document: AI-WeatherTracker

**Project:** Modern Weather Web Application  
**Version:** 1.0.0  
**Last Updated:** December 3, 2025  
**Author:** Winston (Architect Agent)  

---

## Document Control

### Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-12-03 | 1.0.0 | Winston | Initial architecture document created |

### Document Purpose

This architecture document serves as the **technical blueprint** for the AI-WeatherTracker web application. It defines the complete technical stack, component structure, data models, workflows, and implementation standards that development agents will follow during implementation.

**Intended Audience:**
- Development agents (AI and human developers)
- Technical reviewers
- Future maintainers

---

## Section 1: Introduction

### 1.1 Project Overview

AI-WeatherTracker is a modern, visually appealing weather web application focused on delivering an exceptional user experience through smooth animations, clean design, and intuitive interactions. Built as a personal learning project, it demonstrates best practices in React development, TypeScript, and modern frontend architecture.

### 1.2 Starter Template Selection

**Selected Template:** Vite React TypeScript Official Template

**Initialization Command:**
```bash
npm create vite@latest AI-WeatherTracker -- --template react-ts
```

**Rationale:**
- **Vite 5.0.8:** Lightning-fast dev server with HMR (10-20x faster than Create React App)
- **React 18.2.0:** Latest stable with concurrent features and automatic batching
- **TypeScript 5.3.3:** Strict type safety prevents runtime errors
- **ESM-native:** Modern module system, tree-shaking by default
- **Zero config:** Works out-of-box, minimal setup required
- **Optimized builds:** Rollup-based bundler with intelligent code splitting

**Template Provides:**
- Pre-configured TypeScript with strict mode
- ESLint configuration
- Vite config with React plugin
- Development server on port 5173
- Hot Module Replacement (HMR)
- Production build pipeline

### 1.3 Project Constraints

**Timeline:** No hard constraints, but optimized for rapid development (3-4 weeks)  
**Budget:** $0 (free tier services only)  
**Team Size:** 1 developer (personal project)  
**Browser Support:** Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Deployment:** Vercel free tier  

---

## Section 2: High-Level Architecture

### 2.1 Architecture Pattern

**Single-Page Application (SPA)** - Pure frontend, no backend required.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         React SPA Application                  │    │
│  │                                                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │    │
│  │  │  Pages   │  │Components│  │ Services │    │    │
│  │  │          │  │          │  │          │    │    │
│  │  │ Weather  │→ │ Display  │→ │ Weather  │    │    │
│  │  │ Forecast │  │ Forecast │  │ Service  │    │    │
│  │  │ Favorites│  │ Location │  │ Storage  │    │    │
│  │  └──────────┘  └──────────┘  └────┬─────┘    │    │
│  │                                    │          │    │
│  │  ┌──────────────────────────────┐ │          │    │
│  │  │   State Management           │ │          │    │
│  │  │  - TanStack Query (server)   │ │          │    │
│  │  │  - React Context (UI)        │ │          │    │
│  │  │  - LocalStorage (persist)    │ │          │    │
│  │  └──────────────────────────────┘ │          │    │
│  └─────────────────────────────────┬──┘          │    │
│                                    │             │    │
└────────────────────────────────────┼─────────────┘    │
                                     │                   
                                     │ HTTPS             
                                     ▼                   
                    ┌────────────────────────────┐       
                    │  OpenWeatherMap API 2.5    │       
                    │  - Current Weather         │       
                    │  - 5-Day Forecast          │       
                    │  - Hourly Forecast         │       
                    └────────────────────────────┘       
```

### 2.2 Component Diagram

```
App (ErrorBoundary)
 └─ UserPreferencesProvider (Context)
     └─ QueryClientProvider (TanStack Query)
         └─ Router (React Router)
             ├─ Layout
             │   ├─ Header
             │   │   ├─ Logo
             │   │   └─ ThemeToggle
             │   ├─ Main Content
             │   │   └─ Routes
             │   │       ├─ WeatherPage
             │   │       │   ├─ LocationSearch
             │   │       │   ├─ GeolocationButton
             │   │       │   ├─ WeatherDisplay
             │   │       │   │   ├─ WeatherAnimation (Lottie)
             │   │       │   │   └─ WeatherMetrics
             │   │       │   ├─ HourlyForecast
             │   │       │   └─ ForecastDisplay
             │   │       │       └─ ForecastCard (x5)
             │   │       └─ FavoritesPage
             │   │           └─ FavoritesManager
             │   │               └─ FavoriteCard (xN)
             │   └─ Footer
             └─ ToastContainer
```

### 2.3 Architectural Patterns

1. **Component Composition:** Small, focused components composed into features
2. **Custom Hooks:** Business logic extracted into reusable hooks
3. **Container/Presentational:** Smart components manage state, dumb components render UI
4. **Repository Pattern:** Services encapsulate external API calls
5. **State Lifting:** Shared state lives in closest common ancestor
6. **Optimistic Updates:** UI updates immediately, rollback on error
7. **Error Boundaries:** Catch and handle component errors gracefully

---

## Section 3: Tech Stack

### 3.1 Technology Selection

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Frontend Framework** | React | 18.2.0 | Industry standard, component-based, hooks, concurrent features |
| **Language** | TypeScript | 5.3.3 | Type safety, better DX, prevents runtime errors |
| **Build Tool** | Vite | 5.0.8 | Fast dev server, optimized builds, ESM-native |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first, rapid development, small bundle size |
| **Animation** | Framer Motion | 11.0.3 | Declarative animations, gestures, page transitions |
| **Lottie** | Lottie React | 2.4.0 | After Effects animations, 60fps, vector-based |
| **State (Server)** | TanStack Query | 5.17.9 | Server state caching, automatic refetch, optimistic updates |
| **State (UI)** | React Context | Built-in | Simple UI preferences, no external dependency |
| **Routing** | React Router | 6.21.1 | Standard routing solution, code splitting support |
| **HTTP Client** | Axios | 1.6.5 | Interceptors, timeout config, better errors than fetch |
| **Validation** | Zod | 3.22.4 | Runtime type validation, schema-based, TypeScript integration |
| **Testing** | Vitest | 1.1.1 | Vite-native, fast, Jest-compatible API |
| **Component Testing** | React Testing Library | 14.1.2 | User-centric testing, best practices |
| **API Mocking** | MSW | 2.0.11 | Network-level mocking, works in tests and browser |
| **Deployment** | Vercel | Latest | Zero-config, automatic HTTPS, global CDN, free tier |
| **API Provider** | OpenWeatherMap | 2.5 | Free tier (1000 calls/day), reliable, comprehensive data |

### 3.2 Development Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 8.56.0 | Code quality, catch errors early |
| Prettier | 3.1.1 | Code formatting, consistency |
| PostCSS | 8.4.33 | CSS processing for Tailwind |
| Autoprefixer | 10.4.16 | Automatic vendor prefixes |
| @types/node | 20.10.6 | Node.js type definitions |
| @vitest/ui | 1.1.1 | Visual test runner UI |
| @vitest/coverage-v8 | 1.1.1 | Code coverage reporting |

### 3.3 Runtime Requirements

- **Node.js:** 20.11.0 LTS (development only, not needed for production)
- **npm:** 10.2.4+
- **Browser:** ES2020+ support (modules, async/await, optional chaining)

---

## Section 4: Data Models

### 4.1 Core Data Models

#### WeatherData
```typescript
interface WeatherData {
  id: number;
  name: string;  // City name
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;           // Temperature in Celsius
    feels_like: number;
    humidity: number;       // Percentage (0-100)
    pressure: number;       // hPa
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;           // Clear, Clouds, Rain, etc.
    description: string;    // clear sky, few clouds, etc.
    icon: string;           // 01d, 02n, etc.
  }>;
  wind: {
    speed: number;          // m/s
    deg: number;            // degrees
  };
  clouds: {
    all: number;            // Cloudiness percentage
  };
  dt: number;               // Unix timestamp
  sys: {
    country: string;        // Country code
    sunrise: number;        // Unix timestamp
    sunset: number;         // Unix timestamp
  };
  timezone: number;         // Shift in seconds from UTC
  visibility: number;       // meters
}
```

#### ForecastData
```typescript
interface ForecastData {
  list: HourlyForecast[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
  };
}
```

#### HourlyForecast
```typescript
interface HourlyForecast {
  dt: number;               // Unix timestamp
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  pop: number;              // Probability of precipitation (0-1)
  dt_txt: string;           // "2025-12-03 12:00:00"
}
```

#### FavoriteLocation
```typescript
interface FavoriteLocation {
  id: string;               // UUID v4
  name: string;             // "San Francisco, US"
  coords: {
    lat: number;
    lon: number;
  };
  addedAt: string;          // ISO 8601 timestamp
}
```

#### UserPreferences
```typescript
interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark' | 'auto';
  animationsEnabled: boolean;
  lastLocation?: {
    type: 'city' | 'coords';
    value: string | { lat: number; lon: number };
  };
}
```

### 4.2 Zod Schemas

All data models have corresponding Zod schemas for runtime validation:

```typescript
// src/schemas/weatherSchema.ts
import { z } from 'zod';

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180)
});

export const WeatherDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  coord: CoordinatesSchema,
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number().min(0).max(100),
    pressure: z.number()
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string()
    })
  ),
  wind: z.object({
    speed: z.number().min(0),
    deg: z.number()
  }),
  dt: z.number(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number()
  }),
  visibility: z.number()
});

export const FavoriteLocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  coords: CoordinatesSchema,
  addedAt: z.string().datetime()
});
```

---

## Section 5: Components

### 5.1 Component Architecture

#### Layout Components
- **App.tsx** - Root component, error boundary, providers
- **Layout.tsx** - Main layout wrapper with header/footer
- **Header.tsx** - Logo, navigation, theme toggle
- **Footer.tsx** - Copyright, links

#### Weather Components
- **WeatherDisplay.tsx** - Main weather card with current conditions
- **WeatherAnimation.tsx** - Lottie animation wrapper (condition-based)
- **WeatherMetrics.tsx** - Grid of temperature, humidity, wind, pressure
- **DetailedWeatherView.tsx** - Expanded view with more metrics
- **LoadingWeather.tsx** - Skeleton loader for weather data

#### Forecast Components
- **ForecastDisplay.tsx** - Container for 5-day forecast
- **ForecastCard.tsx** - Single day forecast card
- **HourlyForecast.tsx** - 24-hour forecast slider
- **HourlyCard.tsx** - Single hour forecast item

#### Location Components
- **LocationSearch.tsx** - City search input with debouncing
- **GeolocationButton.tsx** - "Use my location" button
- **LocationDisplay.tsx** - Display current location name

#### Favorites Components
- **FavoritesManager.tsx** - List of favorite locations with controls
- **FavoriteCard.tsx** - Single favorite location card
- **AddFavoriteButton.tsx** - Button to save current location

#### UI Components (Reusable)
- **Button.tsx** - Reusable button with variants
- **Card.tsx** - Glassmorphism card container
- **Toast.tsx** - Toast notification system
- **ErrorBoundary.tsx** - Error boundary wrapper
- **Modal.tsx** - Modal dialog component

#### Animation Components
- **PageTransition.tsx** - Framer Motion page wrapper
- **FadeIn.tsx** - Reusable fade-in animation

### 5.2 Component Interaction Diagram

```
User Action → LocationSearch → useWeatherData hook
                                       ↓
                                TanStack Query
                                       ↓
                                WeatherService
                                       ↓
                            OpenWeatherMap API
                                       ↓
                            Response Validation (Zod)
                                       ↓
                            Transform to WeatherData
                                       ↓
                            Update Query Cache
                                       ↓
            ┌───────────────────────────────────────┐
            ↓                       ↓               ↓
    WeatherDisplay          ForecastDisplay   HourlyForecast
            ↓                       ↓               ↓
    WeatherAnimation        ForecastCard      HourlyCard
            ↓
    WeatherMetrics
```

### 5.3 Component Responsibilities

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| WeatherDisplay | Display current weather | data, onRefresh, isLoading | None (stateless) |
| WeatherAnimation | Show Lottie animation | condition, className | None |
| LocationSearch | Search input | onSearch, defaultValue | inputValue |
| FavoritesManager | Manage favorites list | favorites, onAdd, onRemove | None |
| ForecastCard | Display single day | data, unit, onClick | None |

---

## Section 6: External APIs

### 6.1 OpenWeatherMap API Integration

**Base URL:** `https://api.openweathermap.org/data/2.5`  
**API Version:** 2.5  
**Authentication:** API Key (query parameter)  

#### API Endpoints

##### 1. Current Weather by City
```
GET /weather?q={city}&appid={API_KEY}&units=metric
```

**Parameters:**
- `q`: City name (e.g., "London", "New York")
- `appid`: API key from environment variable
- `units`: "metric" (Celsius) or "imperial" (Fahrenheit)

**Response:** WeatherData object (see Section 4.1)

**Rate Limit:** 60 calls/minute, 1,000,000 calls/month (free tier)

##### 2. Current Weather by Coordinates
```
GET /weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
```

**Parameters:**
- `lat`: Latitude (-90 to 90)
- `lon`: Longitude (-180 to 180)

##### 3. 5-Day / 3-Hour Forecast
```
GET /forecast?q={city}&appid={API_KEY}&units=metric
```

**Response:** ForecastData with 40 data points (5 days × 8 intervals)

#### API Key Configuration

```typescript
// .env.local
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

// src/constants/api.ts
export const API_CONFIG = {
  key: import.meta.env.VITE_OPENWEATHER_API_KEY,
  baseUrl: import.meta.env.VITE_OPENWEATHER_BASE_URL
};
```

#### Caching Strategy

**TanStack Query Configuration:**
```typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes
  cacheTime: 10 * 60 * 1000,     // 10 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: false,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
}
```

**Cache Keys:**
- `['weather', 'current', cityName]`
- `['weather', 'current', { lat, lon }]`
- `['weather', 'forecast', cityName]`

#### Error Handling

**HTTP Status Codes:**
- `200` - Success
- `401` - Invalid API key
- `404` - City not found
- `429` - Rate limit exceeded
- `500-503` - Server errors

**Error Response Format:**
```json
{
  "cod": "404",
  "message": "city not found"
}
```

#### Data Transformation

```typescript
// Transform API response to internal model
function transformWeatherData(apiResponse: any): WeatherData {
  // Validate with Zod
  const validated = WeatherDataSchema.parse(apiResponse);
  
  // Return validated data (already matches our interface)
  return validated;
}
```

#### Security Considerations

1. **API Key Exposure:** Acceptable (frontend app, restricted by domain)
2. **Domain Restriction:** Configure in OpenWeatherMap dashboard
3. **Rate Limiting:** Client-side throttling + TanStack Query deduplication
4. **HTTPS Only:** All requests use HTTPS

---

## Section 7: Core Workflows

### 7.1 Primary User Flows

#### Flow 1: Initial App Load & Default Weather Display
```
User Opens App
    ↓
App.tsx Initializes
    ↓
GeolocationButton Auto-triggers (if permissions granted)
    ↓
WeatherService.getCurrentWeatherByCoords(lat, lon)
    ↓
TanStack Query Cache Check
    ↓
[Cache Hit] → Display Cached Data
    ↓
[Cache Miss] → OpenWeatherMap API Call
    ↓
Response Validation (Zod Schema)
    ↓
Transform to WeatherData Model
    ↓
Update TanStack Query Cache (5min TTL)
    ↓
WeatherDisplay Renders with Framer Motion Entry Animation
    ↓
WeatherAnimation Loads Lottie JSON (conditions-based)
    ↓
ForecastDisplay & HourlyForecast Render in Parallel
```

#### Flow 2: City Search
```
User Types in LocationSearch Input
    ↓
Debounced Input (300ms) via useDebouncedValue Hook
    ↓
WeatherService.getCurrentWeatherByCity(cityName)
    ↓
TanStack Query Key: ['weather', 'city', cityName]
    ↓
Cache Check (5min TTL)
    ↓
[Cache Hit] → Instant Display
    ↓
[Cache Miss] → API Call to /weather?q={city}
    ↓
Success:
    - Validate Response (Zod)
    - Transform Data
    - Framer Motion Page Transition
    - Update URL (React Router: /weather/:city)
    - Render Weather Components
    ↓
Error:
    - Toast Notification (City Not Found)
    - Keep Previous Display
```

#### Flow 3: Add to Favorites
```
User Clicks "Add to Favorites" Button
    ↓
FavoritesManager.addFavorite(locationData)
    ↓
Check Duplicate (compare coords within 0.01° tolerance)
    ↓
[Duplicate] → Toast: "Already in favorites"
    ↓
[New] → Create FavoriteLocation Object
    ↓
Update UserPreferences State (React Context)
    ↓
Persist to LocalStorage ('weather_favorites')
    ↓
Optimistic UI Update (Framer Motion List Animation)
    ↓
Button State: "Added" with Checkmark Icon (2sec)
    ↓
Revert to "Add to Favorites"
```

#### Flow 4: Background Data Refresh
```
Component Mounted (useEffect)
    ↓
TanStack Query staleTime: 5 minutes
    ↓
cacheTime: 10 minutes
    ↓
refetchInterval: false (manual refresh only)
    ↓
User Pulls to Refresh or Clicks Refresh Button
    ↓
Force Refetch: queryClient.invalidateQueries(['weather'])
    ↓
Loading Spinner (Framer Motion Rotate Animation)
    ↓
API Call with Current Location/City
    ↓
Update Cache & Re-render
    ↓
Success Toast: "Weather updated"
```

#### Flow 5: Error Recovery
```
API Call Fails
    ↓
Axios Interceptor Catches Error
    ↓
Error Type Detection:
    - Network Error (ERR_NETWORK) → "Check internet connection"
    - 401 Unauthorized → "Invalid API key" (dev error)
    - 404 Not Found → "City not found"
    - 429 Rate Limit → "Too many requests, try again in 1 minute"
    - 5xx Server Error → "Weather service unavailable"
    ↓
TanStack Query onError Callback
    ↓
Display Error Boundary (if critical) OR Toast (if recoverable)
    ↓
Retry Logic:
    - Network/5xx: Auto-retry 3x with exponential backoff (1s, 2s, 4s)
    - 429: Wait 60s, then allow manual retry
    - 404/401: No retry, user action required
    ↓
Show Cached Data (if available) with "Using cached data" badge
    ↓
Provide Manual Refresh Button
```

### 7.2 State Management Flows

#### TanStack Query (Server State)
```
Query Keys Structure:
- ['weather', 'current', cityName | coords]
- ['weather', 'forecast', cityName | coords]
- ['weather', 'hourly', cityName | coords]

Cache Invalidation Triggers:
1. User Manual Refresh
2. Location Change (search/geolocation)
3. Stale Time Expiry (5min)
4. Window Focus (refetchOnWindowFocus: true)
```

#### React Context (UI State)
```
UserPreferencesContext:
- favorites: FavoriteLocation[]
- temperatureUnit: 'celsius' | 'fahrenheit'
- theme: 'light' | 'dark' | 'auto'

Operations:
- addFavorite(location) → LocalStorage Sync
- removeFavorite(id) → LocalStorage Sync
- toggleUnit() → Re-render All Displays
- setTheme(theme) → CSS Variables Update
```

### 7.3 Animation Sequences

#### Page Transition (City Change)
```
Framer Motion AnimatePresence:

Exit Animation (200ms):
- opacity: 1 → 0
- y: 0 → -20px
- transition: { ease: 'easeIn' }

Enter Animation (300ms):
- opacity: 0 → 1
- y: 20px → 0
- transition: { ease: 'easeOut', delay: 0.1s }
```

#### Weather Card Hover (Forecast)
```
Framer Motion whileHover:
- scale: 1 → 1.05
- boxShadow: sm → lg
- transition: { duration: 0.2, ease: 'easeOut' }
```

#### Lottie Weather Animation
```
Load Sequence:
1. Detect weather.main (Clear/Clouds/Rain/Snow/etc)
2. Map to Lottie JSON file (/assets/animations/{condition}.json)
3. <Lottie> autoplay loop at 60fps
4. Fallback: Static icon if animation fails to load
```

---

## Section 9: Database Schema (LocalStorage)

### 9.1 Storage Strategy

This application uses **browser LocalStorage** for client-side persistence. No traditional database or backend required.

### 9.2 LocalStorage Keys & Schema

#### Key: `weather_favorites`
**Purpose:** Persist user's favorite locations

**Schema:**
```typescript
interface StoredFavorites {
  version: '1.0.0';  // Schema version for future migrations
  favorites: FavoriteLocation[];
  lastUpdated: string;  // ISO 8601 timestamp
}

// Example Value:
{
  "version": "1.0.0",
  "favorites": [
    {
      "id": "uuid-v4-string",
      "name": "San Francisco, US",
      "coords": { "lat": 37.7749, "lon": -122.4194 },
      "addedAt": "2025-12-03T10:30:00.000Z"
    },
    {
      "id": "uuid-v4-string",
      "name": "Tokyo, JP",
      "coords": { "lat": 35.6762, "lon": 139.6503 },
      "addedAt": "2025-12-03T11:15:00.000Z"
    }
  ],
  "lastUpdated": "2025-12-03T11:15:00.000Z"
}
```

**Size Limits:**
- Max favorites: 20 locations
- Estimated size: ~2KB (well under 5MB LocalStorage limit)

#### Key: `weather_preferences`
**Purpose:** Store user UI preferences

**Schema:**
```typescript
interface StoredPreferences {
  version: '1.0.0';
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark' | 'auto';
  animationsEnabled: boolean;
  lastLocation?: {
    type: 'city' | 'coords';
    value: string | { lat: number; lon: number };
  };
  lastUpdated: string;
}

// Example Value:
{
  "version": "1.0.0",
  "temperatureUnit": "celsius",
  "theme": "auto",
  "animationsEnabled": true,
  "lastLocation": {
    "type": "city",
    "value": "San Francisco"
  },
  "lastUpdated": "2025-12-03T10:30:00.000Z"
}
```

**Size:** ~500 bytes

#### Key: `weather_cache_meta`
**Purpose:** Track TanStack Query cache metadata for offline mode

**Schema:**
```typescript
interface CacheMeta {
  version: '1.0.0';
  entries: {
    queryKey: string;  // Serialized query key
    timestamp: string;  // ISO 8601
    size: number;  // bytes
  }[];
  totalSize: number;
  lastCleanup: string;
}
```

**Note:** TanStack Query uses its own persistence via `persistQueryClient` with IndexedDB. This key is for manual cache inspection only.

### 9.3 Data Access Layer

#### StorageService Utility
```typescript
// src/services/StorageService.ts

export class StorageService {
  private static PREFIX = 'weather_';
  
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to read ${key}:`, error);
      return defaultValue;
    }
  }
  
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        // Retry once after cleanup
        localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      }
      console.error(`Failed to write ${key}:`, error);
    }
  }
  
  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }
  
  static clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
  
  private static cleanup(): void {
    // Remove cache_meta if quota exceeded
    this.remove('cache_meta');
  }
}
```

### 9.4 Migration Strategy

#### Version Handling
```typescript
// src/utils/migrations.ts

export function migrateStorageSchema(key: string, data: any): any {
  const version = data.version || '0.0.0';
  
  if (key === 'favorites') {
    if (version === '0.0.0') {
      // Migration from unversioned schema
      return {
        version: '1.0.0',
        favorites: Array.isArray(data) ? data : [],
        lastUpdated: new Date().toISOString()
      };
    }
  }
  
  return data;  // No migration needed
}
```

### 9.5 Data Validation

All LocalStorage reads go through **Zod validation**:

```typescript
import { z } from 'zod';

const StoredFavoritesSchema = z.object({
  version: z.string(),
  favorites: z.array(FavoriteLocationSchema),
  lastUpdated: z.string().datetime()
});

// Usage in StorageService
const rawData = StorageService.get('favorites', null);
const validated = StoredFavoritesSchema.safeParse(rawData);

if (validated.success) {
  return validated.data.favorites;
} else {
  console.error('Invalid favorites schema:', validated.error);
  return [];  // Fallback to empty
}
```

---

## Section 10: Source Tree

### 10.1 Project Structure

```
AI-WeatherTracker/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # Vercel CI/CD pipeline
├── public/
│   ├── assets/
│   │   ├── animations/                # Lottie JSON files
│   │   │   ├── clear-day.json
│   │   │   ├── clear-night.json
│   │   │   ├── clouds.json
│   │   │   ├── rain.json
│   │   │   ├── snow.json
│   │   │   ├── thunderstorm.json
│   │   │   ├── mist.json
│   │   │   └── loading.json
│   │   └── icons/                     # Static fallback icons
│   │       └── weather-icons.svg
│   ├── favicon.ico
│   └── manifest.json                  # PWA manifest (future)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── App.tsx                # Root component
│   │   │   ├── Layout.tsx             # Main layout wrapper
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── weather/
│   │   │   ├── WeatherDisplay.tsx     # Main weather card
│   │   │   ├── WeatherAnimation.tsx   # Lottie wrapper
│   │   │   ├── WeatherMetrics.tsx     # Temp, humidity, wind grid
│   │   │   ├── DetailedWeatherView.tsx
│   │   │   └── LoadingWeather.tsx     # Skeleton loader
│   │   ├── forecast/
│   │   │   ├── ForecastDisplay.tsx    # 5-day forecast container
│   │   │   ├── ForecastCard.tsx       # Single day card
│   │   │   ├── HourlyForecast.tsx     # 24-hour slider
│   │   │   └── HourlyCard.tsx
│   │   ├── location/
│   │   │   ├── LocationSearch.tsx     # Search input with autocomplete
│   │   │   ├── GeolocationButton.tsx  # "Use my location" button
│   │   │   └── LocationDisplay.tsx    # Current location name
│   │   ├── favorites/
│   │   │   ├── FavoritesManager.tsx   # Favorites list + controls
│   │   │   ├── FavoriteCard.tsx       # Single favorite item
│   │   │   └── AddFavoriteButton.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx             # Reusable button component
│   │   │   ├── Card.tsx               # Glass morphism card
│   │   │   ├── Toast.tsx              # Toast notification
│   │   │   ├── ErrorBoundary.tsx      # Error boundary wrapper
│   │   │   └── Modal.tsx              # Modal dialog
│   │   └── animations/
│   │       ├── PageTransition.tsx     # Framer Motion page wrapper
│   │       └── FadeIn.tsx             # Reusable fade-in animation
│   ├── hooks/
│   │   ├── useWeatherData.ts          # TanStack Query weather hook
│   │   ├── useForecastData.ts         # TanStack Query forecast hook
│   │   ├── useGeolocation.ts          # Browser geolocation API
│   │   ├── useFavorites.ts            # Favorites CRUD operations
│   │   ├── useLocalStorage.ts         # Generic LocalStorage hook
│   │   ├── useDebouncedValue.ts       # Input debouncing
│   │   └── useTheme.ts                # Theme management
│   ├── services/
│   │   ├── WeatherService.ts          # OpenWeatherMap API client
│   │   ├── StorageService.ts          # LocalStorage wrapper
│   │   └── GeolocationService.ts      # Geolocation utilities
│   ├── models/
│   │   ├── WeatherData.ts             # TypeScript interfaces
│   │   ├── ForecastData.ts
│   │   ├── HourlyForecast.ts
│   │   ├── FavoriteLocation.ts
│   │   └── UserPreferences.ts
│   ├── schemas/
│   │   ├── weatherSchema.ts           # Zod validation schemas
│   │   ├── forecastSchema.ts
│   │   └── storageSchema.ts
│   ├── context/
│   │   └── UserPreferencesContext.tsx # React Context for preferences
│   ├── utils/
│   │   ├── formatters.ts              # Date/temperature formatters
│   │   ├── validators.ts              # Input validation
│   │   ├── animations.ts              # Framer Motion variants
│   │   ├── weatherIcons.ts            # Icon mapping logic
│   │   └── migrations.ts              # LocalStorage migrations
│   ├── constants/
│   │   ├── api.ts                     # API URLs, keys, endpoints
│   │   ├── animations.ts              # Animation constants
│   │   └── weather.ts                 # Weather condition mappings
│   ├── styles/
│   │   ├── index.css                  # Global styles + Tailwind
│   │   └── animations.css             # Custom CSS animations
│   ├── types/
│   │   ├── api.ts                     # API response types
│   │   └── env.d.ts                   # Vite env type declarations
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── WeatherDisplay.test.tsx
│   │   │   ├── ForecastCard.test.tsx
│   │   │   └── LocationSearch.test.tsx
│   │   ├── hooks/
│   │   │   ├── useWeatherData.test.ts
│   │   │   └── useFavorites.test.ts
│   │   ├── services/
│   │   │   └── WeatherService.test.ts
│   │   └── utils/
│   │       └── formatters.test.ts
│   ├── main.tsx                       # Vite entry point
│   └── vite-env.d.ts                  # Vite types
├── docs/
│   ├── prd.md                         # Product Requirements (CREATED)
│   ├── architecture.md                # This document
│   └── stories/                       # User story documents (future)
│       ├── epic-1/
│       ├── epic-2/
│       └── epic-3/
├── .env.example                       # Environment variable template
├── .env.local                         # Local environment (gitignored)
├── .gitignore
├── .eslintrc.cjs                      # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── index.html                         # Vite HTML entry
├── package.json
├── package-lock.json
├── tsconfig.json                      # TypeScript config
├── tsconfig.node.json                 # TypeScript for Vite config
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
├── vitest.config.ts                   # Vitest test config
└── README.md                          # Project documentation
```

### 10.2 Import Path Aliases

**vite.config.ts:**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@models': path.resolve(__dirname, './src/models'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
    }
  }
});
```

**Usage:**
```typescript
import { WeatherService } from '@services/WeatherService';
import { formatTemperature } from '@utils/formatters';
```

### 10.3 File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase.tsx | `WeatherDisplay.tsx` |
| Hooks | camelCase.ts | `useWeatherData.ts` |
| Services | PascalCase.ts | `WeatherService.ts` |
| Utils | camelCase.ts | `formatters.ts` |
| Types | camelCase.ts | `api.ts` |
| Constants | camelCase.ts | `weather.ts` |
| Tests | *.test.ts(x) | `WeatherDisplay.test.tsx` |
| Styles | index.css | `src/styles/index.css` |

---

## Section 11: Infrastructure & Deployment

### 11.1 Deployment Platform: Vercel

**Rationale:**
- Zero-config deployment for Vite/React apps
- Automatic HTTPS and global CDN
- Built-in CI/CD with GitHub integration
- Edge network for optimal performance
- Free tier sufficient for personal projects
- Environment variable management
- Automatic preview deployments for PRs

### 11.2 Build Configuration

#### Production Build Command
```bash
npm run build
```

**Vite Build Process:**
1. TypeScript compilation with strict mode
2. Tailwind CSS purging (removes unused styles)
3. Asset optimization (images, fonts)
4. Code splitting by vendor chunks
5. Minification (Terser for JS, cssnano for CSS)
6. Source map generation
7. Output to `dist/` directory

**Build Output Structure:**
```
dist/
├── assets/
│   ├── index-[hash].js          # Main application bundle (~150KB gzipped)
│   ├── vendor-react-[hash].js   # React libraries (~45KB gzipped)
│   ├── vendor-query-[hash].js   # TanStack Query (~15KB gzipped)
│   ├── vendor-motion-[hash].js  # Framer Motion (~30KB gzipped)
│   ├── vendor-lottie-[hash].js  # Lottie React (~25KB gzipped)
│   ├── index-[hash].css         # Styles (~20KB gzipped)
│   └── animations/              # Lottie JSON files (copied from public/)
├── index.html                   # Entry HTML
└── manifest.json                # PWA manifest (future)
```

**Estimated Total Size:** ~300KB gzipped (first load)

### 11.3 Vercel Configuration

**File:** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://openweathermap.org; connect-src 'self' https://api.openweathermap.org; frame-ancestors 'none';"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### 11.4 Environment Configuration

#### Development (.env.local)
```bash
VITE_OPENWEATHER_API_KEY=dev_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_APP_NAME=Weather Tracker (Dev)
VITE_CACHE_TTL=300000
VITE_MAX_FAVORITES=20
VITE_ENABLE_DEBUG=true
```

#### Production (Vercel Environment Variables)
```bash
VITE_OPENWEATHER_API_KEY=production_api_key
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_APP_NAME=Weather Tracker
VITE_CACHE_TTL=300000
VITE_MAX_FAVORITES=20
VITE_ENABLE_DEBUG=false
```

### 11.5 Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing (`npm run test`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Linter passing (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables set in Vercel
- [ ] OpenWeatherMap API key valid and has quota

**Post-Deployment:**
- [ ] Verify production URL loads
- [ ] Test geolocation permission flow
- [ ] Test city search functionality
- [ ] Test favorites add/remove
- [ ] Check Vercel Analytics dashboard
- [ ] Monitor error rates (first 24 hours)
- [ ] Validate Core Web Vitals scores

---

## Section 12: Error Handling & Recovery

### 12.1 Error Classification

| Category | Severity | User Impact | Recovery Strategy |
|----------|----------|-------------|-------------------|
| Network Errors | High | Cannot fetch weather | Retry + Cached data |
| API Errors (4xx) | Medium | Invalid request | User feedback |
| API Errors (5xx) | High | Service unavailable | Retry + Fallback |
| Geolocation Denied | Low | Manual search required | Graceful degradation |
| Storage Quota | Low | Cannot save favorites | Cleanup + Notify |
| Invalid Input | Low | Search fails | Validation feedback |
| Runtime Errors | Critical | App crash | Error boundary |

### 12.2 Error Boundary Implementation

**File:** `src/components/ui/ErrorBoundary.tsx`
```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8">
            <h1>Something went wrong</h1>
            <button onClick={this.handleReset}>Reload App</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12.3 API Error Handling

**Axios Interceptor:**
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Check your internet connection',
        shouldRetry: true
      });
    }

    const status = error.response.status;
    
    switch (status) {
      case 404:
        return Promise.reject({
          type: 'NOT_FOUND',
          message: 'City not found',
          shouldRetry: false
        });
      case 429:
        return Promise.reject({
          type: 'RATE_LIMIT',
          message: 'Too many requests',
          shouldRetry: true,
          retryAfter: 60000
        });
      default:
        return Promise.reject(error);
    }
  }
);
```

### 12.4 TanStack Query Error Handling

```typescript
export function useWeatherData(city: string) {
  return useQuery({
    queryKey: ['weather', 'current', city],
    queryFn: () => WeatherService.getCurrentWeatherByCity(city),
    retry: (failureCount, error: any) => {
      if (error.type === 'NOT_FOUND') return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: AppError) => {
      toast.error(error.message);
    }
  });
}
```

---

## Section 13: Coding Standards & Best Practices

### 13.1 TypeScript Standards

#### Type Safety Rules
```typescript
// ✅ GOOD: Explicit return types
export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): string {
  return unit === 'celsius' ? `${temp}°C` : `${Math.round(temp * 9/5 + 32)}°F`;
}

// ✅ GOOD: No 'any' types
function parseApiResponse(data: unknown): WeatherData {
  return weatherSchema.parse(data);
}

// ✅ GOOD: Strict null checks
function getLocationName(location: FavoriteLocation | null): string {
  return location?.name ?? 'Unknown Location';
}
```

### 13.2 React Component Standards

#### Component Structure
```typescript
import { FC, useState, useCallback, useEffect } from 'react';

interface WeatherCardProps {
  data: WeatherData;
  onRefresh?: () => void;
}

export const WeatherCard: FC<WeatherCardProps> = ({ data, onRefresh }) => {
  // Hooks at the top
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Event handlers
  const handleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);
  
  // Early returns
  if (!data) return null;
  
  // Render
  return <div>{/* JSX */}</div>;
};
```

### 13.3 Naming Conventions

- Components: PascalCase (`WeatherDisplay`)
- Hooks: camelCase with 'use' prefix (`useWeatherData`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Types/Interfaces: PascalCase (`WeatherData`)

### 13.4 Performance Best Practices

```typescript
// Memoize expensive computations
const processedData = useMemo(() => expensiveCalculation(data), [data]);

// Memoize callbacks
const handleSearch = useCallback((query: string) => {
  fetchWeather(query);
}, [fetchWeather]);

// Lazy load components
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
```

---

## Section 14: Test Strategy

### 14.1 Testing Pyramid

```
        /\
       /E2E\         10% - End-to-end
      /------\
     /  Integ \      20% - Integration
    /----------\
   /    Unit    \    70% - Unit
  /--------------\
```

### 14.2 Testing Stack

- **Vitest:** Test runner (1.1.1)
- **React Testing Library:** Component testing (14.1.2)
- **MSW:** API mocking (2.0.11)
- **Coverage:** v8 (80% minimum)

### 14.3 Test Configuration

**vitest.config.ts:**
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

### 14.4 Test Examples

```typescript
describe('WeatherDisplay', () => {
  it('should render temperature correctly', () => {
    render(<WeatherDisplay data={mockWeatherData} />);
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });
  
  it('should call onRefresh when button clicked', async () => {
    const mockRefresh = vi.fn();
    render(<WeatherDisplay data={mockData} onRefresh={mockRefresh} />);
    
    await userEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
```

---

## Section 15: Security Considerations

### 15.1 Security Threat Model

| Threat | Risk Level | Mitigation |
|--------|-----------|------------|
| API Key Exposure | High | Environment variables, domain restriction |
| XSS | Medium | React escaping, CSP headers |
| Data Injection | Medium | Zod validation |
| MITM | Medium | HTTPS only, HSTS |

### 15.2 API Key Security

```typescript
// ✅ GOOD: Environment variables
export const API_CONFIG = {
  key: import.meta.env.VITE_OPENWEATHER_API_KEY,
  baseUrl: import.meta.env.VITE_OPENWEATHER_BASE_URL
};

// Validate on startup
if (!API_CONFIG.key) {
  throw new Error('API key not configured');
}
```

**OpenWeatherMap Dashboard:**
- Enable domain restrictions
- Monitor API usage
- Rotate keys monthly

### 15.3 Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://openweathermap.org\;
  connect-src 'self' https://api.openweathermap.org\;
  frame-ancestors 'none';
```

### 15.4 Input Validation

```typescript
// Validate all inputs with Zod
export const cityNameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-zA-Z\s\-']+$/)
  .transform((val) => val.trim());

export function validateCityInput(input: unknown): string {
  return cityNameSchema.parse(input);
}
```

### 15.5 Security Checklist

**Pre-Deployment:**
- [ ] API keys in environment variables
- [ ] API key domain-restricted
- [ ] CSP headers configured
- [ ] All inputs validated (Zod)
- [ ] All API responses validated
- [ ] HTTPS enforced
- [ ] npm audit passing
- [ ] No console.log in production

---

## Section 16: Next Steps & Recommendations

### 16.1 Immediate Next Actions

#### Phase 1: Project Initialization (1-2 hours)
```bash
npm create vite@latest AI-WeatherTracker -- --template react-ts
cd AI-WeatherTracker
npm install
npm install react-router-dom @tanstack/react-query axios framer-motion lottie-react zod clsx
npm install -D tailwindcss vitest @testing-library/react msw
npx tailwindcss init -p
```

#### Phase 2: Core Architecture (3-4 hours)
- Set up TanStack Query provider
- Create WeatherService
- Implement data models and Zod schemas
- Configure Error Boundary and routing

#### Phase 3: Weather Display (6-8 hours)
- Implement useWeatherData hook
- Create WeatherDisplay component
- Integrate Lottie animations
- Add Framer Motion transitions

### 16.2 Development Workflow

```
For each story:
1. Create feature branch
2. Implement feature
3. Write unit tests (85%+ coverage)
4. Run tests, lint, type-check
5. Create PR
6. Vercel auto-deploys preview
7. Test and merge
```

### 16.3 Recommended Story Order

**Epic 1: Foundation (Week 1)**
1. Story 1.1: Project Setup (2h)
2. Story 1.2: Architecture (4h)
3. Story 1.3: API Integration (3h)
4. Story 1.4: Weather Display (6h)
5. Story 1.5: Lottie Animations (4h)
6. Story 1.6: Framer Motion (3h)

**Epic 2: Enhanced Features (Week 2)**
7. Story 2.1: 5-Day Forecast (5h)
8. Story 2.2: Hourly Forecast (4h)
9. Story 2.3: City Search (5h)
10. Story 2.4: Geolocation (3h)

**Epic 3: Polish (Week 3)**
13. Story 3.1: Favorites (5h)
14. Story 3.2: Detailed View (4h)
15. Story 3.3: Unit Toggle (2h)
16. Story 3.7: Final QA (4h)

**Total:** ~70-80 hours (3 weeks)

### 16.4 Agent Transition Options

**Option A: Scrum Master** (`*agent sm`)
- Create detailed story documents
- Guide story-by-story implementation

**Option B: Developer** (`*agent dev`)
- Start implementing from Epic 1
- Fast prototyping approach

**Option C: Continue Architect**
- Create frontend-architecture.md
- Detailed UI specifications

### 16.5 Success Criteria

**Definition of Done:**
- [ ] All 19 stories completed
- [ ] Test coverage >80%
- [ ] No ESLint/TypeScript errors
- [ ] Deployed to Vercel
- [ ] Core Web Vitals passing
- [ ] Manual QA on Chrome/Firefox/Safari
- [ ] Mobile tested (iOS + Android)

---

## Appendix

### A. References

- [Vite Documentation](https://vitejs.dev/)
- [React 18 Documentation](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)

### B. Glossary

- **SPA:** Single-Page Application
- **HMR:** Hot Module Replacement
- **CSP:** Content Security Policy
- **TTL:** Time To Live (cache duration)
- **MVP:** Minimum Viable Product

### C. Document Maintenance

This document should be updated when:
- Major architectural decisions change
- New technologies are introduced
- Deployment process changes
- Security requirements evolve

---

**END OF ARCHITECTURE DOCUMENT**

**Version:** 1.0.0  
**Status:** Complete  
**Ready for Development:** ✅
