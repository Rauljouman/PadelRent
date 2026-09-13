import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reservasApi } from "../api/reservasApi";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Availability() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(todayStr());
  const [duracion, setDuracion] = useState(60);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarDisponibilidad = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await reservasApi.getDisponibilidad(fecha, duracion);
      setHorarios(data);
    } catch (error) {
      setError(error.message || "No se pudo cargar la disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDisponibilidad();
  }, [fecha, duracion]);

  const irAReservar = (horario, pista) => {
    navigate(
      `/reservar?fecha=${fecha}&pistaId=${pista.id}&pistaNombre=${pista.nombre}&horaInicio=${horario.horaInicio}&horaFin=${horario.horaFin}&duracion=${duracion}&precio=${duracion === 60 ? 30 : 40}`
    );
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Disponibilidad de pistas</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Fecha</label>
        <input
          type="date"
          value={fecha}
          min={todayStr()}
          onChange={(e) => setFecha(e.target.value)}
          style={{ display: "block", marginBottom: 12 }}
        />

        <label>Duración</label>
        <select
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          style={{ display: "block", marginBottom: 12 }}
        >
          <option value={60}>60 minutos</option>
          <option value={90}>90 minutos</option>
        </select>

        <button onClick={buscarDisponibilidad}>Buscar</button>
      </div>

      {loading && <p>Cargando disponibilidad...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && horarios.length === 0 && (
        <p>No hay horarios disponibles para esta fecha.</p>
      )}

      {horarios.map((horario) => (
        <div
          key={horario.horaInicio}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          <h3>
            {horario.horaInicio} - {horario.horaFin}
          </h3>

          {horario.pistasDisponibles.length === 0 ? (
            <p>No hay pistas disponibles en esta hora.</p>
          ) : (
            horario.pistasDisponibles.map((pista) => (
              <button
                key={pista.id}
                onClick={() => irAReservar(horario, pista)}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                Reservar {pista.nombre}
              </button>
            ))
          )}
        </div>
      ))}
    </div>
  );
}