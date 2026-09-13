import { apiRequest } from "./apiClient";

export const authApi = {
  login: (data) =>
    apiRequest("/Auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data) =>
    apiRequest("/Auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data) =>
    apiRequest("/Auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (data) =>
    apiRequest("/Auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};