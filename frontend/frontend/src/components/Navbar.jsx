import { NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, Ticket, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoPadelRent from "../assets/logo-padelrent.png";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? "sidebar__link sidebar__link--active" : "sidebar__link";

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="sidebar__logo">
          <img
            className="sidebar__logo-img"
            src={logoPadelRent}
            alt="PadelRent"
          />
        </div>

        <nav className="sidebar__nav">
          <NavLink to="/disponibilidad" className={getLinkClass}>
            <CalendarDays size={18} />
            <span>Disponibilidad</span>
          </NavLink>

          <NavLink to="/mis-reservas" className={getLinkClass}>
            <Ticket size={18} />
            <span>Mis reservas</span>
          </NavLink>

          <NavLink to="/perfil" className={getLinkClass}>
            <User size={18} />
            <span>Perfil</span>
          </NavLink>

          <NavLink to="/admin/pistas" className={getLinkClass}>
            <User size={18} />
            <span>Panel administrador</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__user">
          <strong>{user?.nombre || "Usuario"}</strong>
          <span>{user?.email || "Sin email"}</span>
        </div>

        <button className="sidebar__logout" type="button" onClick={cerrarSesion}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}