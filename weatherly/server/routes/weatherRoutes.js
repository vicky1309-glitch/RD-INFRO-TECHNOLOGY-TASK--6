const express = require("express");
const router = express.Router();
const {
  searchCities,
  getCurrentWeather,
  getForecast,
  getAirQuality,
  getWeatherByCoords,
  getOneCall,
} = require("../controllers/weatherController");

// Public weather data endpoints (proxy OpenWeather so the API key never
// reaches the browser)
router.get("/search", searchCities);
router.get("/coords", getWeatherByCoords);
router.get("/onecall", getOneCall);
router.get("/current/:city", getCurrentWeather);
router.get("/forecast/:city", getForecast);
router.get("/air-quality/:city", getAirQuality);

module.exports = router;
