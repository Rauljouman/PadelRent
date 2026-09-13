import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { reservasApi } from "../api/reservasApi";

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
        setError(error.message || "No se pudo confirmar el pago");
      }
    };

    confirmarPago();
  }, [sessionId]);

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1>Pago realizado</h1>

      {!sessionId && <p style={{ color: "red" }}>No se ha encontrado la sesión de Stripe.</p>}

      {!resultado && !error && <p>Confirmando pago...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultado && (
        <>
          <p style={{ color: "green" }}>
            Pago confirmado correctamente.
          </p>

          <p>
            <strong>Reserva:</strong> {resultado.reservaId}
          </p>

          <p>
            <strong>Importe:</strong> {resultado.importe} €
          </p>

          <p>
            <strong>Estado pago:</strong> {resultado.estadoPago}
          </p>

          <p>
            <strong>Estado reserva:</strong> {resultado.estadoReserva}
          </p>

          <Link to="/mis-reservas">Ver mis reservas</Link>
        </>
      )}
    </div>
  );
}