import GlassCard from "./GlassCard";
import { getClothingRecommendation, getActivityRecommendation } from "../utils/weatherUtils";

export default function ClothingRecommendation({ weather }) {
  if (!weather) return null;

  const temp = weather.main.temp;
  const condition = weather.weather[0].main;
  const clothing = getClothingRecommendation(temp, condition);
  const activities = getActivityRecommendation(condition, temp);

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">Today's Recommendations</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/40 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-dark-green">
            👕 What to wear ({Math.round(temp)}°)
          </p>
          <div className="flex flex-wrap gap-2">
            {clothing.items.map((item) => (
              <span key={item} className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/50">{clothing.note}</p>
        </div>

        <div className="rounded-2xl bg-white/40 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-dark-green">
            🏃 Suggested activities
          </p>
          <div className="flex flex-wrap gap-2">
            {activities.activities.map((item) => (
              <span key={item} className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/50">{activities.note}</p>
        </div>
      </div>
    </GlassCard>
  );
}
