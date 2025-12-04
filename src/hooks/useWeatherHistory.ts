import { useQuery } from '@tanstack/react-query';
import { getWeatherHistory, type WeatherSnapshot } from '../services/weatherHistoryService';

/**
 * Fetch weather history for a location from IndexedDB
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @param days - Number of days of history to fetch (default: 7)
 * @returns React Query result with weather snapshots
 */
export function useWeatherHistory(lat: number | null, lon: number | null, days: number = 7) {
  return useQuery({
    queryKey: ['weatherHistory', lat, lon, days],
    queryFn: () => getWeatherHistory(lat!, lon!, days),
    enabled: lat !== null && lon !== null,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
