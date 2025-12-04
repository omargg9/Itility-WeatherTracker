import Dexie, { type EntityTable } from 'dexie';

/**
 * Historical weather snapshot stored daily
 */
export interface WeatherSnapshot {
  id?: number;
  locationKey: string; // "lat,lon" for uniqueness
  locationName: string;
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD
  temp: number;
  tempMin: number;
  tempMax: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number; // mm
  weatherCondition: string; // e.g., "Clear", "Rain"
  weatherIcon: string;
  weatherDescription: string;
}

/**
 * Dexie database for weather history
 */
class WeatherHistoryDB extends Dexie {
  snapshots!: EntityTable<WeatherSnapshot, 'id'>;

  constructor() {
    super('WeatherHistoryDB');
    this.version(1).stores({
      snapshots: '++id, locationKey, date, timestamp',
    });
  }
}

const db = new WeatherHistoryDB();

/**
 * Store a weather snapshot for a location
 */
export async function saveWeatherSnapshot(
  lat: number,
  lon: number,
  locationName: string,
  weatherData: {
    main: { temp: number; temp_min: number; temp_max: number; feels_like: number; humidity: number; pressure: number };
    wind: { speed: number };
    rain?: { '1h'?: number };
    snow?: { '1h'?: number };
    weather: Array<{ main: string; icon: string }>;
  }
): Promise<void> {
  const locationKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  // Check if we already have a snapshot for this hour today
  const existing = await db.snapshots
    .where('locationKey')
    .equals(locationKey)
    .and(snapshot => {
      const snapshotDate = new Date(snapshot.timestamp);
      return snapshot.date === today && snapshotDate.getHours() === currentHour;
    })
    .first();

  const snapshotData = {
    temp: weatherData.main.temp,
    tempMin: weatherData.main.temp_min,
    tempMax: weatherData.main.temp_max,
    feelsLike: weatherData.main.feels_like,
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    windSpeed: weatherData.wind.speed,
    precipitation: weatherData.rain?.['1h'] || weatherData.snow?.['1h'] || 0,
    weatherCondition: weatherData.weather[0].main,
    weatherIcon: weatherData.weather[0].icon,
    weatherDescription: weatherData.weather[0].description,
  };

  if (existing) {
    // Update existing snapshot for this hour
    await db.snapshots.update(existing.id!, {
      timestamp: Date.now(),
      ...snapshotData,
    });
  } else {
    // Create new snapshot for this hour
    await db.snapshots.add({
      locationKey,
      locationName,
      timestamp: Date.now(),
      date: today,
      ...snapshotData,
    });
  }

  // Cleanup old snapshots (keep last 30 days)
  await cleanupOldSnapshots();
}

/**
 * Get historical snapshots for a location (last N days)
 */
export async function getWeatherHistory(
  lat: number,
  lon: number,
  days: number = 7
): Promise<WeatherSnapshot[]> {
  const locationKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffTimestamp = cutoffDate.getTime();

  const snapshots = await db.snapshots
    .where('locationKey')
    .equals(locationKey)
    .and((snapshot) => snapshot.timestamp >= cutoffTimestamp)
    .sortBy('timestamp');

  return snapshots;
}

/**
 * Delete snapshots older than 30 days
 */
async function cleanupOldSnapshots(): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  const cutoffTimestamp = cutoffDate.getTime();

  await db.snapshots
    .where('timestamp')
    .below(cutoffTimestamp)
    .delete();
}

/**
 * Export all history data as JSON
 */
export async function exportHistory(): Promise<string> {
  const allSnapshots = await db.snapshots.toArray();
  return JSON.stringify(allSnapshots, null, 2);
}

/**
 * Import history data from JSON
 */
export async function importHistory(jsonData: string): Promise<void> {
  try {
    const snapshots: WeatherSnapshot[] = JSON.parse(jsonData);
    await db.snapshots.bulkAdd(snapshots);
  } catch (error) {
    console.error('Failed to import history:', error);
    throw new Error('Invalid history data format');
  }
}

/**
 * Clear all history data
 */
export async function clearHistory(): Promise<void> {
  await db.snapshots.clear();
}

/**
 * Get storage usage estimate
 */
export async function getStorageInfo(): Promise<{
  count: number;
  estimatedSize: string;
}> {
  const count = await db.snapshots.count();
  // Rough estimate: ~200 bytes per snapshot
  const estimatedBytes = count * 200;
  const estimatedSize =
    estimatedBytes < 1024
      ? `${estimatedBytes} bytes`
      : estimatedBytes < 1024 * 1024
        ? `${(estimatedBytes / 1024).toFixed(1)} KB`
        : `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;

  return { count, estimatedSize };
}

/**
 * Generate sample historical data for testing (past 30 days)
 * Only use for development/testing purposes
 */
export async function generateSampleHistory(
  lat: number,
  lon: number,
  locationName: string,
  currentTemp: number
): Promise<void> {
  const locationKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const snapshots: Omit<WeatherSnapshot, 'id'>[] = [];

  // Generate data for past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Generate realistic temperature variation
    const baseTemp = currentTemp + (Math.random() - 0.5) * 10;
    const tempVariation = Math.random() * 5;

    snapshots.push({
      locationKey,
      locationName,
      timestamp: date.getTime(),
      date: date.toISOString().split('T')[0],
      temp: baseTemp,
      tempMin: baseTemp - tempVariation,
      tempMax: baseTemp + tempVariation,
      feelsLike: baseTemp - 2 + Math.random() * 4,
      humidity: 50 + Math.random() * 40,
      pressure: 1010 + Math.random() * 20,
      windSpeed: Math.random() * 10,
      precipitation: Math.random() > 0.7 ? Math.random() * 10 : 0,
      weatherCondition: Math.random() > 0.7 ? 'Rain' : Math.random() > 0.5 ? 'Clouds' : 'Clear',
      weatherIcon: '01d',
      weatherDescription: 'sample data',
    });
  }

  await db.snapshots.bulkAdd(snapshots);
  console.log(`Generated ${snapshots.length} sample history records for ${locationName}`);
}
