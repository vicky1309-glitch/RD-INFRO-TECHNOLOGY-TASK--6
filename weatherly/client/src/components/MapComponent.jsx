import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import GlassCard from "./GlassCard";

const LAYERS = [
  { id: "temp_new", label: "Temperature" },
  { id: "precipitation_new", label: "Rain" },
  { id: "wind_new", label: "Wind" },
  { id: "clouds_new", label: "Clouds" },
];

// NOTE: replace YOUR_OPENWEATHER_API_KEY below (or wire it through an env
// var passed from the app) — OpenWeather map tiles require the key directly
// in the tile URL since browsers request tiles natively.
const OWM_KEY = process.env.REACT_APP_OPENWEATHER_MAP_KEY || "YOUR_OPENWEATHER_API_KEY";

export default function MapComponent({ lat, lon, cityName }) {
  const [layer, setLayer] = useState("temp_new");

  if (!lat || !lon) return null;

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink">Weather Map</h2>
        <div className="flex flex-wrap gap-2">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayer(l.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                layer === l.id ? "bg-mantis text-white" : "bg-white/40 text-ink/60 hover:bg-white/70"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full overflow-hidden rounded-xl2">
        <MapContainer center={[lat, lon]} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`}
            opacity={0.6}
          />
          <Marker position={[lat, lon]}>
            <Popup>{cityName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </GlassCard>
  );
}
