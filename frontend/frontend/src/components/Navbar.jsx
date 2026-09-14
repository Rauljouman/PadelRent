import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "16px 40px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <strong>PadelRent</strong>
      </div>

      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/disponibilidad">Disponibilidad</Link>
        <Link to="/mis-reservas">Mis reservas</Link>

        <span>{user?.nombre}</span>

        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </nav>
    </header>
  );
}