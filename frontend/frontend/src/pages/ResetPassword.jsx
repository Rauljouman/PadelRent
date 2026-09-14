import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cambiarPassword = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError("El enlace no es válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        token,
        nuevaPassword: password,
      });

      alert("Contraseña cambiada correctamente.");
      navigate("/login");
    } catch (error) {
      setError(error.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 450, margin: "0 auto" }}>
      <h1>Nueva contraseña</h1>

      <p>Introduce tu nueva contraseña.</p>

      {!token && (
        <p style={{ color: "red" }}>
          El enlace no es válido.
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={cambiarPassword}>
        <label>Nueva contraseña</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <label>Repetir contraseña</label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <button type="submit" disabled={loading || !token}>
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>

      <p>
        <Link to="/login">Volver al login</Link>
      </p>
    </div>
  );
}