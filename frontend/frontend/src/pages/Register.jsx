import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!accepted) {
      setError("Debes aceptar los términos y la política de privacidad");
      return;
    }

    if (!/^\d{9}$/.test(form.telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos");
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
      alert(error.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h1>Crear cuenta</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            maxLength={9}
            placeholder="123456789"
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </div>

        <div>
          <label>Repetir contraseña</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
        </div>

        <label style={{ display: "block", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />{" "}
          Acepto los términos y la política de privacidad
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}