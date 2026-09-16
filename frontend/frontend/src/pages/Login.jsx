import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/disponibilidad");
    } catch (error) {
      setError(error.message || "Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para reservar tu pista de pádel."
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate"
      footerLinkTo="/register"
    >
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="login-form__error">{error}</div>}

        <div className="login-form__field">
          <label>Email</label>

          <div className="login-form__input">
            <Mail size={18} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        <div className="login-form__field">
          <div className="login-form__label-row">
            <label>Contraseña</label>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>

          <div className="login-form__input">
            <Lock size={18} />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button className="login-form__button" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}