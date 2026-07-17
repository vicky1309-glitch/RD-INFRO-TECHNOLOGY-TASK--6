import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  searchCitySuggestions,
  clearSuggestions,
  addRecentSearch,
  clearRecentSearches,
} from "../redux/weatherSlice";
import useVoiceSearch, { parseVoiceCommand } from "../hooks/useVoiceSearch";
import { pushToast } from "../redux/notificationSlice";

export default function SearchBar({ onSelectCity }) {
  const dispatch = useDispatch();
  const { suggestions, recentSearches } = useSelector((state) => state.weather);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);

  const handleVoiceResult = useCallback(
    (text) => {
      const command = parseVoiceCommand(text);
      if (command.intent === "SEARCH_CITY" && command.city) {
        setQuery(command.city);
        onSelectCity(command.city);
        dispatch(addRecentSearch(command.city));
      } else if (command.intent === "ASK_RAIN") {
        dispatch(pushToast({ type: "info", message: "Check the hourly forecast below for rain chances." }));
      } else if (command.intent === "ASK_TEMPERATURE") {
        dispatch(pushToast({ type: "info", message: "Current temperature is shown on the main weather card." }));
      }
    },
    [dispatch, onSelectCity]
  );

  const { listening, supported, startListening } = useVoiceSearch({ onResult: handleVoiceResult });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      dispatch(clearSuggestions());
      return;
    }
    debounceRef.current = setTimeout(() => {
      dispatch(searchCitySuggestions(query.trim()));
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, dispatch]);

  const selectCity = (city) => {
    setQuery("");
    setFocused(false);
    dispatch(clearSuggestions());
    dispatch(addRecentSearch(city));
    onSelectCity(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) selectCity(query.trim());
  };

  const showDropdown = focused && (suggestions.length > 0 || (query.length < 2 && recentSearches.length > 0));

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search any city..."
            className="input-field pr-10"
            aria-label="Search city"
          />
          {supported && (
            <button
              type="button"
              onClick={startListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${
                listening ? "animate-pulse text-mantis" : "text-ink/40 hover:text-mantis"
              }`}
              aria-label="Voice search"
              title="Voice search"
            >
              🎙️
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary !px-5 !py-3">
          Search
        </button>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card-solid absolute z-50 mt-2 w-full overflow-hidden p-2"
          >
            {query.length >= 2 && suggestions.length > 0 && (
              <div>
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Suggestions
                </p>
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.name}-${s.lat}-${i}`}
                    onClick={() => selectCity(s.name)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/60"
                  >
                    <span>📍</span>
                    <span className="font-medium">{s.name}</span>
                    <span className="text-ink/40">
                      {s.state ? `${s.state}, ` : ""}
                      {s.country}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query.length < 2 && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 pb-1 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Recent</p>
                  <button
                    onClick={() => dispatch(clearRecentSearches())}
                    className="text-xs font-medium text-ink/40 hover:text-dark-green"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((city, i) => (
                  <button
                    key={`${city}-${i}`}
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/60"
                  >
                    <span>🕓</span>
                    <span className="font-medium">{city}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
