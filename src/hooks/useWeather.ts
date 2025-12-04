import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';
import { saveWeatherSnapshot } from '../services/weatherHistoryService';
import { useEffect } from 'react';

/**
 * Fetch current weather data for coordinates with auto-save to history
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @param locationName - Optional location name for history
 * @returns React Query result with weather data
 */
export const useCurrentWeather = (lat: number | null, lon: number | null, locationName?: string) => {
  const query = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => weatherService.getCurrentWeather(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Auto-save snapshot when data is fetched successfully
  useEffect(() => {
    if (query.data && lat !== null && lon !== null) {
      const name = locationName || query.data.name || 'Unknown Location';
      saveWeatherSnapshot(lat, lon, name, query.data).catch((error) => {
        console.error('Failed to save weather snapshot:', error);
      });
    }
  }, [query.data, lat, lon, locationName]);

  return query;
};

/**
 * Fetch current weather data by city name
 * @param city - City name to search
 * @returns React Query result with weather data
 */
export const useCurrentWeatherByCity = (city: string) => {
  return useQuery({
    queryKey: ['weather', 'city', city],
    queryFn: () => weatherService.getCurrentWeatherByCity(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch 5-day weather forecast for coordinates
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns React Query result with forecast data
 */
export const useForecast = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () => weatherService.getForecast(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
