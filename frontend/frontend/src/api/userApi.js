import { apiRequest } from "./apiClient";

export const userApi = {
  getMe: () => apiRequest("/Usuarios/me"),

  updateMe: (data) =>
    apiRequest("/Usuarios/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};