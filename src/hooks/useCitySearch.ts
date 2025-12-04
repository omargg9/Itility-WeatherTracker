import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';

/**
 * Search for cities by name with geocoding
 * @param query - City search query (min 2 characters)
 * @returns React Query result with city results
 */
export const useCitySearch = (query: string) => {
  return useQuery({
    queryKey: ['cities', query],
    queryFn: () => weatherService.searchCities(query, 5),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};
