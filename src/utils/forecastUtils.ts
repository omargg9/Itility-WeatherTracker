import type { ForecastItem } from '../types/weather';

export interface DailySummary {
  date: string;
  high: number;
  low: number;
  condition: string;
  iconCode: string;
  precipProbability: number;
}

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

export const getHighLowTemps = (dayEntries: ForecastItem[]): { high: number; low: number } => {
  const temps = dayEntries.map(entry => entry.main.temp);
  return {
    high: Math.max(...temps),
    low: Math.min(...temps),
  };
};

export const getDailyCondition = (dayEntries: ForecastItem[]): string => {
  // Get the condition at midday (12:00) or closest to it
  const middayEntry = dayEntries.find(entry => entry.dt_txt.includes('12:00')) || dayEntries[0];
  return middayEntry.weather[0].description;
};

export const getDailyPrecipitation = (dayEntries: ForecastItem[]): number => {
  const maxPop = Math.max(...dayEntries.map(entry => entry.pop));
  return maxPop;
};

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
