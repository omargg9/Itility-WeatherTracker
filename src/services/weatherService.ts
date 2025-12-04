import { apiClient } from '../lib/axios';
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResult,
  AirPollutionResponse,
} from '../types/weather';

/**
 * Weather API service for OpenWeatherMap
 */
export const weatherService = {
  /**
   * Get current weather by coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Current weather data
   */
  getCurrentWeather: async (lat: number, lon: number): Promise<CurrentWeatherResponse> => {
    const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
      params: { lat, lon },
    });
    return response.data;
  },

  /**
   * Get current weather by city name
   * @param city - City name
   * @returns Current weather data
   */
  getCurrentWeatherByCity: async (city: string): Promise<CurrentWeatherResponse> => {
    const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
      params: { q: city },
    });
    return response.data;
  },

  /**
   * Get 5-day weather forecast by coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns 5-day forecast data
   */
  getForecast: async (lat: number, lon: number): Promise<ForecastResponse> => {
    const response = await apiClient.get<ForecastResponse>('/forecast', {
      params: { lat, lon },
    });
    return response.data;
  },

  /**
   * Search for cities by name using geocoding
   * @param query - City search query
   * @param limit - Maximum number of results (default: 5)
   * @returns Array of geocoding results
   */
  searchCities: async (query: string, limit: number = 5): Promise<GeocodingResult[]> => {
    const response = await apiClient.get<GeocodingResult[]>(
      'http://api.openweathermap.org/geo/1.0/direct',
      {
        params: { q: query, limit },
      }
    );
    return response.data;
  },

  /**
   * Get location name from coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Array with location data
   */
  reverseGeocode: async (lat: number, lon: number): Promise<GeocodingResult[]> => {
    const response = await apiClient.get<GeocodingResult[]>(
      'http://api.openweathermap.org/geo/1.0/reverse',
      {
        params: { lat, lon, limit: 1 },
      }
    );
    return response.data;
  },

  /**
   * Get air pollution data for coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Air pollution data with AQI and pollutants
   */
  getAirPollution: async (lat: number, lon: number): Promise<AirPollutionResponse> => {
    const response = await apiClient.get<AirPollutionResponse>(
      'http://api.openweathermap.org/data/2.5/air_pollution',
      {
        params: { lat, lon },
      }
    );
    return response.data;
  },
};
