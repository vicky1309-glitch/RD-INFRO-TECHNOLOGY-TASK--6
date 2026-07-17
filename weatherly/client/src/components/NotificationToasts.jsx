import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { dismissToast } from "../redux/notificationSlice";

const TYPE_STYLES = {
  info: { bg: "bg-white/90", icon: "ℹ️", text: "text-ink" },
  rain: { bg: "bg-sky-500/90", icon: "🌧️", text: "text-white" },
  uv: { bg: "bg-amber-500/90", icon: "☀️", text: "text-white" },
  extreme: { bg: "bg-red-500/90", icon: "🚨", text: "text-white" },
};

function Toast({ toast }) {
  const dispatch = useDispatch();
  const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), 6000);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60 }}
      className={`glass-card-solid flex items-center gap-3 ${style.bg} ${style.text} px-4 py-3 shadow-glass-lg`}
    >
      <span className="text-lg">{style.icon}</span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={() => dispatch(dismissToast(toast.id))} className="ml-2 opacity-70 hover:opacity-100">
        ×
      </button>
    </motion.div>
  );
}

export default function NotificationToasts() {
  const toasts = useSelector((state) => state.notifications.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-80 max-w-[90vw] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <div className="pointer-events-auto" key={t.id}>
            <Toast toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
