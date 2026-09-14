import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reservasApi } from "../api/reservasApi";

export default function MyBookings() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarReservas = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await reservasApi.getMisReservas();
      setReservas(data);
    } catch (error) {
      setError(error.message || "No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const cancelarReserva = async (id) => {
    const confirmar = confirm("¿Seguro que quieres cancelar esta reserva?");

    if (!confirmar) return;

    try {
      await reservasApi.cancelarReserva(id);
      await cargarReservas();
    } catch (error) {
      alert(error.message || "No se pudo cancelar la reserva");
    }
  };

  const pagarReserva = async (id) => {
    try {
      const checkout = await reservasApi.crearCheckoutSession(id);
      window.location.href = checkout.url;
    } catch (error) {
      alert(error.message || "No se pudo iniciar el pago");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Mis reservas</h1>

      <p>
        <Link to="/disponibilidad">Volver a disponibilidad</Link>
      </p>

      {loading && <p>Cargando reservas...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && reservas.length === 0 && (
        <p>No tienes reservas todavía.</p>
      )}

      {reservas.map((reserva) => (
        <div
          key={reserva.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <h3>{reserva.pistaNombre}</h3>

          <p>
            <strong>Fecha:</strong> {reserva.fecha}
          </p>

          <p>
            <strong>Horario:</strong> {reserva.horaInicio} - {reserva.horaFin}
          </p>

          <p>
            <strong>Duración:</strong> {reserva.duracionMinutos} minutos
          </p>

          <p>
            <strong>Precio:</strong> {reserva.precioPista} €
          </p>

          <p>
            <strong>Estado:</strong> {reserva.estado}
          </p>

          {reserva.estado === "Pendiente" && (
            <>
              <button onClick={() => pagarReserva(reserva.id)}>
                Pagar
              </button>

              <button
                onClick={() => cancelarReserva(reserva.id)}
                style={{ marginLeft: 8 }}
              >
                Cancelar
              </button>
            </>
          )}

          {reserva.estado === "Pagada" && (
            <p>
              <Link to={`/comprobante/${reserva.id}`}>
                Ver comprobante
              </Link>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}