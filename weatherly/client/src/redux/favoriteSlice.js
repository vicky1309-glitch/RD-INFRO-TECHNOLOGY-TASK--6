import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import favoriteApi from "../services/favoriteApi";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await favoriteApi.getFavorites();
      return data.favorites;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load favorites");
    }
  }
);

export const addFavoriteCity = createAsyncThunk(
  "favorites/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await favoriteApi.addFavorite(payload);
      return data.favorite;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add favorite");
    }
  }
);

export const removeFavoriteCity = createAsyncThunk(
  "favorites/remove",
  async (id, { rejectWithValue }) => {
    try {
      await favoriteApi.removeFavorite(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove favorite");
    }
  }
);

export const pinFavoriteCity = createAsyncThunk(
  "favorites/pin",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await favoriteApi.pinFavorite(id);
      return data.favorite;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to pin favorite");
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavoriteCity.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFavoriteCity.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      })
      .addCase(pinFavoriteCity.fulfilled, (state, action) => {
        state.items = state.items.map((f) => ({
          ...f,
          isPinned: f.id === action.payload.id,
        }));
      });
  },
});

export default favoriteSlice.reducer;
