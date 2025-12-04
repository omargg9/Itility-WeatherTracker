import { useState, useEffect } from 'react';

export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  addedAt: number;
}

const STORAGE_KEY = 'weather_favorites';
const MAX_FAVORITES = 10;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
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

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    canAddMore: favorites.length < MAX_FAVORITES,
  };
};
