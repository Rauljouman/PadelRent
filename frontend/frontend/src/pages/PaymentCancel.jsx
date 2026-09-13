import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1>Pago cancelado</h1>

      <p>No se ha realizado ningún cargo.</p>

      <Link to="/disponibilidad">Volver a disponibilidad</Link>
    </div>
  );
}