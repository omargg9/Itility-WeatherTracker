import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';

interface FavoritesListProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
}

export default function FavoritesList({ onSelectLocation }: FavoritesListProps) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Favorite Locations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.map((favorite, index) => (
          <motion.div
            key={favorite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 group relative overflow-hidden"
          >
            <button
              onClick={() => onSelectLocation(favorite.lat, favorite.lon, favorite.name)}
              className="w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
                {favorite.name}
              </h3>
              <p className="text-sm text-white/60 mt-1">
                {favorite.lat.toFixed(2)}, {favorite.lon.toFixed(2)}
              </p>
            </button>
            
            <button
              onClick={() => removeFavorite(favorite.id)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Remove favorite"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
