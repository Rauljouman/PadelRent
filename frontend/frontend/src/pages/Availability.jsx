import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, MapPin, ArrowRight, RefreshCcw } from "lucide-react";
import { reservasApi } from "../api/reservasApi";
import "../styles/Availability.css";

const PRICE_BY_DURATION = {
  60: 15,
  90: 22,
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

export default function Availability() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(todayStr());
  const [duracion, setDuracion] = useState(60);
  const [horarios, setHorarios] = useState([]);
  const [pistaSeleccionada, setPistaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const precio = PRICE_BY_DURATION[duracion];

  const buscarDisponibilidad = async () => {
    setLoading(true);
    setError("");
    setPistaSeleccionada(null);

    try {
      const data = await reservasApi.getDisponibilidad(fecha, duracion);
      setHorarios(data);
    } catch (error) {
      setError(error.message || "No se pudo cargar la disponibilidad.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDisponibilidad();
  }, [fecha, duracion]);

  const seleccionarPista = (horario, pista) => {
    setPistaSeleccionada({
      fecha,
      pistaId: pista.id,
      pistaNombre: pista.nombre,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      duracion,
      precio,
    });
  };

  const reservar = () => {
    if (!pistaSeleccionada) return;

    navigate(
      `/reservar?fecha=${pistaSeleccionada.fecha}` +
        `&pistaId=${pistaSeleccionada.pistaId}` +
        `&pistaNombre=${encodeURIComponent(pistaSeleccionada.pistaNombre)}` +
        `&horaInicio=${pistaSeleccionada.horaInicio}` +
        `&horaFin=${pistaSeleccionada.horaFin}` +
        `&duracion=${pistaSeleccionada.duracion}` +
        `&precio=${pistaSeleccionada.precio}`
    );
  };

  return (
    <section className="availability-page">
      <div className="availability-header">
        <div>
          <h1>Disponibilidad</h1>
          <p>Elige día y duración para ver las pistas libres.</p>
        </div>

        <button
          className="availability-refresh"
          type="button"
          onClick={buscarDisponibilidad}
          disabled={loading}
        >
          <RefreshCcw size={17} />
          Actualizar
        </button>
      </div>

      <div className="availability-filters">
        <div className="availability-filter">
          <label>
            <CalendarDays size={18} />
            Fecha
          </label>

          <input
            type="date"
            value={fecha}
            min={todayStr()}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="availability-filter">
          <label>
            <Clock size={18} />
            Duración
          </label>

          <div className="duration-selector">
            <button
              type="button"
              className={duracion === 60 ? "duration-option active" : "duration-option"}
              onClick={() => setDuracion(60)}
            >
              60 min · {PRICE_BY_DURATION[60]},00 €
            </button>

            <button
              type="button"
              className={duracion === 90 ? "duration-option active" : "duration-option"}
              onClick={() => setDuracion(90)}
            >
              90 min · {PRICE_BY_DURATION[90]},00 €
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="availability-status-card">
          <div className="availability-loader" />
          <p>Cargando disponibilidad...</p>
        </div>
      )}

      {error && <div className="availability-error">{error}</div>}

      {!loading && !error && horarios.length === 0 && (
        <div className="availability-empty">
          <h2>No hay horarios disponibles</h2>
          <p>Prueba con otra fecha o duración.</p>
        </div>
      )}

      {!loading && !error && horarios.length > 0 && (
        <div className="availability-list">
          {horarios.map((horario) => {
            const disponibles = horario.pistasDisponibles || [];

            return (
              <article className="time-card" key={`${horario.horaInicio}-${horario.horaFin}`}>
                <div className="time-card__hour">
                  {formatHora(horario.horaInicio)}
                </div>

                <div className="time-card__content">
                  <div className="time-card__top">
                    <div>
                      <h2>
                        {formatHora(horario.horaInicio)} – {formatHora(horario.horaFin)}
                      </h2>

                      <p>
                        {duracion} min · {precio},00 €
                      </p>
                    </div>

                    <span className="time-card__free">
                      {disponibles.length} libres
                    </span>
                  </div>

                  <div className="time-card__courts">
                    {disponibles.length === 0 ? (
                      <span className="court-button court-button--disabled">
                        Sin pistas disponibles
                      </span>
                    ) : (
                      disponibles.map((pista) => {
                        const selected =
                          pistaSeleccionada?.horaInicio === horario.horaInicio &&
                          pistaSeleccionada?.pistaId === pista.id;

                        return (
                          <button
                            key={pista.id}
                            type="button"
                            className={selected ? "court-button active" : "court-button"}
                            onClick={() => seleccionarPista(horario, pista)}
                          >
                            <MapPin size={15} />
                            {pista.nombre}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pistaSeleccionada && (
        <div className="booking-bar">
          <div>
            <strong>
              {pistaSeleccionada.pistaNombre} ·{" "}
              {formatHora(pistaSeleccionada.horaInicio)}–
              {formatHora(pistaSeleccionada.horaFin)}
            </strong>

            <span>
              {pistaSeleccionada.fecha} · {pistaSeleccionada.precio},00 €
            </span>
          </div>

          <button type="button" onClick={reservar}>
            Reservar
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}