import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import { reservasApi } from "../api/reservasApi";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { updateUser } = useAuth();

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
      try {
        const perfilData = await userApi.getMe();
        const reservasData = await reservasApi.getMisReservas();

        const pagadas = reservasData.filter(
          (reserva) => reserva.estado === "Pagada"
        );

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
        nombre: form.nombre,
        telefono: form.telefono,
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

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Mi perfil</h1>
        <p style={{ color: "red" }}>{error || "No se pudo cargar el perfil."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1>Mi perfil</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <p>
          <strong>Email:</strong> {perfil.email}
        </p>

        <p>
          <strong>Fecha de creación:</strong> {perfil.fechaCreacion}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h2>Resumen de reservas</h2>

        <p>
          <strong>Reservas pagadas:</strong> {reservasPagadas.length}
        </p>

        <p>
          <strong>Total gastado:</strong>{" "}
          {reservasPagadas.reduce(
            (total, reserva) => total + reserva.precioPista,
            0
          )}{" "}
          €
        </p>

        {reservasPagadas.length > 0 && (
          <p>
            <strong>Última reserva pagada:</strong>{" "}
            {reservasPagadas[0].pistaNombre} - {reservasPagadas[0].fecha}
          </p>
        )}
      </div>

      <form onSubmit={guardarCambios}>
        <label>Nombre</label>

        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <label>Teléfono</label>

        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          maxLength={9}
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}