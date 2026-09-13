const API_URL = "http://localhost:5206/api";

export async function apiRequest(endpoint, options = {}) {
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
    const contentType = response.headers.get("content-type");

    let message = "Error en la petición";

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();

      message =
        errorData.mensaje ||
        errorData.message ||
        errorData.title ||
        JSON.stringify(errorData);
    } else {
      message = await response.text();
    }

    throw new Error(message || "Error en la petición");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}