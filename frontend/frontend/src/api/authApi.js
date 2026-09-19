import { apiRequest } from "./apiClient";

export const authApi = {
  login: (emailOrData, password) => {
    const body =
      typeof emailOrData === "object"
        ? emailOrData
        : {
            email: emailOrData,
            password,
          };

    return apiRequest("/Auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  register: (data) => {
    return apiRequest("/Auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forgotPassword: (emailOrData) => {
    const email =
      typeof emailOrData === "object" ? emailOrData.email : emailOrData;

    return apiRequest("/Auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
  },

  resetPassword: (data) => {
    return apiRequest("/Auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};