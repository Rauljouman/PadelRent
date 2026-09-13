import { apiRequest } from "./apiClient";

export const reservasApi = {
  getDisponibilidad: (fecha, duracion) =>
    apiRequest(`/Disponibilidad?fecha=${fecha}&duracion=${duracion}`),

  crearReserva: (data) =>
    apiRequest("/Reservas", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMisReservas: () =>
    apiRequest("/Reservas/mis-reservas"),

  cancelarReserva: (id) =>
    apiRequest(`/Reservas/${id}/cancelar`, {
      method: "PUT",
    }),

  crearCheckoutSession: (reservaId) =>
    apiRequest(`/Pagos/crear-checkout-session/${reservaId}`, {
      method: "POST",
    }),

  confirmarCheckoutSession: (sessionId) =>
    apiRequest(`/Pagos/confirmar-checkout-session/${sessionId}`, {
      method: "POST",
    }),

  getFacturaPorReserva: (reservaId) =>
    apiRequest(`/Facturas/reserva/${reservaId}`),
};