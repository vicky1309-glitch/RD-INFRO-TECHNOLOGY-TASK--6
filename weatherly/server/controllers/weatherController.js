const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const API_KEY = process.env.OPENWEATHER_API_KEY;

const owClient = axios.create({ timeout: 10000 });

const handleAxiosError = (res, error, fallbackMessage) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || fallbackMessage;
  res.status(status).json({ message });
};

// @desc    Get city suggestions (geocoding, for search autocomplete)
// @route   GET /api/weather/search?q=chen
const searchCities = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Query parameter q is required" });

  try {
    const { data } = await owClient.get(`${GEO_URL}/direct`, {
      params: { q, limit: 6, appid: API_KEY },
    });

    const results = data.map((item) => ({
      name: item.name,
      state: item.state || "",
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));

    res.json({ results });
  } catch (error) {
    handleAxiosError(res, error, "Failed to search cities");
  }
};

// @desc    Get current weather for a city
// @route   GET /api/weather/current/:city
const getCurrentWeather = async (req, res) => {
  const { city } = req.params;
  const units = req.query.units || "metric";

  try {
    const { data } = await owClient.get(`${BASE_URL}/weather`, {
      params: { q: city, units, appid: API_KEY },
    });
    res.json({ weather: data });
  } catch (error) {
    handleAxiosError(res, error, "Failed to fetch current weather");
  }
};

// @desc    Get 5 day / 3 hour forecast (used to build hourly + daily views)
// @route   GET /api/weather/forecast/:city
const getForecast = async (req, res) => {
  const { city } = req.params;
  const units = req.query.units || "metric";

  try {
    const { data } = await owClient.get(`${BASE_URL}/forecast`, {
      params: { q: city, units, appid: API_KEY },
    });
    res.json({ forecast: data });
  } catch (error) {
    handleAxiosError(res, error, "Failed to fetch forecast");
  }
};

// @desc    Get air quality for a city (by lat/lon)
// @route   GET /api/weather/air-quality/:city
const getAirQuality = async (req, res) => {
  const { city } = req.params;

  try {
    const geo = await owClient.get(`${GEO_URL}/direct`, {
      params: { q: city, limit: 1, appid: API_KEY },
    });

    if (!geo.data.length) {
      return res.status(404).json({ message: "City not found" });
    }

    const { lat, lon } = geo.data[0];

    const { data } = await owClient.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: API_KEY },
    });

    res.json({ airQuality: data });
  } catch (error) {
    handleAxiosError(res, error, "Failed to fetch air quality");
  }
};

// @desc    Get weather by coordinates (used for geolocation "current location")
// @route   GET /api/weather/coords?lat=&lon=
const getWeatherByCoords = async (req, res) => {
  const { lat, lon } = req.query;
  const units = req.query.units || "metric";

  if (!lat || !lon) {
    return res.status(400).json({ message: "lat and lon are required" });
  }

  try {
    const { data } = await owClient.get(`${BASE_URL}/weather`, {
      params: { lat, lon, units, appid: API_KEY },
    });
    res.json({ weather: data });
  } catch (error) {
    handleAxiosError(res, error, "Failed to fetch weather for coordinates");
  }
};

// @desc    Get UV index + government weather alerts via One Call API
// @route   GET /api/weather/onecall?lat=&lon=
// NOTE: requires a "One Call API 3.0" subscription on your OpenWeather account
// (OpenWeather offers 1,000 free calls/day on this endpoint).
const getOneCall = async (req, res) => {
  const { lat, lon } = req.query;
  const units = req.query.units || "metric";

  if (!lat || !lon) {
    return res.status(400).json({ message: "lat and lon are required" });
  }

  try {
    const { data } = await owClient.get("https://api.openweathermap.org/data/3.0/onecall", {
      params: {
        lat,
        lon,
        units,
        exclude: "minutely",
        appid: API_KEY,
      },
    });
    res.json({ oneCall: data });
  } catch (error) {
    handleAxiosError(res, error, "Failed to fetch UV index / alerts data");
  }
};

module.exports = {
  searchCities,
  getCurrentWeather,
  getForecast,
  getAirQuality,
  getWeatherByCoords,
  getOneCall,
};

