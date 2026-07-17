// Maps OpenWeather icon/condition codes to emoji glyphs used throughout the UI.
// (Kept dependency-free and crisp at any size, in place of an icon font.)
const ICON_MAP = {
  "01d": "☀️",
  "01n": "🌕",
  "02d": "🌤️",
  "02n": "🌥️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

export const getWeatherEmoji = (iconCode) => ICON_MAP[iconCode] || "🌡️";

export const getConditionGradient = (main = "") => {
  const key = main.toLowerCase();
  if (key.includes("clear")) return "from-amber-200 via-orange-100 to-milky";
  if (key.includes("cloud")) return "from-slate-200 via-slate-100 to-cream";
  if (key.includes("rain") || key.includes("drizzle")) return "from-sky-300 via-sky-100 to-cream";
  if (key.includes("thunderstorm")) return "from-indigo-300 via-slate-200 to-cream";
  if (key.includes("snow")) return "from-sky-100 via-white to-cream";
  return "from-soft-green via-cream to-milky";
};

export default ICON_MAP;
