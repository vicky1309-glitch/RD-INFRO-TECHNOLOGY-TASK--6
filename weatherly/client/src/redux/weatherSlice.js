import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import weatherApi from "../services/weatherApi";

const RECENT_KEY = "weatherly_recent_searches";
const loadRecent = () => JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrent",
  async (city, { rejectWithValue }) => {
    try {
      const { data } = await weatherApi.getCurrentWeather(city);
      return data.weather;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch weather");
    }
  }
);

export const fetchWeatherByCoords = createAsyncThunk(
  "weather/fetchByCoords",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const { data } = await weatherApi.getWeatherByCoords(lat, lon);
      return data.weather;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch weather");
    }
  }
);

export const fetchForecast = createAsyncThunk(
  "weather/fetchForecast",
  async (city, { rejectWithValue }) => {
    try {
      const { data } = await weatherApi.getForecast(city);
      return data.forecast;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch forecast");
    }
  }
);

export const fetchAirQuality = createAsyncThunk(
  "weather/fetchAirQuality",
  async (city, { rejectWithValue }) => {
    try {
      const { data } = await weatherApi.getAirQuality(city);
      return data.airQuality;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch air quality");
    }
  }
);

export const fetchOneCall = createAsyncThunk(
  "weather/fetchOneCall",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const { data } = await weatherApi.getOneCall(lat, lon);
      return data.oneCall;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "UV index / alerts unavailable");
    }
  }
);

export const searchCitySuggestions = createAsyncThunk(
  "weather/searchCities",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await weatherApi.searchCities(query);
      return data.results;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    current: null,
    forecast: null,
    airQuality: null,
    oneCall: null,
    suggestions: [],
    recentSearches: loadRecent(),
    loading: false,
    forecastLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    addRecentSearch(state, action) {
      const city = action.payload;
      const filtered = state.recentSearches.filter(
        (c) => c.toLowerCase() !== city.toLowerCase()
      );
      state.recentSearches = [city, ...filtered].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(state.recentSearches));
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
      localStorage.removeItem(RECENT_KEY);
    },
    clearSuggestions(state) {
      state.suggestions = [];
    },
    clearWeatherError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchForecast.pending, (state) => {
        state.forecastLoading = true;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecastLoading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.forecastLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAirQuality.fulfilled, (state, action) => {
        state.airQuality = action.payload;
      })
      .addCase(fetchOneCall.fulfilled, (state, action) => {
        state.oneCall = action.payload;
      })
      .addCase(fetchOneCall.rejected, (state) => {
        state.oneCall = null;
      })
      .addCase(searchCitySuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { addRecentSearch, clearRecentSearches, clearSuggestions, clearWeatherError } =
  weatherSlice.actions;
export default weatherSlice.reducer;
