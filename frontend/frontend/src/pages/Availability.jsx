import { useState } from "react";
import { reservasApi } from "../api/reservasApi";

export default function Availability() {
  const [fecha, setFecha] = useState("2026-09-14");
  const [duracion, setDuracion] = useState(60);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarDisponibilidad = async () => {
    try {
      setLoading(true);
      const data = await reservasApi.getDisponibilidad(fecha, duracion);
      setHorarios(data);
    } catch (error) {
      alert(error.message || "Error al buscar disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  const reservar = async (pistaId, horaInicio) => {
    try {
      const reserva = await reservasApi.crearReserva({
        pistaId,
        fecha,
        horaInicio,
        duracionMinutos: Number(duracion),
      });

      alert("Reserva creada correctamente");

      const checkout = await reservasApi.crearCheckoutSession(reserva.id);

      window.location.href = checkout.url;
    } catch (error) {
      alert(error.message || "Error al crear reserva");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Disponibilidad</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div>
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div>
          <label>Duración</label>
          <select
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
          >
            <option value={60}>60 minutos</option>
            <option value={90}>90 minutos</option>
          </select>
        </div>

        <button onClick={buscarDisponibilidad} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {horarios.length === 0 && <p>No hay horarios cargados.</p>}

      {horarios.map((horario, index) => (
        <div
          key={index}
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
            <p>No hay pistas disponibles.</p>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {horario.pistasDisponibles.map((pista) => (
                <button
                  key={pista.id}
                  onClick={() => reservar(pista.id, horario.horaInicio)}
                >
                  Reservar {pista.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}