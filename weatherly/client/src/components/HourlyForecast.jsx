import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { getWeatherEmoji } from "../utils/weatherIcons";
import { formatTemp, formatHour } from "../utils/weatherUtils";

export default function HourlyForecast({ forecast }) {
  const units = useSelector((state) => state.theme.units);

  if (!forecast?.list) return null;

  const hourly = forecast.list.slice(0, 8); // next 24h in 3h steps

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">24-Hour Forecast</h2>
      <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
        {hourly.map((h, i) => (
          <motion.div
            key={h.dt}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex min-w-[84px] flex-shrink-0 flex-col items-center gap-2 rounded-2xl bg-white/40 p-4 transition-colors hover:bg-white/70"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              {i === 0 ? "Now" : formatHour(h.dt)}
            </p>
            <span className="text-2xl">{getWeatherEmoji(h.weather[0].icon)}</span>
            <p className="font-bold text-ink">{formatTemp(h.main.temp, units)}</p>
            {h.pop > 0 && <p className="text-xs font-medium text-sky-600">{Math.round(h.pop * 100)}%</p>}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
