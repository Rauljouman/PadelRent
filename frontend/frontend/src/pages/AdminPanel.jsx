import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import "../styles/AdminPanel.css";

export default function AdminPanel() {
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [adminEmail, setAdminEmail] = useState("");
  const [removeAdminEmail, setRemoveAdminEmail] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

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

  const promoverAdmin = async (e) => {
    e.preventDefault();

    setAdminMessage("");
    setError("");

    try {
      const data = await adminApi.promoverAdmin(adminEmail);

      setAdminMessage(
        `${data.nombre} ahora tiene permisos de administrador. Tendrá que cerrar sesión y volver a entrar.`
      );

      setAdminEmail("");
    } catch (error) {
      setError(error.message || "No se pudo conceder el permiso de administrador");
    }
  };

  const quitarAdmin = async (e) => {
    e.preventDefault();

    setAdminMessage("");
    setError("");

    try {
      const data = await adminApi.quitarAdmin(removeAdminEmail);

      setAdminMessage(
        `${data.nombre} ya no tiene permisos de administrador. Tendrá que cerrar sesión y volver a entrar.`
      );

      setRemoveAdminEmail("");
    } catch (error) {
      setError(error.message || "No se pudo retirar el permiso de administrador");
    }
  };

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-header">
        <h1>Panel de administrador</h1>
      </div>

      <div className="admin-actions-grid">
        <section className="admin-card">
          <div>
            <h1>Añadir administrador</h1>

            <p>
              Escribe el email de un usuario registrado para concederle permisos
              de administrador.
            </p>
          </div>

          <form className="admin-form" onSubmit={promoverAdmin}>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="usuario@email.com"
              required
            />

            <button
              type="submit"
              className="admin-button admin-button--primary"
            >
              Conceder permisos
            </button>
          </form>
        </section>

        <section className="admin-card admin-card--danger">
          <div>
            <h2>Quitar administrador</h2>

            <p>
              Escribe el email de un administrador para retirarle los permisos y
              dejarlo como usuario normal.
            </p>
          </div>

          <form className="admin-form" onSubmit={quitarAdmin}>
            <input
              type="email"
              value={removeAdminEmail}
              onChange={(e) => setRemoveAdminEmail(e.target.value)}
              placeholder="admin@email.com"
              required
            />

            <button
              type="submit"
              className="admin-button admin-button--danger"
            >
              Retirar permisos
            </button>
          </form>
        </section>
      </div>

      {adminMessage && (
        <p className="admin-success-message">{adminMessage}</p>
      )}

      <div className="admin-panel-status">
        {loading && <p className="admin-loading">Cargando pistas...</p>}

        {error && <p className="admin-error">{error}</p>}
      </div>

      {!loading && !error && (
        <section>
          <div className="admin-section-title">
            <h2>Gestión de pistas</h2>
            <p>Activa o desactiva pistas según su disponibilidad real.</p>
          </div>

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
        </section>
      )}
    </div>
  );
}