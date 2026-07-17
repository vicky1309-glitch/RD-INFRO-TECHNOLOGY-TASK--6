import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { getWeatherEmoji } from "../utils/weatherIcons";
import { formatTemp, formatDay, buildDailySummary } from "../utils/weatherUtils";

export default function ForecastCard({ forecast }) {
  const units = useSelector((state) => state.theme.units);

  if (!forecast?.list) return null;

  const daily = buildDailySummary(forecast.list);

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">7-Day Forecast</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {daily.map((d, i) => (
          <motion.div
            key={d.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/40 p-4 text-center transition-colors hover:bg-white/70"
          >
            <p className="text-sm font-bold text-ink">{i === 0 ? "Today" : formatDay(d.dt)}</p>
            <span className="text-3xl">{getWeatherEmoji(d.icon)}</span>
            <p className="text-xs capitalize text-ink/60">{d.condition}</p>
            <div className="flex gap-2 text-sm">
              <span className="font-bold text-dark-green">{formatTemp(d.maxTemp, units)}</span>
              <span className="text-ink/40">{formatTemp(d.minTemp, units)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-sky-600">
              <span>💧</span>
              {d.rainChance}%
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
