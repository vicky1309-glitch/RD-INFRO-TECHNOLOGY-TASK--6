# Weatherly 🌿

A premium, full-stack weather dashboard: React + Redux Toolkit on the frontend, Node/Express/MySQL (via Sequelize) on the backend, with real-time data from the OpenWeather API.

## Features implemented

1. **Authentication** — register/login/JWT, protected `/profile` route, save favorite cities, personal preferences
2. **Current weather dashboard** — temperature, feels-like, humidity, wind, pressure, visibility, cloudiness, sunrise/sunset
3. **Weather search** — autocomplete (OpenWeather Geocoding), recent searches, one-click loading
4. **24-hour forecast** — hourly timeline from the 5-day/3-hour forecast endpoint
5. **7-day forecast** — daily min/max, condition, rain probability, wind, humidity
6. **Advanced analytics** — Recharts graphs for temperature, humidity, wind, rain probability, pressure
7. **Air quality dashboard** — AQI level + PM2.5, PM10, CO, NO2, O3, SO2
8. **UV Index** — score, risk level, safety advice (via OpenWeather One Call 3.0)
9. **Weather map** — Leaflet map with temperature/rain/wind/cloud tile layers
10. **Weather alerts** — government severe-weather alerts (One Call 3.0), rendered as banners
11. **City comparison** — side-by-side temperature, humidity, wind, AQI, rain probability
12. **Favorites** — add/remove/pin a default city
13. **Recommendation system** — clothing + activity suggestions based on live conditions
14. **Travel planner** — pick a destination + date, see the trend and packing suggestions
15. **Theme system** — Default, Dark, Ocean, Sunset — persisted to localStorage
16. **Voice features** — voice search ("weather in London") and simple voice Q&A, via the Web Speech API
17. **Notifications** — in-app toasts for rain-soon / high UV / severe alerts
18. **Offline support** — service worker caches the app shell + recent API responses

## Project structure

```
weatherly/
├── server/                 # Node/Express/MySQL (Sequelize) API
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── client/                 # React + Redux Toolkit app
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── redux/
        ├── services/
        ├── hooks/
        └── utils/
```

## Getting started

### Prerequisites
- Node.js 18+
- MySQL 8+ (local install, Docker, or a hosted instance like PlanetScale/RDS)
- A free OpenWeather API key: https://openweathermap.org/api
  - Current weather, forecast, air pollution and geocoding all work on the free tier
  - **UV Index and weather alerts** use the "One Call API 3.0" endpoint, which requires subscribing (OpenWeather gives 1,000 free calls/day) — without it, those two widgets degrade gracefully and simply show "unavailable"

### 1. Create the MySQL database

```sql
CREATE DATABASE weatherly CHARACTER SET utf8mb4;
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env: set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, OPENWEATHER_API_KEY
npm run dev
```

On startup, Sequelize connects to MySQL and auto-creates/updates the `users` and `favorites` tables (`sequelize.sync({ alter: true })` in development). For production, swap this for proper `sequelize-cli` migrations instead of alter-sync.

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
# .env: REACT_APP_API_BASE_URL=http://localhost:5000/api
# for the map layers, also add: REACT_APP_OPENWEATHER_MAP_KEY=your_key_here
npm start
```

The app runs on `http://localhost:3000`.

### 4. Build for production

```bash
cd client
npm run build
```

Deploy the `build/` folder to any static host (Vercel, Netlify, S3) and deploy `server/` to any Node host (Render, Railway, Fly.io, EC2). Remember to set `CLIENT_URL` in the server's `.env` to your deployed frontend origin (for CORS).

## Notes on scope & assumptions

- **PWA icons**: `manifest.json` references `icon-192.png` / `icon-512.png` — add real icon files to `client/public/` before shipping.
- **Fonts**: the design references "Clash Display" for headings; it falls back to Plus Jakarta Sans (loaded from Google Fonts) since Clash Display is a licensed font you'd need to add yourself.
- **Voice features** rely on the browser's Web Speech API (`SpeechRecognition`), which has strong support in Chrome/Edge but limited support in Firefox/Safari — the mic button hides itself automatically when unsupported.
- **This code has not been run/built in this environment** (no network access here to `npm install`), so please run `npm install` and smoke-test both apps locally before deploying. I've double-checked imports, exports and API contracts for consistency, but a first local run is worth doing.
- Push notifications (as opposed to in-app toasts) would require a backend push service (e.g. web-push + VAPID keys) — out of scope here but the `notificationSlice` and service worker are structured so it can be added later.

## API reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Login |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/users/profile` | ✓ | Get profile |
| PUT | `/api/users/profile` | ✓ | Update profile/preferences |
| GET | `/api/favorites` | ✓ | List favorite cities |
| POST | `/api/favorites` | ✓ | Add favorite |
| DELETE | `/api/favorites/:id` | ✓ | Remove favorite |
| PUT | `/api/favorites/:id/pin` | ✓ | Pin as default |
| GET | `/api/weather/search?q=` | – | City autocomplete |
| GET | `/api/weather/current/:city` | – | Current weather |
| GET | `/api/weather/coords?lat=&lon=` | – | Current weather by coordinates |
| GET | `/api/weather/forecast/:city` | – | 5-day/3-hour forecast |
| GET | `/api/weather/air-quality/:city` | – | Air quality |
| GET | `/api/weather/onecall?lat=&lon=` | – | UV index + alerts |
