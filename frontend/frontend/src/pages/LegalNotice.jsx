import "../styles/LegalPages.css";

export default function LegalNotice() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <span className="legal-eyebrow">Información legal</span>

        <h1>Aviso legal</h1>

        <p>
          Esta página recoge la información básica sobre el uso de PadelRent como
          proyecto web de reserva de pistas de pádel.
        </p>
      </header>

      <main className="legal-content">
        <section className="legal-card legal-note">
          <p>
            PadelRent es un proyecto desarrollado con finalidad educativa y de
            portfolio. No representa una empresa real ni presta servicios reales
            de reserva de pistas.
          </p>
        </section>

        <section className="legal-card">
          <h2>Identificación del proyecto</h2>

          <p>
            PadelRent es una aplicación web creada para simular la gestión de
            reservas online de pistas de pádel.
          </p>

          <p>
            El objetivo del proyecto es mostrar un flujo completo de registro,
            inicio de sesión, disponibilidad, reserva, pago en modo test y
            comprobante.
          </p>
        </section>

        <section className="legal-card">
          <h2>Uso de la aplicación</h2>

          <p>
            El usuario se compromete a utilizar la aplicación de forma correcta,
            sin intentar acceder a zonas privadas, alterar datos de otros usuarios
            o realizar un uso indebido del sistema.
          </p>

          <p>
            Las reservas, pagos y comprobantes generados dentro del proyecto son
            simulados y no tienen validez comercial real.
          </p>
        </section>

        <section className="legal-card">
          <h2>Responsabilidad</h2>

          <p>
            Al tratarse de un proyecto de portfolio, la aplicación puede contener
            limitaciones técnicas, cambios pendientes o funcionalidades
            simplificadas.
          </p>

          <p>
            El autor del proyecto no se responsabiliza de un uso distinto al
            previsto dentro del contexto demostrativo de la aplicación.
          </p>
        </section>

        <section className="legal-card">
          <h2>Propiedad intelectual</h2>

          <p>
            El código, diseño y estructura del proyecto forman parte del trabajo
            realizado para portfolio personal.
          </p>
        </section>
      </main>
    </div>
  );
}