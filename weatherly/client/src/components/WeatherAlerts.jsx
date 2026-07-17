import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";

const SEVERITY_STYLES = {
  Extreme: { bg: "bg-red-500/90", icon: "🚨" },
  Severe: { bg: "bg-orange-500/90", icon: "⚠️" },
  Moderate: { bg: "bg-amber-400/90", icon: "⚠️" },
  Minor: { bg: "bg-yellow-300/90", icon: "ℹ️" },
};

export default function WeatherAlerts({ alerts = [] }) {
  if (!alerts.length) return null;

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">Weather Alerts</h2>
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {alerts.map((alert, i) => {
            const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.Moderate;
            return (
              <motion.div
                key={`${alert.event}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-2xl ${style.bg} p-4 text-white shadow-float`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span>{style.icon}</span>
                  {alert.event}
                </div>
                <p className="mt-1 text-sm opacity-90">{alert.description || alert.sender_name}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
