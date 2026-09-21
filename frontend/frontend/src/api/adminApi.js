const API_URL = "http://localhost:5206/api";

async function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem("padelrent_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error en la petición admin");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const adminApi = {
  getPistas: () => adminRequest("/admin/pistas"),

  activarPista: (id) =>
    adminRequest(`/admin/pistas/${id}/activar`, {
      method: "PUT",
    }),

  desactivarPista: (id) =>
    adminRequest(`/admin/pistas/${id}/desactivar`, {
      method: "PUT",
    }),
};