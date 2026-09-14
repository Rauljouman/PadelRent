import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const solicitarReset = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMensaje("");
    setResetLink("");

    try {
      const data = await authApi.forgotPassword({ email });

      setMensaje(data.mensaje || "Si el email existe, recibirás instrucciones para recuperar tu contraseña.");
      setResetLink(data.resetLink || "");
    } catch (error) {
      setError(error.message || "No se pudo generar el enlace de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 450, margin: "0 auto" }}>
      <h1>Recuperar contraseña</h1>

      <p>Introduce tu email para generar un enlace de recuperación.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      {resetLink && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <p>
            <strong>Enlace de recuperación:</strong>
          </p>

          <Link to={resetLink.replace("http://localhost:5173", "")}>
            Ir a cambiar contraseña
          </Link>
        </div>
      )}

      <form onSubmit={solicitarReset}>
        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar enlace"}
        </button>
      </form>

      <p>
        <Link to="/login">Volver al login</Link>
      </p>
    </div>
  );
}