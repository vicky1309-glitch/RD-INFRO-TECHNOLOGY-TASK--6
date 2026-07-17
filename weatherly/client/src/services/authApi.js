import api from "./api";

const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
  updateProfile: (payload) => api.put("/users/profile", payload),
};

export default authApi;
