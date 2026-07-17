import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import GlassCard from "./GlassCard";
import { getWeatherEmoji } from "../utils/weatherIcons";
import { formatTemp, formatTime, degToCompass, metersToKm } from "../utils/weatherUtils";

export default function WeatherCard({ weather }) {
  const units = useSelector((state) => state.theme.units);

  if (!weather) return null;

  const {
    name,
    sys,
    main,
    weather: conditions,
    wind,
    visibility,
    clouds,
    timezone,
  } = weather;
  const condition = conditions?.[0];

  const stats = [
    { label: "Feels Like", value: formatTemp(main.feels_like, units), icon: "🌡️" },
    { label: "Humidity", value: `${main.humidity}%`, icon: "💧" },
    { label: "Wind", value: `${Math.round(wind.speed)} ${units === "metric" ? "km/h" : "mph"} ${degToCompass(wind.deg || 0)}`, icon: "🍃" },
    { label: "Pressure", value: `${main.pressure} hPa`, icon: "📊" },
    { label: "Visibility", value: `${metersToKm(visibility ?? 10000)} km`, icon: "👁️" },
    { label: "Cloudiness", value: `${clouds?.all ?? 0}%`, icon: "☁️" },
    { label: "Sunrise", value: formatTime(sys.sunrise, timezone), icon: "🌅" },
    { label: "Sunset", value: formatTime(sys.sunset, timezone), icon: "🌇" },
  ];

  return (
    <GlassCard className="overflow-hidden p-8" solid>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-dark-green/70">
            {name}, {sys.country}
          </p>
          <div className="mt-1 flex items-end gap-3">
            <h1 className="font-display text-6xl font-extrabold text-ink">
              {formatTemp(main.temp, units)}
            </h1>
            <motion.span
              className="mb-2 animate-float text-5xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {getWeatherEmoji(condition?.icon)}
            </motion.span>
          </div>
          <p className="mt-1 text-lg font-medium capitalize text-ink/70">{condition?.description}</p>
        </div>

        <div className="flex gap-4 rounded-2xl bg-white/40 px-5 py-3 text-sm">
          <div className="text-center">
            <p className="text-ink/50">High</p>
            <p className="font-bold text-dark-green">{formatTemp(main.temp_max, units)}</p>
          </div>
          <div className="w-px bg-ink/10" />
          <div className="text-center">
            <p className="text-ink/50">Low</p>
            <p className="font-bold text-dark-green">{formatTemp(main.temp_min, units)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/40 p-4 text-center transition-colors hover:bg-white/60">
            <p className="text-xl">{s.icon}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/50">{s.label}</p>
            <p className="mt-0.5 font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
