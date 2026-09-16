import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [accepted, setAccepted] = useState(false);
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

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!accepted) {
      setError("Debes aceptar los términos y la política de privacidad.");
      return;
    }

    if (!/^\d{9}$/.test(form.telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    setLoading(true);

    try {
      await register({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
      });

      navigate("/disponibilidad");
    } catch (error) {
      setError(error.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para empezar a reservar."
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkTo="/login"
    >
      <form className="register-form" onSubmit={handleSubmit}>
        {error && <div className="register-form__error">{error}</div>}

        <div className="register-form__field">
          <label>Nombre</label>

          <div className="register-form__input">
            <User size={18} />
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>
        </div>

        <div className="register-form__field">
          <label>Email</label>

          <div className="register-form__input">
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

        <div className="register-form__field">
          <label>Teléfono</label>

          <div className="register-form__input">
            <Phone size={18} />
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="600000000"
              maxLength={9}
              required
            />
          </div>
        </div>

        <div className="register-form__field">
          <label>Contraseña</label>

          <div className="register-form__input">
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

        <div className="register-form__field">
          <label>Repetir contraseña</label>

          <div className="register-form__input">
            <Lock size={18} />
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <label className="register-form__checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />

          <span>
            Acepto los <Link to="/terms">términos y condiciones</Link> y la{" "}
            <Link to="/privacy">política de privacidad</Link>.
          </span>
        </label>

        <button
          className="register-form__button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </AuthLayout>
  );
}