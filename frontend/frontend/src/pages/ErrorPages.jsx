import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import "../styles/ErrorPages.css";

export default function ErrorPage({
  title = "Algo ha fallado",
  message = "No se ha podido completar la acción. Inténtalo de nuevo en unos segundos.",
}) {
  return (
    <section className="error-page">
      <div className="error-card">
        <div className="error-icon error-icon--danger">
          <AlertTriangle size={36} />
        </div>

        <span className="error-code">Error</span>

        <h1>{title}</h1>

        <p>{message}</p>

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