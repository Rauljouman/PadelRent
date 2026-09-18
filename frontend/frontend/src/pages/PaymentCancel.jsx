import { Link } from "react-router-dom";
import { ArrowLeft, XCircle } from "lucide-react";
import "../styles/PaymentResult.css";

export default function PaymentCancel() {
  return (
    <section className="payment-result-page">
      <div className="payment-result-card payment-result-card--cancel">
        <div className="payment-result-icon payment-result-icon--cancel">
          <XCircle size={34} />
        </div>

        <h1>Pago cancelado</h1>

        <p className="payment-result-text">
          No se ha realizado ningún cargo. Puedes volver a disponibilidad y
          elegir otra pista u horario.
        </p>

        <div className="payment-result-actions">
          <Link to="/disponibilidad" className="payment-result-button">
            <ArrowLeft size={17} />
            Volver a disponibilidad
          </Link>

          <Link
            to="/mis-reservas"
            className="payment-result-button payment-result-button--secondary"
          >
            Ver mis reservas
          </Link>
        </div>
      </div>
    </section>
  );
}