import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, differenceInCalendarDays, fromUnixTime } from "date-fns";
import GlassCard from "../components/GlassCard";
import EmptyState from "../components/EmptyState";
import weatherApi from "../services/weatherApi";
import { getWeatherEmoji } from "../utils/weatherIcons";
import { getClothingRecommendation, buildDailySummary, formatFullDate } from "../utils/weatherUtils";

export default function Planner() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const daysAhead = date ? differenceInCalendarDays(new Date(date), new Date()) : null;
  const withinForecastRange = daysAhead !== null && daysAhead >= 0 && daysAhead <= 5;

  const handlePlan = async (e) => {
    e.preventDefault();
    if (!destination) return;
    setLoading(true);
    setError("");
    setForecast(null);
    try {
      const { data } = await weatherApi.getForecast(destination);
      setForecast(data.forecast);
    } catch (err) {
      setError(err.response?.data?.message || `Could not find forecast for "${destination}"`);
    } finally {
      setLoading(false);
    }
  };

  const daily = forecast ? buildDailySummary(forecast.list) : [];
  const targetDay =
    date && daily.length
      ? daily.find((d) => format(fromUnixTime(d.dt), "yyyy-MM-dd") === date) || null
      : null;

  const chartData = daily.map((d) => ({
    day: format(fromUnixTime(d.dt), "EEE"),
    max: Math.round(d.maxTemp),
    min: Math.round(d.minTemp),
  }));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-16 pt-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Travel Weather Planner</h1>
        <p className="text-sm text-ink/60">Plan ahead with forecasts, temperature trends and packing tips.</p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handlePlan} className="flex flex-col gap-4 sm:flex-row">
          <input
            className="input-field"
            placeholder="Destination city"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            className="input-field sm:max-w-[200px]"
            value={date}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? "Loading..." : "Plan Trip"}
          </button>
        </form>
        {date && !withinForecastRange && (
          <p className="mt-3 text-xs text-ink/50">
            Detailed forecasts are available up to 5 days out. We'll show the general trend for {destination || "your destination"} instead.
          </p>
        )}
      </GlassCard>

      {error && <EmptyState icon="🧳" title="Couldn't plan trip" message={error} />}

      {!forecast && !error && (
        <EmptyState icon="✈️" title="Where are you headed?" message="Enter a destination and travel date to see the forecast and packing suggestions." />
      )}

      {forecast && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-6" solid>
              <h2 className="mb-4 font-display text-lg font-bold text-ink">
                {forecast.city.name}, {forecast.city.country}
              </h2>

              {targetDay ? (
                <div className="flex items-center gap-4 rounded-2xl bg-white/40 p-4">
                  <span className="text-4xl">{getWeatherEmoji(targetDay.icon)}</span>
                  <div>
                    <p className="text-sm text-ink/60">{formatFullDate(targetDay.dt)}</p>
                    <p className="font-display text-xl font-bold text-ink">
                      {Math.round(targetDay.maxTemp)}° / {Math.round(targetDay.minTemp)}°
                    </p>
                    <p className="text-sm capitalize text-ink/60">
                      {targetDay.condition} · {targetDay.rainChance}% rain chance
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-ink/50">
                  Showing the 5-day outlook for {forecast.city.name} — pick a date within this range for a specific-day summary.
                </p>
              )}

              <ResponsiveContainer width="100%" height={220} className="mt-6">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,45,32,0.08)" />
                  <XAxis dataKey="day" fontSize={12} stroke="#1F2D20AA" />
                  <YAxis fontSize={12} stroke="#1F2D20AA" />
                  <Tooltip contentStyle={{ borderRadius: 16, border: "none", background: "#FFF7F2" }} />
                  <Line type="monotone" dataKey="max" stroke="#59C749" strokeWidth={3} dot={{ r: 3 }} name="High" />
                  <Line type="monotone" dataKey="min" stroke="#237A20" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <GlassCard className="p-6">
              <h2 className="mb-4 font-display text-lg font-bold text-ink">Packing Suggestions</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {daily.slice(0, targetDay ? undefined : 3).map((d, i) => {
                  const packing = getClothingRecommendation(d.maxTemp, d.condition);
                  return (
                    <div key={d.date} className="rounded-2xl bg-white/40 p-4">
                      <p className="mb-1 text-sm font-bold text-ink">
                        {i === 0 ? "Today" : format(fromUnixTime(d.dt), "EEE, MMM d")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {packing.items.map((item) => (
                          <span key={item} className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-ink">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </div>
  );
}
