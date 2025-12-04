/**
 * useFavorites hook - Convenience re-export of useFavoritesContext
 * 
 * This maintains backward compatibility while using the new context-based
 * favorites management system. All components can continue using useFavorites()
 * and will automatically get real-time updates.
 * 
 * @see FavoritesContext for the actual implementation
 */
export { useFavoritesContext as useFavorites, type FavoriteLocation } from '../context/FavoritesContext';
