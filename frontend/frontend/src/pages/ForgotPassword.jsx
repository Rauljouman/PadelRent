import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { authApi } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!email.trim()) {
      setError("El email es obligatorio.");
      return;
    }

    setLoading(true);

    try {
      await authApi.forgotPassword(email.trim());

      setMensaje(
        "Si el email existe, recibirás un enlace para restablecer tu contraseña."
      );
    } catch (error) {
      setError(
        error.message ||
          "No se pudo generar el enlace de recuperación. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="forgot-card">
        <div className="forgot-card__icon">
          <Mail size={24} />
        </div>

        <div className="forgot-card__header">
          <h1>Recuperar contraseña</h1>
          <p>
            Introduce tu email y te enviaremos un enlace para crear una nueva
            contraseña.
          </p>
        </div>

        {error && <div className="forgot-error">{error}</div>}
        {mensaje && <div className="forgot-success">{mensaje}</div>}

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-form__group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <button className="forgot-submit" type="submit" disabled={loading}>
            <Send size={17} />
            {loading ? "Generando enlace..." : "Generar enlace"}
          </button>
        </form>

        <Link to="/login" className="forgot-back">
          <ArrowLeft size={17} />
          Volver al login
        </Link>
      </div>
    </AuthLayout>
  );
}