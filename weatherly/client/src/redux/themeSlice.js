import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "weatherly_theme";
const storedTheme = localStorage.getItem(THEME_KEY) || "default";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    current: storedTheme, // 'default' | 'dark' | 'ocean' | 'sunset'
    units: localStorage.getItem("weatherly_units") || "metric", // 'metric' | 'imperial'
  },
  reducers: {
    setTheme(state, action) {
      state.current = action.payload;
      localStorage.setItem(THEME_KEY, action.payload);
    },
    toggleUnits(state) {
      state.units = state.units === "metric" ? "imperial" : "metric";
      localStorage.setItem("weatherly_units", state.units);
    },
  },
});

export const { setTheme, toggleUnits } = themeSlice.actions;
export default themeSlice.reducer;
