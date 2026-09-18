import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import "../styles/ErrorPages.css";

export default function NotFound() {
  return (
    <section className="error-page">
      <div className="error-card">
        <div className="error-icon">
          <SearchX size={36} />
        </div>

        <span className="error-code">404</span>

        <h1>Página no encontrada</h1>

        <p>
          La página que estás buscando no existe o ha cambiado de ubicación.
        </p>

        <div className="error-actions">
          <Link to="/disponibilidad" className="error-button">
            <ArrowLeft size={17} />
            Volver a disponibilidad
          </Link>

          <Link to="/mis-reservas" className="error-button error-button--secondary">
            Ver mis reservas
          </Link>
        </div>
      </div>
    </section>
  );
}