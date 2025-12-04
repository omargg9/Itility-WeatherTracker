# AI-WeatherTracker API Documentation

## Overview

This document provides comprehensive API documentation for the AI-WeatherTracker application, covering all hooks, services, components, and utilities.

---

## Table of Contents

1. [Hooks](#hooks)
2. [Services](#services)
3. [Types](#types)
4. [Components](#components)
5. [Utilities](#utilities)
6. [Context Providers](#context-providers)

---

## Hooks

### Weather Hooks

#### `useCurrentWeather(lat, lon, locationName?)`

Fetches current weather data for given coordinates with automatic history saving.

**Parameters:**
- `lat: number | null` - Latitude coordinate
- `lon: number | null` - Longitude coordinate
- `locationName?: string` - Optional location name for history

**Returns:** React Query result with weather data
- `data: CurrentWeatherResponse | undefined`
- `isLoading: boolean`
- `error: Error | null`
- `refetch: () => void`

**Example:**
```typescript
const { data, isLoading, error } = useCurrentWeather(40.7128, -74.0060, 'New York');
```

#### `useCurrentWeatherByCity(city)`

Fetches current weather data by city name.

**Parameters:**
- `city: string` - City name to search

**Returns:** React Query result with weather data

**Example:**
```typescript
const { data, isLoading } = useCurrentWeatherByCity('London');
```

#### `useForecast(lat, lon)`

Fetches 5-day weather forecast for coordinates.

**Parameters:**
- `lat: number | null` - Latitude
- `lon: number | null` - Longitude

**Returns:** React Query result with forecast data
- `data: ForecastResponse | undefined`

**Example:**
```typescript
const { data: forecast } = useForecast(51.5074, -0.1278);
```

#### `useAirQuality(lat, lon)`

Fetches air quality data for coordinates.

**Parameters:**
- `lat: number | null` - Latitude
- `lon: number | null` - Longitude

**Returns:** React Query result with air pollution data
- `data: AirPollutionResponse | undefined`

**Cache:** 30 minutes stale time, 1 hour garbage collection

#### `useWeatherHistory(lat, lon, days?)`

Fetches weather history from IndexedDB.

**Parameters:**
- `lat: number | null` - Latitude
- `lon: number | null` - Longitude
- `days: number` - Number of days (default: 7)

**Returns:** React Query result with weather snapshots

### Search & Location Hooks

#### `useCitySearch(query)`

Searches for cities with autocomplete.

**Parameters:**
- `query: string` - Search query (min 2 characters)

**Returns:** React Query result with geocoding results
- `data: GeocodingResult[] | undefined`

**Example:**
```typescript
const debouncedQuery = useDebounce(searchText, 300);
const { data: cities } = useCitySearch(debouncedQuery);
```

#### `useGeolocation()`

Gets user's current location with caching and retry.

**Returns:**
```typescript
{
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
  retry: () => void;
}
```

**Cache:** 24 hours in localStorage

#### `useLocationPersistence()`

Manages last viewed location persistence.

**Returns:**
```typescript
{
  savedLocation: SavedLocation | null;
  saveLocation: (lat: number, lon: number, name: string) => void;
  clearLocation: () => void;
}
```

### Utility Hooks

#### `useDebounce<T>(value, delay?)`

Debounces a value to reduce rapid updates.

**Parameters:**
- `value: T` - Value to debounce
- `delay: number` - Delay in ms (default: 500)

**Returns:** Debounced value

**Example:**
```typescript
const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

#### `useReducedMotion()`

Detects if user prefers reduced motion.

**Returns:** `boolean` - True if reduced motion preferred

**Example:**
```typescript
const reducedMotion = useReducedMotion();
const animation = reducedMotion ? {} : fadeIn;
```

#### `useFavorites()`

Access favorites context (re-export from FavoritesContext).

**Returns:**
```typescript
{
  favorites: FavoriteLocation[];
  addFavorite: (name, lat, lon) => boolean;
  removeFavorite: (id) => void;
  isFavorite: (lat, lon) => boolean;
  toggleFavorite: (name, lat, lon) => boolean;
  canAddMore: boolean;
}
```

---

## Services

### weatherService

Main service for OpenWeatherMap API calls.

#### `getCurrentWeather(lat, lon)`

Get current weather by coordinates.

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude

**Returns:** `Promise<CurrentWeatherResponse>`

#### `getCurrentWeatherByCity(city)`

Get current weather by city name.

**Parameters:**
- `city: string` - City name

**Returns:** `Promise<CurrentWeatherResponse>`

#### `getForecast(lat, lon)`

Get 5-day forecast by coordinates.

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude

**Returns:** `Promise<ForecastResponse>`

#### `searchCities(query, limit?)`

Search for cities using geocoding.

**Parameters:**
- `query: string` - Search query
- `limit: number` - Max results (default: 5)

**Returns:** `Promise<GeocodingResult[]>`

#### `reverseGeocode(lat, lon)`

Get location name from coordinates.

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude

**Returns:** `Promise<GeocodingResult[]>`

#### `getAirPollution(lat, lon)`

Get air pollution data.

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude

**Returns:** `Promise<AirPollutionResponse>`

### weatherHistoryService

IndexedDB service for weather history.

#### `saveWeatherSnapshot(lat, lon, name, weatherData)`

Save weather snapshot to history.

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude
- `name: string` - Location name
- `weatherData: CurrentWeatherResponse` - Weather data

**Returns:** `Promise<void>`

#### `getWeatherHistory(lat, lon, days)`

Get weather history for location.

**Parameters:**
- `lat: number` - Latitude
- `lon: number` - Longitude
- `days: number` - Number of days

**Returns:** `Promise<WeatherSnapshot[]>`

#### `exportHistory()`

Export all history as JSON.

**Returns:** `Promise<string>` - JSON string

#### `importHistory(jsonData)`

Import history from JSON.

**Parameters:**
- `jsonData: string` - JSON data

**Returns:** `Promise<void>`

#### `clearHistory()`

Clear all history.

**Returns:** `Promise<void>`

---

## Types

### Weather Types

#### `WeatherCondition`
```typescript
interface WeatherCondition {
  id: number;          // Weather condition ID
  main: string;        // Group (Rain, Snow, Clear, etc.)
  description: string; // Condition description
  icon: string;        // Icon code
}
```

#### `MainWeatherData`
```typescript
interface MainWeatherData {
  temp: number;        // Temperature
  feels_like: number;  // Feels like temperature
  temp_min: number;    // Minimum temperature
  temp_max: number;    // Maximum temperature
  pressure: number;    // Atmospheric pressure (hPa)
  humidity: number;    // Humidity percentage
  sea_level?: number;  // Sea level pressure
  grnd_level?: number; // Ground level pressure
}
```

#### `CurrentWeatherResponse`
Complete current weather API response.

#### `ForecastResponse`
5-day forecast with 3-hour intervals.

#### `AirPollutionResponse`
Air quality data with AQI and pollutants.

### Widget Types

#### `WidgetSize`
```typescript
type WidgetSize = 'compact' | 'medium';
```

#### `WidgetProps`
```typescript
interface WidgetProps {
  locationId: string;
  size?: WidgetSize;
  weather?: WeatherData;
  isLoading?: boolean;
  error?: Error | null;
  onClick?: (locationId: string) => void;
  className?: string;
}
```

---

## Components

### Display Components

#### `WeatherDisplay`
Displays current weather with temperature, conditions, and trends.

**Props:**
- `weather: CurrentWeatherResponse` - Weather data

#### `ForecastDisplay`
5-day forecast with daily cards.

**Props:**
- `lat: number` - Latitude
- `lon: number` - Longitude

#### `HourlyForecast`
Horizontal scrollable hourly forecast.

**Props:**
- `lat: number` - Latitude
- `lon: number` - Longitude
- `limit?: number` - Max hours (default: 24)

#### `DetailedMetrics`
Detailed metrics (humidity, pressure, wind, visibility, sunrise/sunset).

**Props:**
- `weather: CurrentWeatherResponse` - Weather data

#### `AirQualityIndex`
Air quality display with pollutant details and health advice.

**Props:**
- `lat: number` - Latitude
- `lon: number` - Longitude

### Interactive Components

#### `CitySearch`
City search input with autocomplete.

**Props:**
- `onCitySelect: (lat, lon, name) => void` - Selection callback

#### `FavoriteButton`
Toggle button for favorites with animated heart.

**Props:**
- `isFavorite: boolean` - Is favorited
- `onToggle: () => void` - Toggle callback
- `disabled?: boolean` - Is disabled

#### `LocationButton`
Button to request geolocation.

**Props:**
- `onClick: () => void` - Click handler
- `loading?: boolean` - Loading state
- `disabled?: boolean` - Disabled state

#### `ThemeToggle`
Theme toggle button (light/dark).

#### `LanguageSelector`
Language selector dropdown (en, es, fr, de).

### Layout Components

#### `Layout`
Main layout with navigation.

**Props:**
- `children: ReactNode` - Page content

#### `PageTransition`
Wrapper for page transitions.

**Props:**
- `children: ReactNode` - Page content

### Animation Components

#### `WeatherAnimation`
Lottie weather animations.

**Props:**
- `conditionCode: string` - Weather icon code
- `size?: 'sm' | 'md' | 'lg'` - Size (default: 'md')

#### `WeatherBackground`
Animated weather background.

**Props:**
- `condition: string` - Weather condition

---

## Utilities

### Forecast Utils

#### `groupForecastByDay(forecasts)`
Groups forecast items by date.

**Returns:** `Record<string, ForecastItem[]>`

#### `getHighLowTemps(dayEntries)`
Calculates high/low temperatures.

**Returns:** `{ high: number; low: number }`

#### `getDailyCondition(dayEntries)`
Gets midday weather condition.

**Returns:** `string`

#### `processForecastData(forecasts)`
Processes forecast into daily summaries.

**Returns:** `DailySummary[]`

### Animation Utils

Pre-configured Framer Motion variants:
- `fadeIn` - Fade in/out
- `slideUp` - Slide up from bottom
- `slideDown` - Slide down from top
- `scaleIn` - Scale in animation
- `staggerContainer` - Container for staggered children
- `staggerItem` - Individual stagger item
- `buttonHover` - Button hover effect
- `buttonTap` - Button press effect
- `cardHover` - Card lift effect
- `pageTransition` - Page transition

**Transitions:**
- `springTransition` - Spring physics
- `smoothTransition` - Cubic-bezier

---

## Context Providers

### ThemeProvider

Theme management with light/dark mode.

**API:**
```typescript
const { theme, toggleTheme, setTheme } = useTheme();
```

**Features:**
- System preference detection
- localStorage persistence
- Auto HTML class updates

### FavoritesProvider

Centralized favorites management.

**API:**
```typescript
const {
  favorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  canAddMore
} = useFavoritesContext();
```

**Features:**
- Max 10 favorites
- localStorage persistence
- Real-time updates

---

## Environment Variables

```bash
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

---

## Cache Configuration

- **Weather Data:** 5 min stale, 10 min garbage collection
- **Forecast:** 5 min stale, 10 min garbage collection
- **Air Quality:** 30 min stale, 1 hour garbage collection
- **Geolocation:** 24 hours in localStorage
- **City Search:** 5 min stale

---

## Error Handling

All hooks use React Query's error handling:
```typescript
const { data, error, isError } = useCurrentWeather(lat, lon);

if (isError) {
  console.error('Weather fetch failed:', error);
}
```

Services throw errors that are caught by React Query.

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Last Updated:** December 4, 2025
