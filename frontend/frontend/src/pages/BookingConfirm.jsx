import { useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { reservasApi } from "../api/reservasApi";

function prepararHoraParaBackend(hora) {
  if (!hora) return "";
  return hora.length === 5 ? `${hora}:00` : hora;
}

export default function BookingConfirm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const fecha = params.get("fecha");
  const pistaId = Number(params.get("pistaId"));
  const pistaNombre = params.get("pistaNombre");
  const horaInicio = params.get("horaInicio");
  const horaFin = params.get("horaFin");
  const duracion = Number(params.get("duracion"));
  const precio = Number(params.get("precio"));

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const datosValidos =
    fecha &&
    pistaId &&
    pistaNombre &&
    horaInicio &&
    horaFin &&
    duracion &&
    precio;

  if (!datosValidos) {
    return <Navigate to="/disponibilidad" replace />;
  }

  const confirmarReserva = async () => {
    setLoading(true);
    setError("");

    try {
      const reservaCreada = await reservasApi.crearReserva({
        pistaId: pistaId,
        fecha: fecha,
        horaInicio: prepararHoraParaBackend(horaInicio),
        duracionMinutos: duracion,
      });

      setReserva(reservaCreada);
    } catch (error) {
      setError(error.message || "No se pudo crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const pagarReserva = async () => {
    if (!reserva) return;

    setLoading(true);
    setError("");

    try {
      const checkout = await reservasApi.crearCheckoutSession(reserva.id);
      window.location.href = checkout.url;
    } catch (error) {
      setError(error.message || "No se pudo iniciar el pago");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1>Confirmar reserva</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <p>
          <strong>Pista:</strong> {pistaNombre}
        </p>

        <p>
          <strong>Fecha:</strong> {fecha}
        </p>

        <p>
          <strong>Horario:</strong> {horaInicio} - {horaFin}
        </p>

        <p>
          <strong>Duración:</strong> {duracion} minutos
        </p>

        <p>
          <strong>Precio:</strong> {precio} €
        </p>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!reserva ? (
        <button onClick={confirmarReserva} disabled={loading}>
          {loading ? "Creando reserva..." : "Confirmar reserva"}
        </button>
      ) : (
        <div>
          <p style={{ color: "green" }}>
            Reserva creada correctamente. Ahora puedes pagarla.
          </p>

          <button onClick={pagarReserva} disabled={loading}>
            {loading ? "Redirigiendo a Stripe..." : "Pagar con Stripe"}
          </button>
        </div>
      )}

      <br />
      <br />

      <button onClick={() => navigate("/disponibilidad")}>
        Volver a disponibilidad
      </button>
    </div>
  );
}