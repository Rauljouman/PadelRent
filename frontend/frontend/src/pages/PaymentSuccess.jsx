import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, FileText, Loader2, Ticket } from "lucide-react";
import { reservasApi } from "../api/reservasApi";
import "../styles/PaymentResult.css";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const yaConfirmado = useRef(false);

  useEffect(() => {
    const confirmarPago = async () => {
      if (!sessionId || yaConfirmado.current) return;

      yaConfirmado.current = true;

      try {
        const data = await reservasApi.confirmarCheckoutSession(sessionId);
        setResultado(data);
      } catch (error) {
        setError(error.message || "No se pudo confirmar el pago.");
      }
    };

    confirmarPago();
  }, [sessionId]);

  return (
    <section className="payment-result-page">
      <div className="payment-result-card payment-result-card--success">
        <div className="payment-result-icon payment-result-icon--success">
          <CheckCircle2 size={34} />
        </div>

        <h1>Pago realizado</h1>

        {!sessionId && (
          <div className="payment-result-alert payment-result-alert--error">
            No se ha encontrado la sesión de pago.
          </div>
        )}

        {!resultado && !error && sessionId && (
          <div className="payment-result-loading">
            <Loader2 size={20} />
            <span>Confirmando pago...</span>
          </div>
        )}

        {error && (
          <div className="payment-result-alert payment-result-alert--error">
            {error}
          </div>
        )}

        {resultado && (
          <>
            <p className="payment-result-text">
              Tu pago se ha confirmado correctamente y la reserva ya aparece en
              tu historial.
            </p>

            <div className="payment-result-summary">
              <div>
                <span>Reserva</span>
                <strong>#{resultado.reservaId}</strong>
              </div>

              <div>
                <span>Importe</span>
                <strong>{resultado.importe},00 €</strong>
              </div>

              <div>
                <span>Estado del pago</span>
                <strong>{resultado.estadoPago}</strong>
              </div>

              <div>
                <span>Estado de la reserva</span>
                <strong>{resultado.estadoReserva}</strong>
              </div>
            </div>

            <div className="payment-result-actions">
              <Link to="/mis-reservas" className="payment-result-button">
                <Ticket size={17} />
                Ver mis reservas
              </Link>

              <Link
                to={`/comprobante/${resultado.reservaId}`}
                className="payment-result-button payment-result-button--secondary"
              >
                <FileText size={17} />
                Ver comprobante
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}