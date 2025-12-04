import type { CurrentWeatherResponse } from "../types/weather";
import WeatherAnimation from "./WeatherAnimation";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import { WeatherBackground } from "./WeatherBackground";

interface WeatherDisplayProps {
  weather: CurrentWeatherResponse;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const { main, weather: conditions, wind, name, coord } = weather;
  const { isFavorite, toggleFavorite, canAddMore } = useFavorites();

  const handleToggleFavorite = () => {
    toggleFavorite(name, coord.lat, coord.lon);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl relative overflow-hidden">
      <WeatherBackground condition={conditions[0].main} />

      <div className="absolute top-4 right-4 z-10">
        <FavoriteButton
          isFavorite={isFavorite(coord.lat, coord.lon)}
          onToggle={handleToggleFavorite}
          disabled={!canAddMore && !isFavorite(coord.lat, coord.lon)}
        />
      </div>

      <div className="text-center mb-6 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-2">{name}</h2>
        <p className="text-xl text-white/80 capitalize">
          {conditions[0].description}
        </p>
      </div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        <WeatherAnimation conditionCode={conditions[0].icon} size="lg" />
        <div className="text-7xl font-bold text-white mt-4">
          {Math.round(main.temp)}°C
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-white/60 mb-1">Feels Like</p>
          <p className="text-2xl font-semibold text-white">
            {Math.round(main.feels_like)}°C
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-white/60 mb-1">Humidity</p>
          <p className="text-2xl font-semibold text-white">{main.humidity}%</p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-white/60 mb-1">Wind Speed</p>
          <p className="text-2xl font-semibold text-white">
            {Math.round(wind.speed)} m/s
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-sm text-white/60 mb-1">Pressure</p>
          <p className="text-2xl font-semibold text-white">
            {main.pressure} hPa
          </p>
        </div>
      </div>
    </div>
  );
}
