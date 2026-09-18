import { useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
} from "lucide-react";
import { reservasApi } from "../api/reservasApi";
import "../styles/BookingConfirm.css";

function prepararHoraParaBackend(hora) {
  if (!hora) return "";
  return hora.length === 5 ? `${hora}:00` : hora;
}

function formatHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
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
    fecha && pistaId && pistaNombre && horaInicio && horaFin && duracion && precio;

  if (!datosValidos) {
    return <Navigate to="/disponibilidad" replace />;
  }

  const confirmarReserva = async () => {
    setLoading(true);
    setError("");

    try {
      const reservaCreada = await reservasApi.crearReserva({
        pistaId,
        fecha,
        horaInicio: prepararHoraParaBackend(horaInicio),
        duracionMinutos: duracion,
      });

      setReserva(reservaCreada);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo crear la reserva. Puede que la pista ya no esté disponible."
      );
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
      setError(error.message || "No se pudo iniciar el pago.");
      setLoading(false);
    }
  };

  return (
    <section className="booking-confirm-page">
      <div className="booking-confirm-container">
        <button
          className="booking-confirm-back"
          type="button"
          onClick={() => navigate("/disponibilidad")}
        >
          <ArrowLeft size={17} />
          Volver a disponibilidad
        </button>

        <div className="booking-confirm-header">
          <h1>Confirmar reserva</h1>
          <p>Revisa los datos antes de continuar con el pago.</p>
        </div>

        <div className="booking-confirm-card">
          <div className="booking-confirm-summary">
            <div className="booking-confirm-icon">
              <MapPin size={24} />
            </div>

            <div>
              <span>Pista seleccionada</span>
              <strong>{pistaNombre}</strong>
            </div>
          </div>

          <div className="booking-confirm-details">
            <div className="booking-confirm-detail">
              <CalendarDays size={18} />
              <div>
                <span>Fecha</span>
                <strong>{fecha}</strong>
              </div>
            </div>

            <div className="booking-confirm-detail">
              <Clock size={18} />
              <div>
                <span>Horario</span>
                <strong>
                  {formatHora(horaInicio)} – {formatHora(horaFin)}
                </strong>
              </div>
            </div>

            <div className="booking-confirm-detail">
              <Clock size={18} />
              <div>
                <span>Duración</span>
                <strong>{duracion} minutos</strong>
              </div>
            </div>

            <div className="booking-confirm-detail booking-confirm-detail--price">
              <CreditCard size={18} />
              <div>
                <span>Total</span>
                <strong>{precio},00 €</strong>
              </div>
            </div>
          </div>

          {error && <div className="booking-confirm-error">{error}</div>}

          {!reserva ? (
            <button
              className="booking-confirm-main-button"
              type="button"
              onClick={confirmarReserva}
              disabled={loading}
            >
              {loading ? "Creando reserva..." : "Confirmar reserva"}
              {!loading && <ArrowRight size={18} />}
            </button>
          ) : (
            <div className="booking-confirm-success">
              <p>Reserva creada correctamente. Ahora puedes completar el pago.</p>

              <button
                className="booking-confirm-main-button"
                type="button"
                onClick={pagarReserva}
                disabled={loading}
              >
                {loading ? "Redirigiendo al pago..." : "Continuar al pago"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}