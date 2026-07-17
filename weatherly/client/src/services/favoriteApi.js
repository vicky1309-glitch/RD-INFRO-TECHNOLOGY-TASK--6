import api from "./api";

const favoriteApi = {
  getFavorites: () => api.get("/favorites"),
  addFavorite: (payload) => api.post("/favorites", payload),
  removeFavorite: (id) => api.delete(`/favorites/${id}`),
  pinFavorite: (id) => api.put(`/favorites/${id}/pin`),
};

export default favoriteApi;
