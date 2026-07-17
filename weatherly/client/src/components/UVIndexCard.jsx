import GlassCard from "./GlassCard";
import { getUvRisk } from "../utils/weatherUtils";

export default function UVIndexCard({ oneCall }) {
  const uvi = oneCall?.current?.uvi;
  const { label, color, advice } = getUvRisk(uvi);

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">UV Index</h2>
      {uvi === undefined ? (
        <p className="text-sm text-ink/50">
          UV data requires a One Call API 3.0 subscription on your OpenWeather account.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-2xl font-extrabold text-white"
              style={{ backgroundColor: color }}
            >
              {Math.round(uvi)}
            </div>
            <div>
              <p className="font-display text-xl font-bold" style={{ color }}>
                {label}
              </p>
              <p className="text-sm text-ink/60">{advice}</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/50">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min((uvi / 11) * 100, 100)}%`, backgroundColor: color }}
            />
          </div>
        </>
      )}
    </GlassCard>
  );
}
