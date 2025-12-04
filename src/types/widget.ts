import type { WeatherData } from './weather';

/**
 * Widget size variants
 */
export type WidgetSize = 'compact' | 'medium';

/**
 * Widget display props
 */
export interface WidgetProps {
  /** Location identifier (city name or coordinates) */
  locationId: string;
  /** Widget size variant */
  size?: WidgetSize;
  /** Weather data to display */
  weather?: WeatherData;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Click handler for expanding to full view */
  onClick?: (locationId: string) => void;
  /** Custom className for styling */
  className?: string;
}

/**
 * Widget layout preferences
 */
export interface WidgetLayoutPreferences {
  /** View mode: grid or list */
  viewMode: 'grid' | 'list';
  /** Widget size preference */
  widgetSize: WidgetSize;
  /** Custom widget order (location IDs) */
  widgetOrder: string[];
}

/**
 * Widget dimensions based on size
 */
export const WIDGET_DIMENSIONS: Record<WidgetSize, { width: string; height: string }> = {
  compact: { width: '120px', height: '120px' },
  medium: { width: '200px', height: '160px' },
};
