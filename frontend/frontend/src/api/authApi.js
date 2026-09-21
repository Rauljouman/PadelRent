const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error en la petición");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const authApi = {
  login: (email, password) =>
    apiRequest("/Auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
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