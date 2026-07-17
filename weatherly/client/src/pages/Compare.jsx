import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import EmptyState from "../components/EmptyState";
import weatherApi from "../services/weatherApi";
import { getWeatherEmoji } from "../utils/weatherIcons";
import { getAqiLabel } from "../utils/weatherUtils";

function CitySelector({ label, value, onChange, onLoad }) {
  return (
    <div className="flex gap-2">
      <input
        className="input-field"
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onLoad()}
      />
      <button onClick={onLoad} className="btn-primary !px-5">
        Load
      </button>
    </div>
  );
}

const ROWS = [
  { key: "temp", label: "Temperature", format: (w) => `${Math.round(w.main.temp)}°C` },
  { key: "feels_like", label: "Feels Like", format: (w) => `${Math.round(w.main.feels_like)}°C` },
  { key: "humidity", label: "Humidity", format: (w) => `${w.main.humidity}%` },
  { key: "wind", label: "Wind Speed", format: (w) => `${Math.round(w.wind.speed)} km/h` },
  { key: "pressure", label: "Pressure", format: (w) => `${w.main.pressure} hPa` },
];

export default function Compare() {
  const [cityAInput, setCityAInput] = useState("Delhi");
  const [cityBInput, setCityBInput] = useState("Chennai");
  const [cityA, setCityA] = useState(null);
  const [cityB, setCityB] = useState(null);
  const [aqiA, setAqiA] = useState(null);
  const [aqiB, setAqiB] = useState(null);
  const [error, setError] = useState("");

  const loadCity = async (cityName, setWeather, setAqi) => {
    try {
      setError("");
      const [weatherRes, aqiRes] = await Promise.all([
        weatherApi.getCurrentWeather(cityName),
        weatherApi.getAirQuality(cityName).catch(() => null),
      ]);
      setWeather(weatherRes.data.weather);
      if (aqiRes) setAqi(aqiRes.data.airQuality.list[0]);
    } catch (err) {
      setError(err.response?.data?.message || `Could not load weather for "${cityName}"`);
    }
  };

  const betterValue = (key, a, b) => {
    if (!a || !b) return null;
    if (key === "temp" || key === "feels_like") return a.main[key] > b.main[key] ? "a" : "b";
    if (key === "humidity") return a.main.humidity < b.main.humidity ? "a" : "b";
    if (key === "wind") return a.wind.speed < b.wind.speed ? "a" : "b";
    return null;
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-16 pt-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">City Comparison</h1>
        <p className="text-sm text-ink/60">Compare weather, humidity, wind and air quality side by side.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CitySelector label="City A" value={cityAInput} onChange={setCityAInput} onLoad={() => loadCity(cityAInput, setCityA, setAqiA)} />
        <CitySelector label="City B" value={cityBInput} onChange={setCityBInput} onLoad={() => loadCity(cityBInput, setCityB, setAqiB)} />
      </div>

      {error && <EmptyState icon="🌦️" title="Couldn't load city" message={error} />}

      {!cityA && !cityB && (
        <EmptyState icon="⚖️" title="Compare two cities" message="Load two cities above to see a side-by-side breakdown." />
      )}

      {(cityA || cityB) && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="overflow-x-auto p-6" solid>
            <div className="mb-4 grid grid-cols-3 items-center gap-2 text-center">
              <div>
                {cityA ? (
                  <>
                    <p className="text-3xl">{getWeatherEmoji(cityA.weather[0].icon)}</p>
                    <p className="font-display text-lg font-bold text-ink">{cityA.name}</p>
                  </>
                ) : (
                  <p className="text-ink/30">City A</p>
                )}
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-ink/40">vs</p>
              <div>
                {cityB ? (
                  <>
                    <p className="text-3xl">{getWeatherEmoji(cityB.weather[0].icon)}</p>
                    <p className="font-display text-lg font-bold text-ink">{cityB.name}</p>
                  </>
                ) : (
                  <p className="text-ink/30">City B</p>
                )}
              </div>
            </div>

            <div className="flex flex-col divide-y divide-white/40">
              {ROWS.map((row) => {
                const winner = betterValue(row.key, cityA, cityB);
                return (
                  <div key={row.key} className="grid grid-cols-3 items-center gap-2 py-3 text-center">
                    <p className={`font-bold ${winner === "a" ? "text-dark-green" : "text-ink"}`}>
                      {cityA ? row.format(cityA) : "--"}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{row.label}</p>
                    <p className={`font-bold ${winner === "b" ? "text-dark-green" : "text-ink"}`}>
                      {cityB ? row.format(cityB) : "--"}
                    </p>
                  </div>
                );
              })}

              <div className="grid grid-cols-3 items-center gap-2 py-3 text-center">
                <p className="font-bold text-ink">{aqiA ? getAqiLabel(aqiA.main.aqi).label : "--"}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Air Quality</p>
                <p className="font-bold text-ink">{aqiB ? getAqiLabel(aqiB.main.aqi).label : "--"}</p>
              </div>

              <div className="grid grid-cols-3 items-center gap-2 py-3 text-center">
                <p className="font-bold text-ink">
                  {cityA ? `${Math.round((cityA.rain?.["1h"] || 0) * 10)}%` : "--"}
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Rain Probability</p>
                <p className="font-bold text-ink">
                  {cityB ? `${Math.round((cityB.rain?.["1h"] || 0) * 10)}%` : "--"}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
