import { createSlice } from "@reduxjs/toolkit";

let idCounter = 0;

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    alerts: [], // weather warnings (storm, flood, heatwave, heavy rain) from the API
    toasts: [], // transient in-app notifications (rain soon, high UV, etc.)
    enabled: JSON.parse(localStorage.getItem("weatherly_notifications_enabled") || "true"),
  },
  reducers: {
    setAlerts(state, action) {
      state.alerts = action.payload || [];
    },
    pushToast: {
      reducer(state, action) {
        if (state.enabled) state.toasts.push(action.payload);
      },
      prepare(payload) {
        idCounter += 1;
        return { payload: { id: idCounter, createdAt: Date.now(), ...payload } };
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
    setNotificationsEnabled(state, action) {
      state.enabled = action.payload;
      localStorage.setItem("weatherly_notifications_enabled", JSON.stringify(action.payload));
    },
  },
});

export const { setAlerts, pushToast, dismissToast, clearToasts, setNotificationsEnabled } =
  notificationSlice.actions;
export default notificationSlice.reducer;
