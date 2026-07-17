import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import weatherReducer from "./weatherSlice";
import favoriteReducer from "./favoriteSlice";
import themeReducer from "./themeSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoriteReducer,
    theme: themeReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
