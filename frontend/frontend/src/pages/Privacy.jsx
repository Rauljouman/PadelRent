import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>Política de privacidad</h1>

      <p>
        En PadelRent tratamos los datos necesarios para permitir el registro,
        inicio de sesión, gestión de reservas, pagos y recuperación de contraseña.
      </p>

      <h2>Datos tratados</h2>
      <p>
        Podemos tratar datos como nombre, email, teléfono, reservas realizadas,
        estado de pago y fecha de creación de la cuenta.
      </p>

      <h2>Finalidad</h2>
      <p>
        Los datos se utilizan para identificar al usuario, gestionar sus reservas,
        procesar pagos, emitir comprobantes y permitir la recuperación de contraseña.
      </p>

      <h2>Contraseñas</h2>
      <p>
        Las contraseñas no se guardan en texto plano. Se almacenan de forma cifrada
        mediante hash seguro.
      </p>

      <h2>Pagos</h2>
      <p>
        Los pagos se gestionan mediante una pasarela externa. PadelRent no almacena
        los datos completos de la tarjeta bancaria.
      </p>

      <h2>Conservación</h2>
      <p>
        Los datos se conservan mientras la cuenta esté activa o sean necesarios para
        mantener el historial de reservas y comprobantes.
      </p>

      <h2>Derechos del usuario</h2>
      <p>
        El usuario puede solicitar la modificación o eliminación de sus datos de
        acuerdo con la normativa aplicable.
      </p>

      <p>
        <Link to="/register">Volver al registro</Link>
      </p>
    </div>
  );
}