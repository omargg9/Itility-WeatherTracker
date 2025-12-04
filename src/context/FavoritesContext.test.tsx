import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider, useFavoritesContext } from './FavoritesContext';

describe('FavoritesContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.canAddMore).toBe(true);
  });

  it('adds a favorite successfully', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      const added = result.current.addFavorite('New York', 40.7128, -74.0060);
      expect(added).toBe(true);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].name).toBe('New York');
    expect(result.current.isFavorite(40.7128, -74.0060)).toBe(true);
  });

  it('removes a favorite successfully', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.addFavorite('New York', 40.7128, -74.0060);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.removeFavorite('40.7128--74.006');
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('toggles favorite on/off', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      const added = result.current.toggleFavorite('London', 51.5074, -0.1278);
      expect(added).toBe(true);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      const removed = result.current.toggleFavorite('London', 51.5074, -0.1278);
      expect(removed).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('prevents duplicate favorites', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.addFavorite('Paris', 48.8566, 2.3522);
    });

    act(() => {
      const added = result.current.addFavorite('Paris', 48.8566, 2.3522);
      expect(added).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(1);
  });

  it('enforces maximum of 10 favorites', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.addFavorite(`City ${i}`, i, i);
      }
    });

    expect(result.current.favorites).toHaveLength(10);
    expect(result.current.canAddMore).toBe(false);

    act(() => {
      const added = result.current.addFavorite('City 11', 11, 11);
      expect(added).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(10);
  });

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.addFavorite('Tokyo', 35.6762, 139.6503);
    });

    const stored = localStorage.getItem('weather_favorites');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('Tokyo');
  });

  it('loads favorites from localStorage on initialization', () => {
    const initial = [
      {
        id: '40.7128--74.006',
        name: 'New York',
        lat: 40.7128,
        lon: -74.0060,
        addedAt: Date.now(),
      },
    ];
    localStorage.setItem('weather_favorites', JSON.stringify(initial));

    const { result } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].name).toBe('New York');
  });

  it('throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useFavoritesContext());
    }).toThrow('useFavoritesContext must be used within a FavoritesProvider');
  });
});
