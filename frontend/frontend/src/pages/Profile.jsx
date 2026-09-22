
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Phone,
  Save,
  User,
  CalendarDays,
  CreditCard,
  LogOut,
} from "lucide-react";

import { userApi } from "../api/userApi";
import { reservasApi } from "../api/reservasApi";
import { useAuth } from "../context/AuthContext";

import "../styles/Profile.css";

function calcularTotalGastado(reservasPagadas) {
  return reservasPagadas.reduce(
    (total, reserva) => total + Number(reserva.precioPista || 0),
    0
  );
}

function formatFecha(fecha) {
  if (!fecha) return "No disponible";

  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Profile() {
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
  });

  const [reservasPagadas, setReservasPagadas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError("");

      try {
        const perfilData = await userApi.getMe();
        const reservasData = await reservasApi.getMisReservas();

        const pagadas = Array.isArray(reservasData)
          ? reservasData.filter(
              (reserva) => reserva.estado === "Pagada"
            )
          : [];

        setPerfil(perfilData);

        setForm({
          nombre: perfilData.nombre || "",
          telefono: perfilData.telefono || "",
        });

        setReservasPagadas(pagadas);
      } catch (error) {
        setError(error.message || "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (form.telefono && !/^\d{9}$/.test(form.telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    setGuardando(true);

    try {
      const data = await userApi.updateMe({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
      });

      setPerfil(data);

      updateUser({
        nombre: data.nombre,
        email: data.email,
      });

      setMensaje("Perfil actualizado correctamente.");
    } catch (error) {
      setError(error.message || "No se pudo actualizar el perfil.");
    } finally {
      setGuardando(false);
    }
  };

  const cerrarSesion = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-container">
          <div className="profile-status-card">
            <div className="profile-loader" />
            <p>Cargando perfil...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!perfil) {
    return (
      <section className="profile-page">
        <div className="profile-container">
          <div className="profile-error">
            {error || "No se pudo cargar el perfil."}
          </div>
        </div>
      </section>
    );
  }

  const totalGastado = calcularTotalGastado(reservasPagadas);
  const ultimaReservaPagada = reservasPagadas[0];

  return (
    <section className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <h1>Mi perfil</h1>

          <p>
            Gestiona tus datos personales y consulta tu actividad.
          </p>
        </div>

        {error && (
          <div className="profile-error">{error}</div>
        )}

        {mensaje && (
          <div className="profile-success">{mensaje}</div>
        )}

        <div className="profile-layout">

          <div className="profile-main-card">

            <div className="profile-card-header">
              <div className="profile-avatar">
                <User size={26} />
              </div>

              <div>
                <h2>{perfil.nombre}</h2>
                <p>{perfil.email}</p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={guardarCambios}
            >

              <div className="profile-form-group">
                <label htmlFor="nombre">Nombre</label>

                <input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="telefono">Teléfono</label>

                <input
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  maxLength={9}
                  placeholder="Ej. 600123456"
                />
              </div>

              <button
                className="profile-save-button"
                type="submit"
                disabled={guardando}
              >
                <Save size={17} />

                {guardando
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>

            </form>
          </div>

          <aside className="profile-side">

            <div className="profile-info-card">

              <h3>Datos de la cuenta</h3>

              <div className="profile-info-row">
                <Mail size={17} />

                <div>
                  <span>Email</span>
                  <strong>{perfil.email}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <Phone size={17} />

                <div>
                  <span>Teléfono</span>

                  <strong>
                    {perfil.telefono || "No indicado"}
                  </strong>
                </div>
              </div>

              <div className="profile-info-row">
                <CalendarDays size={17} />

                <div>
                  <span>Fecha de creación</span>

                  <strong>
                    {formatFecha(perfil.fechaCreacion)}
                  </strong>
                </div>
              </div>

            </div>

            <div className="profile-info-card">

              <h3>Resumen de reservas</h3>

              <div className="profile-stat-grid">

                <div className="profile-stat">
                  <span>Reservas pagadas</span>

                  <strong>
                    {reservasPagadas.length}
                  </strong>
                </div>

                <div className="profile-stat">
                  <span>Total gastado</span>

                  <strong>
                    {totalGastado},00 €
                  </strong>
                </div>

              </div>

              {ultimaReservaPagada && (
                <div className="profile-last-booking">
                  <CreditCard size={17} />

                  <div>
                    <span>Última reserva pagada</span>

                    <strong>
                      {ultimaReservaPagada.pistaNombre} ·{" "}
                      {ultimaReservaPagada.fecha}
                    </strong>
                  </div>
                </div>
              )}

            </div>

          </aside>

        </div>

        {/* Botón visible únicamente en móvil */}
        <button
          type="button"
          className="profile-logout-button"
          onClick={cerrarSesion}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>

      </div>
    </section>
  );
}