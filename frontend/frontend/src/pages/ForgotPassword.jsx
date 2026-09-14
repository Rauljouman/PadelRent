import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");
    setResetLink("");

    try {
      const data = await authApi.forgotPassword({ email });

      setMessage(data.mensaje || "Solicitud creada correctamente.");
      setResetLink(data.resetLink || "");
    } catch (error) {
      setError(error.message || "No se pudo solicitar el cambio de contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 450, margin: "0 auto" }}>
      <h1>Recuperar contraseña</h1>

      <p>Introduce tu email y se generará un enlace de recuperación de prueba.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {message && <p style={{ color: "green" }}>{message}</p>}

      {resetLink && (
        <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
          <p>
            <strong>Enlace demo:</strong>
          </p>

          <Link to={resetLink.replace("http://localhost:5173", "")}>
            Ir a cambiar contraseña
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Generar enlace"}
        </button>
      </form>

      <p>
        <Link to="/login">Volver al login</Link>
      </p>
    </div>
  );
}