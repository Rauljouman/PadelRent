import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>Términos y condiciones</h1>

      <p>
        Estos términos regulan el uso de PadelRent, una aplicación para consultar
        disponibilidad, reservar pistas de pádel y gestionar reservas.
      </p>

      <h2>Uso de la plataforma</h2>
      <p>
        El usuario se compromete a utilizar la plataforma de forma correcta,
        proporcionando datos veraces durante el registro y la reserva.
      </p>

      <h2>Reservas</h2>
      <p>
        Las reservas se realizan seleccionando fecha, hora, duración y pista
        disponible. Una reserva pendiente puede expirar si no se completa el pago
        dentro del tiempo establecido.
      </p>

      <h2>Pagos</h2>
      <p>
        Los pagos se procesan mediante una pasarela externa. PadelRent no almacena
        los datos completos de tarjetas bancarias.
      </p>

      <h2>Cancelaciones</h2>
      <p>
        Las reservas pendientes pueden cancelarse desde el apartado de mis reservas.
        Las condiciones de cancelación de reservas pagadas dependerán de la política
        establecida por el centro deportivo.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        PadelRent actúa como herramienta de gestión de reservas. El usuario es
        responsable de revisar correctamente los datos antes de confirmar una reserva.
      </p>

      <p>
        <Link to="/register">Volver al registro</Link>
      </p>
    </div>
  );
}