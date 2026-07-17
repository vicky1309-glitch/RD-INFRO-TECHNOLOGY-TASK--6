import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import EmptyState from "./EmptyState";
import {
  fetchFavorites,
  addFavoriteCity,
  removeFavoriteCity,
  pinFavoriteCity,
} from "../redux/favoriteSlice";

export default function FavoriteCities({ currentCity, currentCoords, onSelectCity }) {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <GlassCard className="p-6">
        <h2 className="mb-3 font-display text-lg font-bold text-ink">Favorite Cities</h2>
        <EmptyState icon="⭐" title="Sign in to save favorites" message="Create an account to pin cities and access them instantly." />
      </GlassCard>
    );
  }

  const isFavorite = items.some((f) => f.city.toLowerCase() === currentCity?.toLowerCase());

  const handleAdd = () => {
    if (!currentCity) return;
    dispatch(
      addFavoriteCity({
        city: currentCity,
        lat: currentCoords?.lat,
        lon: currentCoords?.lon,
      })
    );
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Favorite Cities</h2>
        {currentCity && !isFavorite && (
          <button onClick={handleAdd} className="btn-secondary !px-3 !py-1.5 text-xs">
            + Add {currentCity}
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-ink/50">Loading favorites...</p>}

      {!loading && items.length === 0 && (
        <EmptyState icon="🌍" title="No favorites yet" message="Search a city and add it to your favorites for one-click access." />
      )}

      <div className="flex flex-col gap-2">
        {items.map((fav, i) => (
          <motion.div
            key={fav.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between rounded-2xl bg-white/40 px-4 py-3 transition-colors hover:bg-white/70"
          >
            <button onClick={() => onSelectCity(fav.city)} className="flex items-center gap-2 text-left font-medium text-ink">
              {fav.isPinned && <span title="Pinned as default">📌</span>}
              {fav.city}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(pinFavoriteCity(fav.id))}
                className="text-xs text-ink/40 hover:text-dark-green"
                title="Pin as default"
              >
                {fav.isPinned ? "Pinned" : "Pin"}
              </button>
              <button
                onClick={() => dispatch(removeFavoriteCity(fav.id))}
                className="text-lg text-ink/30 hover:text-red-500"
                title="Remove"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
