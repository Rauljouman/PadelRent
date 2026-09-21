const API_URL = import.meta.env.VITE_API_URL;

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

  promoverAdmin: (email) =>
    adminRequest("/admin/usuarios/promover-admin", {
      method: "PUT",
      body: JSON.stringify({ email }),
    }),

  quitarAdmin: (email) =>
    adminRequest("/admin/usuarios/quitar-admin", {
      method: "PUT",
      body: JSON.stringify({ email }),
    }),
};