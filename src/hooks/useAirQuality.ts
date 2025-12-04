import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';

/**
 * Fetch air quality data for coordinates
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns React Query result with air pollution data
 */
export function useAirQuality(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['airQuality', lat, lon],
    queryFn: () => weatherService.getAirPollution(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
