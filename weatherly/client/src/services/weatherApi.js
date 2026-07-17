import api from "./api";

const weatherApi = {
  getCurrentWeather: (city, units = "metric") =>
    api.get(`/weather/current/${encodeURIComponent(city)}`, { params: { units } }),

  getWeatherByCoords: (lat, lon, units = "metric") =>
    api.get("/weather/coords", { params: { lat, lon, units } }),

  getForecast: (city, units = "metric") =>
    api.get(`/weather/forecast/${encodeURIComponent(city)}`, { params: { units } }),

  getAirQuality: (city) => api.get(`/weather/air-quality/${encodeURIComponent(city)}`),

  getOneCall: (lat, lon, units = "metric") =>
    api.get("/weather/onecall", { params: { lat, lon, units } }),

  searchCities: (query) => api.get("/weather/search", { params: { q: query } }),
};

export default weatherApi;
