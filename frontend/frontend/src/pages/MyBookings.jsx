import { useEffect, useState } from "react";
import { reservasApi } from "../api/reservasApi";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const data = await reservasApi.getMisReservas();
      setReservas(data);
    } catch (error) {
      alert(error.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const cancelar = async (id) => {
    try {
      await reservasApi.cancelarReserva(id);
      alert("Reserva cancelada");
      cargarReservas();
    } catch (error) {
      alert(error.message || "Error al cancelar reserva");
    }
  };

  const pagar = async (id) => {
    try {
      const checkout = await reservasApi.crearCheckoutSession(id);
      window.location.href = checkout.url;
    } catch (error) {
      alert(error.message || "Error al iniciar pago");
    }
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Cargando reservas...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Mis reservas</h1>

      <Link to="/dashboard">Volver</Link>

      {reservas.length === 0 && <p>No tienes reservas.</p>}

      {reservas.map((reserva) => (
        <div
          key={reserva.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginTop: 16,
            borderRadius: 8,
          }}
        >
          <h3>{reserva.pistaNombre}</h3>
          <p>Fecha: {reserva.fecha}</p>
          <p>
            Hora: {reserva.horaInicio} - {reserva.horaFin}
          </p>
          <p>Duración: {reserva.duracionMinutos} minutos</p>
          <p>Precio: {reserva.precioPista} €</p>
          <p>Estado: {reserva.estado}</p>

          {reserva.estado === "Pendiente" && (
            <>
              <button onClick={() => pagar(reserva.id)}>Pagar</button>
              <button onClick={() => cancelar(reserva.id)}>
                Cancelar
              </button>
            </>
          )}

          {reserva.estado === "Pagada" && (
            <Link to={`/comprobante/${reserva.id}`}>
              Ver comprobante
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}