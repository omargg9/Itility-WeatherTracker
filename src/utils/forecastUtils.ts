import type { ForecastItem } from '../types/weather';

/** Daily weather summary aggregated from forecast data */
export interface DailySummary {
  /** Date string (YYYY-MM-DD) */
  date: string;
  /** Highest temperature of the day */
  high: number;
  /** Lowest temperature of the day */
  low: number;
  /** Weather condition description */
  condition: string;
  /** Weather icon code */
  iconCode: string;
  /** Probability of precipitation (0-1) */
  precipProbability: number;
}

/**
 * Group forecast items by date
 * @param forecasts - Array of forecast items
 * @returns Object with dates as keys and forecast arrays as values
 */
export const groupForecastByDay = (forecasts: ForecastItem[]): Record<string, ForecastItem[]> => {
  return forecasts.reduce((acc, forecast) => {
    const date = forecast.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(forecast);
    return acc;
  }, {} as Record<string, ForecastItem[]>);
};

/**
 * Calculate high and low temperatures for a day
 * @param dayEntries - Forecast items for a single day
 * @returns Object with high and low temperatures
 */
export const getHighLowTemps = (dayEntries: ForecastItem[]): { high: number; low: number } => {
  const temps = dayEntries.map(entry => entry.main.temp);
  return {
    high: Math.max(...temps),
    low: Math.min(...temps),
  };
};

/**
 * Get representative weather condition for a day (midday)
 * @param dayEntries - Forecast items for a single day
 * @returns Weather condition description
 */
export const getDailyCondition = (dayEntries: ForecastItem[]): string => {
  // Get the condition at midday (12:00) or closest to it
  const middayEntry = dayEntries.find(entry => entry.dt_txt.includes('12:00')) || dayEntries[0];
  return middayEntry.weather[0].description;
};

/**
 * Get maximum precipitation probability for a day
 * @param dayEntries - Forecast items for a single day
 * @returns Maximum precipitation probability (0-1)
 */
export const getDailyPrecipitation = (dayEntries: ForecastItem[]): number => {
  const maxPop = Math.max(...dayEntries.map(entry => entry.pop));
  return maxPop;
};

/**
 * Process forecast data into daily summaries
 * @param forecasts - Array of forecast items
 * @returns Array of daily summaries (max 5 days)
 */
export const processForecastData = (forecasts: ForecastItem[]): DailySummary[] => {
  const groupedByDay = groupForecastByDay(forecasts);

  return Object.entries(groupedByDay)
    .slice(0, 5)
    .map(([date, entries]) => {
      const { high, low } = getHighLowTemps(entries);
      const middayEntry = entries.find(entry => entry.dt_txt.includes('12:00')) || entries[0];

      return {
        date,
        high,
        low,
        condition: getDailyCondition(entries),
        iconCode: middayEntry.weather[0].icon,
        precipProbability: getDailyPrecipitation(entries),
      };
    });
};
