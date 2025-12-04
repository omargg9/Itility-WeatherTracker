/** Weather condition details from API */
export interface WeatherCondition {
  /** Weather condition ID */
  id: number;
  /** Group of weather parameters (Rain, Snow, Clear, etc.) */
  main: string;
  /** Weather condition description */
  description: string;
  /** Weather icon ID */
  icon: string;
}

/** Main weather data metrics */
export interface MainWeatherData {
  /** Temperature (Kelvin by default, can be configured) */
  temp: number;
  /** Feels like temperature */
  feels_like: number;
  /** Minimum temperature */
  temp_min: number;
  /** Maximum temperature */
  temp_max: number;
  /** Atmospheric pressure (hPa) */
  pressure: number;
  /** Humidity percentage */
  humidity: number;
  /** Sea level pressure (hPa) */
  sea_level?: number;
  /** Ground level pressure (hPa) */
  grnd_level?: number;
}

/** Wind information */
export interface Wind {
  /** Wind speed (meter/sec or miles/hour) */
  speed: number;
  /** Wind direction in degrees */
  deg: number;
  /** Wind gust speed */
  gust?: number;
}

/** Cloud coverage data */
export interface Clouds {
  /** Cloudiness percentage */
  all: number;
}

/** System data (country, sunrise/sunset) */
export interface Sys {
  /** Internal parameter */
  type?: number;
  /** Internal parameter */
  id?: number;
  /** Country code (e.g., 'US', 'GB') */
  country: string;
  /** Sunrise time (Unix timestamp UTC) */
  sunrise: number;
  /** Sunset time (Unix timestamp UTC) */
  sunset: number;
}

/** Geographic coordinates */
export interface Coord {
  /** Longitude */
  lon: number;
  /** Latitude */
  lat: number;
}

/** Complete current weather API response */
export interface CurrentWeatherResponse {
  /** Geographic coordinates */
  coord: Coord;
  /** Weather conditions array */
  weather: WeatherCondition[];
  /** Internal parameter */
  base: string;
  /** Main weather data */
  main: MainWeatherData;
  /** Visibility in meters */
  visibility: number;
  /** Wind data */
  wind: Wind;
  /** Cloud coverage */
  clouds: Clouds;
  /** Data calculation time (Unix timestamp UTC) */
  dt: number;
  /** System data */
  sys: Sys;
  /** Timezone offset from UTC in seconds */
  timezone: number;
  /** City ID */
  id: number;
  /** City name */
  name: string;
  /** Internal parameter */
  cod: number;
}

/** Individual forecast data point (3-hour interval) */
export interface ForecastItem {
  /** Forecast time (Unix timestamp UTC) */
  dt: number;
  /** Main weather data */
  main: MainWeatherData;
  /** Weather conditions */
  weather: WeatherCondition[];
  /** Cloud coverage */
  clouds: Clouds;
  /** Wind data */
  wind: Wind;
  /** Visibility in meters */
  visibility: number;
  /** Probability of precipitation (0-1) */
  pop: number;
  /** System data */
  sys: {
    /** Part of day ('d' = day, 'n' = night) */
    pod: string;
  };
  /** Forecast time in text format */
  dt_txt: string;
}

/** 5-day forecast API response */
export interface ForecastResponse {
  /** Internal parameter */
  cod: string;
  /** Internal parameter */
  message: number;
  /** Number of forecast items */
  cnt: number;
  /** Array of forecast data points */
  list: ForecastItem[];
  /** City information */
  city: {
    /** City ID */
    id: number;
    /** City name */
    name: string;
    /** Coordinates */
    coord: Coord;
    /** Country code */
    country: string;
    /** City population */
    population: number;
    /** Timezone offset from UTC */
    timezone: number;
    /** Sunrise time (Unix timestamp UTC) */
    sunrise: number;
    /** Sunset time (Unix timestamp UTC) */
    sunset: number;
  };
}

/** Geocoding API result for city search */
export interface GeocodingResult {
  /** City name */
  name: string;
  /** City name in different languages */
  local_names?: Record<string, string>;
  /** Latitude */
  lat: number;
  /** Longitude */
  lon: number;
  /** Country code */
  country: string;
  /** State/province (if available) */
  state?: string;
}

/** Air quality pollutant concentrations */
export interface AirQualityComponents {
  /** Carbon monoxide (μg/m³) */
  co: number;
  /** Nitrogen monoxide (μg/m³) */
  no: number;
  /** Nitrogen dioxide (μg/m³) */
  no2: number;
  /** Ozone (μg/m³) */
  o3: number;
  /** Sulphur dioxide (μg/m³) */
  so2: number;
  /** Fine particles matter (μg/m³) */
  pm2_5: number;
  /** Coarse particulate matter (μg/m³) */
  pm10: number;
  /** Ammonia (μg/m³) */
  nh3: number;
}

/** Air pollution data snapshot */
export interface AirPollutionData {
  /** AQI data */
  main: {
    /** Air Quality Index (1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor) */
    aqi: number;
  };
  /** Individual pollutant measurements */
  components: AirQualityComponents;
  /** Data timestamp (Unix timestamp UTC) */
  dt: number;
}

/** Air pollution API response */
export interface AirPollutionResponse {
  /** Geographic coordinates */
  coord: Coord;
  /** Array of pollution data */
  list: AirPollutionData[];
}

/** Alias for current weather data */
export type WeatherData = CurrentWeatherResponse;