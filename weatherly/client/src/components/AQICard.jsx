import GlassCard from "./GlassCard";
import { getAqiLabel } from "../utils/weatherUtils";

const POLLUTANTS = [
  { key: "pm2_5", label: "PM2.5", unit: "μg/m³" },
  { key: "pm10", label: "PM10", unit: "μg/m³" },
  { key: "co", label: "CO", unit: "μg/m³" },
  { key: "no2", label: "NO2", unit: "μg/m³" },
  { key: "o3", label: "O3", unit: "μg/m³" },
  { key: "so2", label: "SO2", unit: "μg/m³" },
];

export default function AQICard({ airQuality }) {
  if (!airQuality?.list?.length) return null;

  const point = airQuality.list[0];
  const aqi = point.main.aqi;
  const { label, color } = getAqiLabel(aqi);

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">Air Quality</h2>
      <div className="mb-5 flex items-center gap-4">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
          style={{ backgroundColor: color }}
        >
          {aqi}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">AQI Level</p>
          <p className="font-display text-xl font-bold" style={{ color }}>
            {label}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="rounded-2xl bg-white/40 p-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{p.label}</p>
            <p className="mt-1 font-bold text-ink">{point.components[p.key]?.toFixed(1) ?? "--"}</p>
            <p className="text-[10px] text-ink/40">{p.unit}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
