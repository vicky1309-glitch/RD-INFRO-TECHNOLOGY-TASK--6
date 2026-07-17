import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import GlassCard from "./GlassCard";
import { formatHour } from "../utils/weatherUtils";

const METRICS = [
  { id: "temp", label: "Temperature", color: "#59C749", unit: "°" },
  { id: "humidity", label: "Humidity", color: "#237A20", unit: "%" },
  { id: "wind", label: "Wind Speed", color: "#A8E6A1", unit: "" },
  { id: "rain", label: "Rain Probability", color: "#3B82F6", unit: "%" },
  { id: "pressure", label: "Pressure", color: "#F2994A", unit: "hPa" },
];

export default function WeatherChart({ forecast }) {
  const [metric, setMetric] = useState("temp");

  if (!forecast?.list) return null;

  const data = forecast.list.slice(0, 12).map((entry) => ({
    time: formatHour(entry.dt),
    temp: Math.round(entry.main.temp),
    humidity: entry.main.humidity,
    wind: Math.round(entry.wind.speed),
    rain: Math.round((entry.pop ?? 0) * 100),
    pressure: entry.main.pressure,
  }));

  const active = METRICS.find((m) => m.id === metric);

  const renderChart = () => {
    if (metric === "wind") {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,45,32,0.08)" />
          <XAxis dataKey="time" fontSize={12} stroke="#1F2D20AA" />
          <YAxis fontSize={12} stroke="#1F2D20AA" />
          <Tooltip contentStyle={{ borderRadius: 16, border: "none", background: "#FFF7F2" }} />
          <Bar dataKey="wind" fill={active.color} radius={[8, 8, 0, 0]} />
        </BarChart>
      );
    }
    if (metric === "rain") {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={active.color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={active.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,45,32,0.08)" />
          <XAxis dataKey="time" fontSize={12} stroke="#1F2D20AA" />
          <YAxis fontSize={12} stroke="#1F2D20AA" />
          <Tooltip contentStyle={{ borderRadius: 16, border: "none", background: "#FFF7F2" }} />
          <Area type="monotone" dataKey="rain" stroke={active.color} fill="url(#rainFill)" strokeWidth={2} />
        </AreaChart>
      );
    }
    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,45,32,0.08)" />
        <XAxis dataKey="time" fontSize={12} stroke="#1F2D20AA" />
        <YAxis fontSize={12} stroke="#1F2D20AA" />
        <Tooltip contentStyle={{ borderRadius: 16, border: "none", background: "#FFF7F2" }} />
        <Line type="monotone" dataKey={metric} stroke={active.color} strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
    );
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink">Weather Analytics</h2>
        <div className="flex flex-wrap gap-2">
          {METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                metric === m.id ? "bg-mantis text-white" : "bg-white/40 text-ink/60 hover:bg-white/70"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        {renderChart()}
      </ResponsiveContainer>
    </GlassCard>
  );
}
