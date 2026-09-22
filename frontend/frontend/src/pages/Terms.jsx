import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function Terms() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <span className="legal-eyebrow">
          Condiciones de uso
        </span>

        <h1>Términos y condiciones</h1>

        <p>
          Condiciones aplicables al uso de
          PadelRent y sus funcionalidades
          demostrativas de reserva de pistas.
        </p>
      </header>

      <main className="legal-content">
        <section className="legal-card legal-note">
          <p>
            PadelRent es un simulador de reservas
            desarrollado como proyecto personal
            de portfolio.
          </p>

          <p>
            No permite contratar pistas reales
            ni realizar pagos económicos reales.
          </p>
        </section>

        <section className="legal-card">
          <h2>1. Objeto de la aplicación</h2>

          <p>
            PadelRent permite simular el proceso
            completo de reserva de una pista
            de pádel.
          </p>

          <p>
            El usuario puede registrarse,
            consultar disponibilidad, seleccionar
            una pista, crear una reserva,
            realizar un pago de prueba y
            consultar su historial.
          </p>
        </section>

        <section className="legal-card">
          <h2>2. Registro y acceso</h2>

          <p>
            Para utilizar las funcionalidades
            privadas es necesario crear una
            cuenta o iniciar sesión.
          </p>

          <p>
            El usuario debe proporcionar
            los datos solicitados durante
            el registro y mantener sus
            credenciales de acceso
            de forma confidencial.
          </p>

          <p>
            Cada usuario puede consultar
            las reservas asociadas a su
            propia cuenta.
          </p>
        </section>

        <section className="legal-card">
          <h2>3. Consulta de disponibilidad</h2>

          <p>
            La aplicación permite consultar
            las pistas disponibles para
            una fecha y duración determinada.
          </p>

          <p>
            El horario configurado es de
            10:00 a 21:00 horas.
          </p>

          <p>
            Las reservas pueden tener una
            duración de 60 o 90 minutos.
          </p>

          <p>
            Los horarios mostrados dependen
            de las reservas existentes y
            del estado de cada pista.
          </p>
        </section>

        <section className="legal-card">
          <h2>4. Creación de reservas</h2>

          <p>
            Al seleccionar una pista y un
            horario, el usuario puede crear
            una reserva en estado pendiente.
          </p>

          <p>
            La reserva queda bloqueada
            temporalmente durante diez minutos
            para permitir el pago.
          </p>

          <p>
            Una vez transcurrido ese plazo,
            la reserva pendiente deja de
            bloquear la disponibilidad.
          </p>

          <p>
            El sistema puede actualizar su
            estado a cancelada cuando detecta
            que ha expirado.
          </p>
        </section>

        <section className="legal-card">
          <h2>5. Pagos</h2>

          <p>
            Los pagos se simulan mediante
            Stripe Checkout en modo test.
          </p>

          <p>
            No se realizan cargos reales
            al usuario.
          </p>

          <p>
            El pago de prueba permite
            comprobar la integración
            entre la aplicación y Stripe.
          </p>

          <p>
            Cuando el pago se confirma
            correctamente, la reserva
            pasa a estado pagada.
          </p>
        </section>

        <section className="legal-card">
          <h2>6. Estados de las reservas</h2>

          <p>
            Las reservas pueden encontrarse
            en los siguientes estados:
          </p>

          <ul>
            <li>
              Pendiente: reserva creada
              y pendiente de pago.
            </li>

            <li>
              Pagada: pago de prueba
              confirmado correctamente.
            </li>

            <li>
              Cancelada: reserva cancelada
              o cuyo plazo de pago ha expirado.
            </li>
          </ul>
        </section>

        <section className="legal-card">
          <h2>7. Cancelaciones</h2>

          <p>
            El usuario puede cancelar
            las reservas pendientes
            desde su historial.
          </p>

          <p>
            La versión actual no permite
            cancelar desde la web una
            reserva que ya se encuentra
            en estado pagada.
          </p>

          <p>
            Al tratarse de pagos simulados,
            no existe un procedimiento
            de devolución económica real.
          </p>
        </section>

        <section className="legal-card">
          <h2>8. Comprobantes</h2>

          <p>
            Tras confirmar un pago de prueba,
            PadelRent genera un comprobante
            asociado a la reserva.
          </p>

          <p>
            Este documento contiene información
            básica de la operación simulada.
          </p>

          <p>
            No constituye una factura
            comercial correspondiente
            a un servicio real.
          </p>
        </section>

        <section className="legal-card">
          <h2>9. Administración</h2>

          <p>
            Los usuarios con rol de
            administrador pueden acceder
            a funcionalidades adicionales.
          </p>

          <p>
            Estas permiten activar
            o desactivar pistas y
            gestionar los permisos de
            otros administradores.
          </p>

          <p>
            Una pista desactivada
            deja de mostrarse como
            disponible para nuevas reservas.
          </p>

          <p>
            Las funcionalidades administrativas
            están reservadas exclusivamente
            a las cuentas autorizadas.
          </p>
        </section>

        <section className="legal-card">
          <h2>10. Uso adecuado</h2>

          <p>
            Los usuarios deben utilizar
            la aplicación de manera
            responsable.
          </p>

          <p>
            No está permitido intentar
            acceder a información de
            otras cuentas, alterar datos
            ajenos o utilizar de forma
            indebida las funcionalidades
            administrativas.
          </p>
        </section>

        <section className="legal-card">
          <h2>11. Disponibilidad del servicio</h2>

          <p>
            PadelRent puede experimentar
            interrupciones, tareas de
            mantenimiento o limitaciones
            derivadas de los servicios
            utilizados para su alojamiento.
          </p>

          <p>
            Al tratarse de un proyecto
            demostrativo, no se garantiza
            una disponibilidad permanente.
          </p>
        </section>

        <section className="legal-card">
          <h2>12. Protección de datos</h2>

          <p>
            El tratamiento de datos personales
            se explica en la Política
            de privacidad.
          </p>

          <Link
            to="/privacy"
            className="legal-link"
          >
            Consultar la Política de privacidad
          </Link>
        </section>
      </main>
    </div>
  );
}