import { useState, useEffect, useCallback } from 'react';

interface SavedLocation {
  lat: number;
  lon: number;
  name?: string;
  timestamp: number;
}

const STORAGE_KEY = 'last-viewed-location';

/**
 * Hook to persist and restore last viewed location
 * Saves to localStorage on change, restores on mount
 */
export const useLocationPersistence = () => {
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);

  // Load saved location on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedLocation = JSON.parse(saved);
        setSavedLocation(parsed);
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
    }
  }, []);

  // Save location to localStorage
  const saveLocation = useCallback((lat: number, lon: number, name?: string) => {
    const location: SavedLocation = {
      lat,
      lon,
      name,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      setSavedLocation(location);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  }, []);

  // Clear saved location
  const clearLocation = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedLocation(null);
    } catch (error) {
      console.error('Error clearing location:', error);
    }
  }, []);

  return {
    savedLocation,
    saveLocation,
    clearLocation,
  };
};
