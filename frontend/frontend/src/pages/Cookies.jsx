import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function Cookies() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <span className="legal-eyebrow">
          Privacidad y navegación
        </span>

        <h1>Política de cookies</h1>

        <p>
          Información sobre las tecnologías
          de almacenamiento utilizadas
          durante la navegación por PadelRent.
        </p>
      </header>

      <main className="legal-content">
        <section className="legal-card legal-note">
          <p>
            PadelRent utiliza almacenamiento
            local del navegador para mantener
            la sesión del usuario y permitir
            el acceso a las funcionalidades
            privadas.
          </p>
        </section>

        <section className="legal-card">
          <h2>1. Qué son las cookies</h2>

          <p>
            Las cookies son pequeños archivos
            o elementos de información que
            un sitio web puede almacenar
            en el navegador del usuario.
          </p>

          <p>
            También existen otras tecnologías
            de almacenamiento, como
            localStorage, utilizadas
            por las aplicaciones web.
          </p>
        </section>

        <section className="legal-card">
          <h2>2. Almacenamiento utilizado por PadelRent</h2>

          <p>
            La aplicación utiliza
            localStorage para guardar
            información necesaria
            durante la sesión.
          </p>

          <h3>padelrent_token</h3>

          <p>
            Contiene el token JWT utilizado
            para identificar al usuario
            durante las peticiones
            autenticadas al backend.
          </p>

          <h3>padelrent_user</h3>

          <p>
            Contiene información básica
            del usuario conectado,
            como su identificador,
            nombre, email y rol.
          </p>

          <p>
            Estos datos permiten mantener
            la sesión y adaptar la
            interfaz según los permisos
            del usuario.
          </p>

          <p>
            Los elementos almacenados
            mediante localStorage pueden
            permanecer en el navegador
            después de cerrarlo.
          </p>
        </section>

        <section className="legal-card">
          <h2>3. Finalidad del almacenamiento</h2>

          <p>
            El almacenamiento utilizado
            por la aplicación tiene
            finalidades funcionales
            relacionadas con la
            autenticación.
          </p>

          <ul>
            <li>
              Mantener la sesión iniciada.
            </li>

            <li>
              Identificar al usuario
              autenticado.
            </li>

            <li>
              Permitir el acceso a
              funcionalidades privadas.
            </li>

            <li>
              Adaptar la navegación
              según el rol del usuario.
            </li>
          </ul>
        </section>

        <section className="legal-card">
          <h2>4. Cookies de terceros</h2>

          <p>
            PadelRent utiliza servicios
            tecnológicos externos para
            su funcionamiento.
          </p>

          <p>
            En particular, el proceso
            de pago de prueba se realiza
            mediante Stripe Checkout.
          </p>

          <p>
            Al acceder a servicios
            de terceros, estos pueden
            utilizar sus propias
            tecnologías de almacenamiento
            conforme a sus respectivas
            políticas.
          </p>

          <a
            href="https://stripe.com/es/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Consultar la política de Stripe
          </a>
        </section>

        <section className="legal-card">
          <h2>5. Publicidad y analítica</h2>

          <p>
            El frontend desarrollado
            para PadelRent no incorpora
            herramientas propias de
            publicidad personalizada
            ni de analítica comercial.
          </p>

          <p>
            Si se incorporan en el futuro
            tecnologías de seguimiento
            que requieran consentimiento,
            se actualizará esta política
            y se habilitarán los mecanismos
            correspondientes.
          </p>
        </section>

        <section className="legal-card">
          <h2>6. Cómo eliminar los datos</h2>

          <p>
            El usuario puede cerrar
            sesión desde la aplicación.
          </p>

          <p>
            Esta acción elimina del
            almacenamiento local del
            navegador los datos de
            sesión gestionados por
            PadelRent.
          </p>

          <p>
            También es posible eliminar
            manualmente los datos
            almacenados desde la
            configuración del navegador.
          </p>

          <p>
            La eliminación de estos
            elementos puede requerir
            que el usuario vuelva
            a iniciar sesión.
          </p>
        </section>

        <section className="legal-card">
          <h2>7. Protección de datos</h2>

          <p>
            Para conocer cómo se
            gestionan los datos personales
            introducidos en la aplicación,
            consulta la Política
            de privacidad.
          </p>

          <Link
            to="/privacy"
            className="legal-link"
          >
            Consultar la Política de privacidad
          </Link>
        </section>

        <section className="legal-card">
          <h2>8. Actualizaciones</h2>

          <p>
            Esta política podrá actualizarse
            si se incorporan nuevas
            tecnologías de almacenamiento
            o servicios externos.
          </p>
        </section>
      </main>
    </div>
  );
}