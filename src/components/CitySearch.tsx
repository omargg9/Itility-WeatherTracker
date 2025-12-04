import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../hooks/useDebounce";
import { useCitySearch } from "../hooks/useCitySearch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { slideDown } from "@/utils/animations";

interface CitySearchProps {
  onCitySelect: (lat: number, lon: number, name: string) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: cities, isLoading } = useCitySearch(debouncedQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (cities && cities.length > 0 && query.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [cities, query]);

  const handleSelect = (
    lat: number,
    lon: number,
    name: string,
    country: string
  ) => {
    const displayName = `${name}, ${country}`;
    setQuery(displayName);
    setIsOpen(false);
    onCitySelect(lat, lon, displayName);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => cities && cities.length > 0 && setIsOpen(true)}
          placeholder="Search city..."
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          aria-label="Search for a city"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen &&
          cities &&
          cities.length > 0 &&
          (reducedMotion ? (
            <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl overflow-hidden">
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  onClick={() =>
                    handleSelect(city.lat, city.lon, city.name, city.country)
                  }
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 min-h-11"
                >
                  <div className="font-medium text-gray-900">
                    {city.name}
                    {city.state && `, ${city.state}`}
                  </div>
                  <div className="text-sm text-gray-600">{city.country}</div>
                </button>
              ))}
            </div>
          ) : (
            <motion.div
              variants={slideDown}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl overflow-hidden"
            >
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  onClick={() =>
                    handleSelect(city.lat, city.lon, city.name, city.country)
                  }
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 min-h-11"
                >
                  <div className="font-medium text-gray-900">
                    {city.name}
                    {city.state && `, ${city.state}`}
                  </div>
                  <div className="text-sm text-gray-600">{city.country}</div>
                </button>
              ))}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
