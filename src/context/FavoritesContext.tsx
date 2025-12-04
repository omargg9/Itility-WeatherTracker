import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteLocation[];
  addFavorite: (name: string, lat: number, lon: number) => boolean;
  removeFavorite: (id: string) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  toggleFavorite: (name: string, lat: number, lon: number) => boolean;
  canAddMore: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'weather_favorites';
const MAX_FAVORITES = 10;

/**
 * FavoritesProvider - Centralized favorites state management
 * 
 * Provides shared favorites state across the entire app, fixing the issue
 * where favorites list doesn't update immediately after adding/removing.
 * 
 * Features:
 * - Centralized state management via React Context
 * - Automatic localStorage persistence
 * - Real-time updates across all components
 * - Maximum 10 favorites enforced
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      return [];
    }
  });

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = (name: string, lat: number, lon: number): boolean => {
    if (favorites.length >= MAX_FAVORITES) {
      return false;
    }

    const id = `${lat}-${lon}`;
    if (favorites.some(fav => fav.id === id)) {
      return false; // Already exists
    }

    const newFavorite: FavoriteLocation = {
      id,
      name,
      lat,
      lon,
      addedAt: Date.now(),
    };

    setFavorites(prev => [...prev, newFavorite]);
    return true;
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (lat: number, lon: number): boolean => {
    const id = `${lat}-${lon}`;
    return favorites.some(fav => fav.id === id);
  };

  const toggleFavorite = (name: string, lat: number, lon: number): boolean => {
    const id = `${lat}-${lon}`;
    if (isFavorite(lat, lon)) {
      removeFavorite(id);
      return false;
    } else {
      return addFavorite(name, lat, lon);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    canAddMore: favorites.length < MAX_FAVORITES,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * useFavorites hook - Access favorites context
 * 
 * Must be used within a FavoritesProvider. Returns the favorites
 * state and all mutation functions.
 * 
 * @throws {Error} If used outside FavoritesProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFavoritesContext(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}
