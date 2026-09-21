import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import "../styles/AdminPistas.css";

export default function AdminPistas() {
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarPistas = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminApi.getPistas();
      setPistas(data);
    } catch (error) {
      setError(error.message || "No se pudieron cargar las pistas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPistas();
  }, []);

  const cambiarEstadoPista = async (pista) => {
    try {
      if (pista.activa) {
        await adminApi.desactivarPista(pista.id);
      } else {
        await adminApi.activarPista(pista.id);
      }

      await cargarPistas();
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado de la pista");
    }
  };

  return (
    <div className="admin-pistas-page">
      <div className="admin-pistas-header">
        <Link to="/disponibilidad" className="admin-pistas-back">
          ← Volver a disponibilidad
        </Link>

        <h1>Administración de pistas</h1>

        <p>
          Desde aquí puedes activar o desactivar pistas completas. Si una pista
          está desactivada, no aparecerá en la disponibilidad y no se podrá
          reservar.
        </p>
      </div>

      <div className="admin-pistas-status">
        {loading && (
          <p className="admin-pistas-loading">Cargando pistas...</p>
        )}

        {error && <p className="admin-pistas-error">{error}</p>}
      </div>

      {!loading && !error && (
        <div className="admin-pistas-grid">
          {pistas.map((pista) => (
            <article className="admin-pista-card" key={pista.id}>
              <div className="admin-pista-card__top">
                <div>
                  <h3>{pista.nombre}</h3>

                  <p>
                    {pista.activa
                      ? "Disponible para reservas"
                      : "No aparece en disponibilidad"}
                  </p>
                </div>

                <span
                  className={
                    pista.activa
                      ? "admin-pista-badge admin-pista-badge--active"
                      : "admin-pista-badge admin-pista-badge--inactive"
                  }
                >
                  {pista.activa ? "Activa" : "Desactivada"}
                </span>
              </div>

              <button
                className={
                  pista.activa
                    ? "admin-pista-button admin-pista-button--disable"
                    : "admin-pista-button admin-pista-button--enable"
                }
                onClick={() => cambiarEstadoPista(pista)}
              >
                {pista.activa ? "Desactivar pista" : "Activar pista"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}