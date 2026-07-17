import { format, fromUnixTime } from "date-fns";

export const formatTemp = (temp, unit = "metric") =>
  temp === null || temp === undefined ? "--" : `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;

export const formatTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  if (!unixSeconds) return "--";
  const utcMs = unixSeconds * 1000 + timezoneOffsetSeconds * 1000;
  return format(new Date(utcMs), "h:mm a");
};

export const formatHour = (unixSeconds) => format(fromUnixTime(unixSeconds), "h a");

export const formatDay = (unixSeconds) => format(fromUnixTime(unixSeconds), "EEE");

export const formatFullDate = (unixSeconds) => format(fromUnixTime(unixSeconds), "EEEE, MMM d");

// Groups the OpenWeather 5-day/3-hour forecast list into per-day buckets,
// used to derive both the 24-hour timeline and the 7-day summary.
export const groupForecastByDay = (list = []) => {
  const days = {};
  list.forEach((entry) => {
    const dayKey = format(fromUnixTime(entry.dt), "yyyy-MM-dd");
    if (!days[dayKey]) days[dayKey] = [];
    days[dayKey].push(entry);
  });
  return Object.entries(days).map(([date, entries]) => ({ date, entries }));
};

export const buildDailySummary = (list = []) => {
  const grouped = groupForecastByDay(list);
  return grouped.slice(0, 7).map(({ date, entries }) => {
    const temps = entries.map((e) => e.main.temp);
    const rainChances = entries.map((e) => e.pop ?? 0);
    // Prefer the midday entry for the representative icon/condition
    const midday =
      entries.find((e) => format(fromUnixTime(e.dt), "HH") === "12") || entries[Math.floor(entries.length / 2)];

    return {
      date,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      icon: midday.weather[0].icon,
      condition: midday.weather[0].main,
      rainChance: Math.round(Math.max(...rainChances) * 100),
      humidity: midday.main.humidity,
      wind: midday.wind.speed,
      dt: midday.dt,
    };
  });
};

export const getAqiLabel = (aqi) => {
  const labels = {
    1: { label: "Good", color: "#59C749" },
    2: { label: "Fair", color: "#A8E6A1" },
    3: { label: "Moderate", color: "#F2C94C" },
    4: { label: "Poor", color: "#F2994A" },
    5: { label: "Very Poor", color: "#EB5757" },
  };
  return labels[aqi] || { label: "Unknown", color: "#9CA3AF" };
};

export const getUvRisk = (uvi) => {
  if (uvi === undefined || uvi === null) return { label: "Unknown", color: "#9CA3AF", advice: "" };
  if (uvi < 3) return { label: "Low", color: "#59C749", advice: "No protection needed for most people." };
  if (uvi < 6) return { label: "Moderate", color: "#A8E6A1", advice: "Wear sunglasses and use sunscreen." };
  if (uvi < 8) return { label: "High", color: "#F2C94C", advice: "Use SPF 30+ sunscreen, seek shade midday." };
  if (uvi < 11) return { label: "Very High", color: "#F2994A", advice: "Minimize sun exposure 10am-4pm." };
  return { label: "Extreme", color: "#EB5757", advice: "Avoid sun exposure; stay indoors if possible." };
};

// Recommendation engine: clothing + activities based on temperature and condition
export const getClothingRecommendation = (temp, condition = "") => {
  const cond = condition.toLowerCase();
  const isWet = cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunderstorm");

  let base;
  if (temp >= 30) {
    base = { items: ["T-shirt", "Shorts", "Cap", "Sunglasses"], note: "Stay hydrated in the heat." };
  } else if (temp >= 22) {
    base = { items: ["Light shirt", "Cotton trousers", "Sneakers"], note: "Comfortable warm-weather layers." };
  } else if (temp >= 15) {
    base = { items: ["Light jacket", "Long sleeves", "Jeans"], note: "A light layer will keep you comfortable." };
  } else if (temp >= 5) {
    base = { items: ["Warm coat", "Sweater", "Scarf"], note: "Layer up, it's chilly out." };
  } else {
    base = { items: ["Heavy coat", "Thermal wear", "Gloves", "Beanie"], note: "Bundle up, freezing conditions." };
  }

  if (isWet) {
    return { items: [...base.items, "Umbrella", "Waterproof jacket"], note: `${base.note} Rain expected — pack waterproofs.` };
  }
  return base;
};

export const getActivityRecommendation = (condition = "", temp = 20) => {
  const cond = condition.toLowerCase();
  if (cond.includes("rain") || cond.includes("thunderstorm") || cond.includes("drizzle")) {
    return { activities: ["Museum visit", "Reading indoors", "Home workout"], note: "Best to stay indoors today." };
  }
  if (cond.includes("snow")) {
    return { activities: ["Sledding", "Hot cocoa by the fire", "Snow photography"], note: "Dress warm if heading out." };
  }
  if (cond.includes("clear") && temp >= 20) {
    return { activities: ["Cycling", "Walking", "Picnic", "Outdoor sports"], note: "Great day to be outside." };
  }
  if (cond.includes("cloud")) {
    return { activities: ["Hiking", "Sightseeing", "Photography"], note: "Mild and comfortable for exploring." };
  }
  return { activities: ["Light outdoor walk", "Local sightseeing"], note: "Check conditions before heading out." };
};

export const kmhToMph = (kmh) => kmh * 0.621371;

export const degToCompass = (deg) => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

export const metersToKm = (m) => (m / 1000).toFixed(1);
