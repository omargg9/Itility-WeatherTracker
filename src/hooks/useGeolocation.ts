import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

interface CachedLocation {
  lat: number;
  lon: number;
  timestamp: number;
}

const CACHE_KEY = 'weather-app-location';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Enhanced geolocation hook with caching and retry functionality
 * Respects user's location preferences and caches results
 */
export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permissionDenied: false,
  });

  // Load cached location from localStorage
  const loadCachedLocation = useCallback((): CachedLocation | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed: CachedLocation = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid (within 24 hours)
      if (now - parsed.timestamp < CACHE_DURATION) {
        return parsed;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error('Error loading cached location:', error);
      return null;
    }
  }, []);

  // Save location to localStorage
  const saveCachedLocation = useCallback((lat: number, lon: number) => {
    try {
      const cached: CachedLocation = {
        lat,
        lon,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
      console.error('Error saving location to cache:', error);
    }
  }, []);

  // Request current location
  const requestLocation = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
        permissionDenied: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setState({
          latitude: lat,
          longitude: lon,
          error: null,
          loading: false,
          permissionDenied: false,
        });

        // Save to cache
        saveCachedLocation(lat, lon);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        let permissionDenied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access or search for a city.';
            permissionDenied = true;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again or search for a city.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = error.message;
        }

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
          permissionDenied,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000, // 10 seconds
        maximumAge: 600000, // 10 minutes
      }
    );
  }, [saveCachedLocation]);

  // On mount, try to load cached location or request new one
  useEffect(() => {
    const cached = loadCachedLocation();

    if (cached) {
      // Use cached location immediately
      setState({
        latitude: cached.lat,
        longitude: cached.lon,
        error: null,
        loading: false,
        permissionDenied: false,
      });
    } else {
      // No cache, request new location
      requestLocation();
    }
  }, [loadCachedLocation, requestLocation]);

  return {
    ...state,
    retry: requestLocation,
    clearCache: () => localStorage.removeItem(CACHE_KEY),
  };
};
