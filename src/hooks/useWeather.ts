import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';

export const useCurrentWeather = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => weatherService.getCurrentWeather(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCurrentWeatherByCity = (city: string) => {
  return useQuery({
    queryKey: ['weather', 'city', city],
    queryFn: () => weatherService.getCurrentWeatherByCity(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useForecast = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () => weatherService.getForecast(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
