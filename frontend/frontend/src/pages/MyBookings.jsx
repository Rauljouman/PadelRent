import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { reservasApi } from "../api/reservasApi";
import "../styles/MyBookings.css";

function formatHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

function formatPrecio(valor) {
  if (valor === null || valor === undefined) return "0,00 €";

  return Number(valor).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

function getEstadoClass(estado) {
  if (estado === "Pagada") return "booking-status booking-status--paid";
  if (estado === "Pendiente") return "booking-status booking-status--pending";
  if (estado === "Cancelada") return "booking-status booking-status--cancelled";
  return "booking-status";
}

export default function MyBookings() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accionId, setAccionId] = useState(null);
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [error, setError] = useState("");

  const cargarReservas = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await reservasApi.getMisReservas();
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const abrirModalCancelar = (reserva) => {
    setReservaACancelar(reserva);
  };

  const cerrarModalCancelar = () => {
    setReservaACancelar(null);
  };

  const confirmarCancelacion = async () => {
    if (!reservaACancelar) return;

    setAccionId(reservaACancelar.id);
    setError("");

    try {
      await reservasApi.cancelarReserva(reservaACancelar.id);
      setReservaACancelar(null);
      await cargarReservas();
    } catch (error) {
      setError(error.message || "No se pudo cancelar la reserva.");
    } finally {
      setAccionId(null);
    }
  };

  const pagarReserva = async (id) => {
    setAccionId(id);
    setError("");

    try {
      const checkout = await reservasApi.crearCheckoutSession(id);
      window.location.href = checkout.url;
    } catch (error) {
      setError(error.message || "No se pudo iniciar el pago.");
      setAccionId(null);
    }
  };

  return (
    <section className="my-bookings-page">
      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <div>
            <h1>Mis reservas</h1>
            <p>Consulta tus reservas, pagos y comprobantes.</p>
          </div>

          <button
            className="my-bookings-refresh"
            type="button"
            onClick={cargarReservas}
            disabled={loading}
          >
            <RefreshCcw size={17} />
            Actualizar
          </button>
        </div>

        {loading && (
          <div className="my-bookings-status-card">
            <div className="my-bookings-loader" />
            <p>Cargando reservas...</p>
          </div>
        )}

        {error && <div className="my-bookings-error">{error}</div>}

        {!loading && !error && reservas.length === 0 && (
          <div className="my-bookings-empty">
            <h2>No tienes reservas todavía</h2>
            <p>Busca una pista disponible y realiza tu primera reserva.</p>
            <Link to="/disponibilidad">Ver disponibilidad</Link>
          </div>
        )}

        {!loading && reservas.length > 0 && (
          <div className="my-bookings-list">
            {reservas.map((reserva) => (
              <article className="booking-card" key={reserva.id}>
                <div className="booking-card__main">
                  <div className="booking-card__icon">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <div className="booking-card__title-row">
                      <h2>{reserva.pistaNombre}</h2>

                      <span className={getEstadoClass(reserva.estado)}>
                        {reserva.estado}
                      </span>
                    </div>

                    <div className="booking-card__meta">
                      <span>
                        <CalendarDays size={15} />
                        {reserva.fecha}
                      </span>

                      <span>
                        <Clock size={15} />
                        {formatHora(reserva.horaInicio)} –{" "}
                        {formatHora(reserva.horaFin)}
                      </span>

                      <span>
                        <CreditCard size={15} />
                        {formatPrecio(reserva.precioPista)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-card__actions">
                  {reserva.estado === "Pendiente" && (
                    <>
                      <button
                        className="booking-card__button booking-card__button--pay"
                        type="button"
                        onClick={() => pagarReserva(reserva.id)}
                        disabled={accionId === reserva.id}
                      >
                        Pagar
                      </button>

                      <button
                        className="booking-card__button booking-card__button--cancel"
                        type="button"
                        onClick={() => abrirModalCancelar(reserva)}
                        disabled={accionId === reserva.id}
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                    </>
                  )}

                  {reserva.estado === "Pagada" && (
                    <Link
                      className="booking-card__button booking-card__button--receipt"
                      to={`/comprobante/${reserva.id}`}
                    >
                      <FileText size={16} />
                      Ver comprobante
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {reservaACancelar && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="booking-modal__icon">
              <XCircle size={26} />
            </div>

            <h2>Cancelar reserva</h2>

            <p>
              ¿Seguro que quieres cancelar la reserva de{" "}
              <strong>{reservaACancelar.pistaNombre}</strong> el día{" "}
              <strong>{reservaACancelar.fecha}</strong>?
            </p>

            <div className="booking-modal__actions">
              <button
                type="button"
                className="booking-modal__button booking-modal__button--secondary"
                onClick={cerrarModalCancelar}
                disabled={accionId === reservaACancelar.id}
              >
                Volver
              </button>

              <button
                type="button"
                className="booking-modal__button booking-modal__button--danger"
                onClick={confirmarCancelacion}
                disabled={accionId === reservaACancelar.id}
              >
                {accionId === reservaACancelar.id
                  ? "Cancelando..."
                  : "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}