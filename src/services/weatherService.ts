import { apiClient } from '../lib/axios';
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResult,
} from '../types/weather';

export const weatherService = {
  getCurrentWeather: async (lat: number, lon: number): Promise<CurrentWeatherResponse> => {
    const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
      params: { lat, lon },
    });
    return response.data;
  },

  getCurrentWeatherByCity: async (city: string): Promise<CurrentWeatherResponse> => {
    const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
      params: { q: city },
    });
    return response.data;
  },

  getForecast: async (lat: number, lon: number): Promise<ForecastResponse> => {
    const response = await apiClient.get<ForecastResponse>('/forecast', {
      params: { lat, lon },
    });
    return response.data;
  },

  searchCities: async (query: string, limit: number = 5): Promise<GeocodingResult[]> => {
    const response = await apiClient.get<GeocodingResult[]>(
      'http://api.openweathermap.org/geo/1.0/direct',
      {
        params: { q: query, limit },
      }
    );
    return response.data;
  },

  reverseGeocode: async (lat: number, lon: number): Promise<GeocodingResult[]> => {
    const response = await apiClient.get<GeocodingResult[]>(
      'http://api.openweathermap.org/geo/1.0/reverse',
      {
        params: { lat, lon, limit: 1 },
      }
    );
    return response.data;
  },
};
