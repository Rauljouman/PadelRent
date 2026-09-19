import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { authApi } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (!form.password.trim()) {
      setError("La nueva contraseña es obligatoria.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        token,
        nuevaPassword: form.password,
      });

      setMensaje("Contraseña actualizada correctamente. Te redirigiremos al login.");

      setForm({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      setError(error.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="reset-card">
        <div className="reset-card__icon">
          <KeyRound size={24} />
        </div>

        <div className="reset-card__header">
          <h1>Nueva contraseña</h1>
          <p>Introduce una nueva contraseña para recuperar el acceso a tu cuenta.</p>
        </div>

        {error && <div className="reset-error">{error}</div>}
        {mensaje && <div className="reset-success">{mensaje}</div>}

        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="reset-form__group">
            <label htmlFor="password">Nueva contraseña</label>

            <div className="reset-password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="reset-form__group">
            <label htmlFor="confirmPassword">Repetir contraseña</label>

            <div className="reset-password-field">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="reset-submit" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>

        <Link to="/login" className="reset-back">
          <ArrowLeft size={17} />
          Volver al login
        </Link>
      </div>
    </AuthLayout>
  );
}