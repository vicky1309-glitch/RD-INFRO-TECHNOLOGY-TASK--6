import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { updateProfile } from "../redux/authSlice";
import { toggleUnits } from "../redux/themeSlice";
import { setNotificationsEnabled } from "../redux/notificationSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const units = useSelector((state) => state.theme.units);
  const notificationsEnabled = useSelector((state) => state.notifications.enabled);
  const [form, setForm] = useState({ name: user?.name || "", defaultCity: user?.defaultCity || "" });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-16 pt-6">
      <h1 className="font-display text-2xl font-extrabold text-ink">Your Profile</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Account details</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/60">Full name</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/60">Email</label>
              <input className="input-field opacity-60" value={user?.email || ""} disabled />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/60">Default city</label>
              <input
                className="input-field"
                value={form.defaultCity}
                onChange={(e) => setForm({ ...form, defaultCity: e.target.value })}
                placeholder="e.g. Chennai"
              />
            </div>
            <button type="submit" className="btn-primary w-fit">
              Save changes
            </button>
            {saved && <p className="text-sm font-medium text-dark-green">Profile updated ✓</p>}
          </form>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard className="p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Preferences</h2>

          <div className="flex items-center justify-between border-b border-white/40 py-3">
            <div>
              <p className="font-medium text-ink">Temperature units</p>
              <p className="text-sm text-ink/50">Celsius or Fahrenheit</p>
            </div>
            <button onClick={() => dispatch(toggleUnits())} className="btn-secondary !px-4 !py-2 text-sm">
              {units === "metric" ? "°C" : "°F"}
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-white/40 py-3">
            <div>
              <p className="font-medium text-ink">Theme</p>
              <p className="text-sm text-ink/50">Choose your dashboard style</p>
            </div>
            <ThemeSwitcher />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-ink">Notifications</p>
              <p className="text-sm text-ink/50">Rain, UV and severe weather alerts</p>
            </div>
            <button
              onClick={() => dispatch(setNotificationsEnabled(!notificationsEnabled))}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                notificationsEnabled ? "bg-mantis" : "bg-ink/20"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
