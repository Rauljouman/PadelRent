import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function Privacy() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <span className="legal-eyebrow">
          Protección de datos
        </span>

        <h1>Política de privacidad</h1>

        <p>
          Información sobre los datos personales
          utilizados por PadelRent y su tratamiento
          durante el uso de la aplicación.
        </p>
      </header>

      <main className="legal-content">
        <section className="legal-card legal-note">
          <p>
            PadelRent es un proyecto personal de
            portfolio. Aunque las reservas y los
            pagos son simulados, los datos que
            introducen los usuarios durante el
            registro pueden ser datos personales
            reales.
          </p>
        </section>

        <section className="legal-card">
          <h2>1. Responsable del tratamiento</h2>

          <p>
            Responsable: [NOMBRE DEL RESPONSABLE].
          </p>

          <p>
            Proyecto: PadelRent.
          </p>

          <p>
            Correo de contacto:
            [EMAIL DE CONTACTO].
          </p>

          <p>
            Para cualquier consulta relacionada
            con el tratamiento de datos personales,
            puedes utilizar el correo de contacto
            indicado.
          </p>
        </section>

        <section className="legal-card">
          <h2>2. Datos personales tratados</h2>

          <p>
            PadelRent puede tratar los siguientes
            datos durante el funcionamiento de
            la aplicación:
          </p>

          <ul>
            <li>Nombre del usuario.</li>
            <li>Dirección de correo electrónico.</li>
            <li>Número de teléfono.</li>
            <li>Hash de la contraseña.</li>
            <li>Fecha de creación de la cuenta.</li>
            <li>Rol asignado al usuario.</li>
            <li>Reservas realizadas.</li>
            <li>Fechas y horarios seleccionados.</li>
            <li>Estado de las reservas.</li>
            <li>
              Referencias y estados de pagos
              realizados en modo test.
            </li>
            <li>
              Datos incluidos en los comprobantes
              simulados.
            </li>
          </ul>

          <p>
            El sistema también utiliza un token JWT
            para identificar las sesiones
            autenticadas.
          </p>
        </section>

        <section className="legal-card">
          <h2>3. Finalidad del tratamiento</h2>

          <p>
            Los datos se utilizan para permitir
            el funcionamiento de PadelRent.
          </p>

          <ul>
            <li>Registrar e identificar usuarios.</li>
            <li>Permitir el inicio de sesión.</li>
            <li>
              Recuperar el acceso a una cuenta.
            </li>
            <li>
              Consultar y gestionar reservas.
            </li>
            <li>
              Simular el pago de una reserva.
            </li>
            <li>
              Generar comprobantes demostrativos.
            </li>
            <li>
              Gestionar permisos de administrador.
            </li>
            <li>
              Proteger las funcionalidades privadas
              de la aplicación.
            </li>
          </ul>

          <p>
            Los datos introducidos no se utilizan
            por PadelRent para realizar campañas
            publicitarias o enviar comunicaciones
            comerciales.
          </p>
        </section>

        <section className="legal-card">
          <h2>4. Base jurídica</h2>

          <p>
            El tratamiento de los datos necesarios
            para registrar una cuenta y permitir
            el uso de las funcionalidades solicitadas
            se basa en la relación establecida
            con el usuario al registrarse y utilizar
            la aplicación demostrativa.
          </p>

          <p>
            Determinados tratamientos técnicos
            necesarios para proteger la aplicación
            pueden fundamentarse en el interés
            legítimo de mantener la seguridad
            del servicio, cuando corresponda.
          </p>

          <p>
            Si en el futuro se incorporan tratamientos
            que requieran consentimiento, este se
            solicitará de forma diferenciada.
          </p>
        </section>

        <section className="legal-card">
          <h2>5. Contraseñas y autenticación</h2>

          <p>
            Las contraseñas no se almacenan en
            texto plano.
          </p>

          <p>
            PadelRent utiliza BCrypt para generar
            un hash de la contraseña, que se emplea
            posteriormente para verificar las
            credenciales durante el inicio de sesión.
          </p>

          <p>
            La autenticación se realiza mediante
            tokens JWT.
          </p>

          <p>
            El navegador almacena el token y
            determinados datos básicos del usuario
            mediante localStorage para mantener
            la sesión autenticada.
          </p>

          <p>
            Se recomienda no compartir las
            credenciales de acceso ni utilizar
            contraseñas que ya se empleen
            en otros servicios.
          </p>
        </section>

        <section className="legal-card">
          <h2>6. Pagos de prueba</h2>

          <p>
            PadelRent utiliza Stripe Checkout
            en modo test para simular pagos
            de reservas.
          </p>

          <p>
            No se realizan cargos económicos
            reales mediante esta integración.
          </p>

          <p>
            La aplicación almacena referencias
            de las operaciones de prueba y
            su estado, pero no almacena
            directamente los números completos
            de tarjetas bancarias.
          </p>

          <p>
            Durante el proceso de pago se
            aplican también las condiciones
            y políticas del proveedor.
          </p>

          <a
            href="https://stripe.com/es/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Política de privacidad de Stripe
          </a>
        </section>

        <section className="legal-card">
          <h2>7. Proveedores tecnológicos</h2>

          <p>
            Para el funcionamiento del proyecto
            se utilizan servicios externos
            relacionados con el alojamiento,
            la base de datos y los pagos.
          </p>

          <ul>
            <li>
              Vercel: alojamiento del frontend.
            </li>
            <li>
              Render: alojamiento del backend.
            </li>
            <li>
              Supabase PostgreSQL:
              almacenamiento de datos.
            </li>
            <li>
              Stripe: procesamiento de pagos
              de prueba.
            </li>
          </ul>

          <p>
            Estos proveedores pueden tratar
            información técnica o personal
            según los servicios utilizados
            y sus respectivas condiciones.
          </p>

          <p>
            Las posibles transferencias
            internacionales de datos deberán
            comprobarse conforme a las
            regiones y condiciones efectivas
            de los proveedores contratados.
          </p>
        </section>

        <section className="legal-card">
          <h2>8. Conservación de los datos</h2>

          <p>
            Los datos se conservarán durante
            el tiempo necesario para permitir
            el funcionamiento de la cuenta
            y de las funcionalidades
            demostrativas asociadas.
          </p>

          <p>
            Plazo o criterios concretos de
            conservación:
            [COMPLETAR SEGÚN LA POLÍTICA REAL
            DEL PROYECTO].
          </p>

          <p>
            Cuando los datos dejen de ser
            necesarios, se procederá a
            eliminarlos o anonimizarlos
            cuando corresponda.
          </p>
        </section>

        <section className="legal-card">
          <h2>9. Derechos de los usuarios</h2>

          <p>
            Los usuarios pueden solicitar,
            cuando corresponda:
          </p>

          <ul>
            <li>
              Acceso a sus datos personales.
            </li>
            <li>
              Rectificación de datos incorrectos.
            </li>
            <li>
              Supresión de sus datos.
            </li>
            <li>
              Limitación del tratamiento.
            </li>
            <li>
              Oposición al tratamiento.
            </li>
            <li>
              Portabilidad de sus datos.
            </li>
          </ul>

          <p>
            Para ejercer estos derechos,
            pueden contactar mediante:
            [EMAIL DE CONTACTO].
          </p>

          <p>
            La aplicación no dispone actualmente
            de una funcionalidad de eliminación
            automática de cuenta desde el perfil.
          </p>

          <p>
            Las solicitudes de supresión se
            gestionarán a través del responsable
            del proyecto.
          </p>

          <p>
            Los usuarios también pueden presentar
            una reclamación ante la Agencia
            Española de Protección de Datos.
          </p>

          <a
            href="https://www.aepd.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Agencia Española de Protección de Datos
          </a>
        </section>

        <section className="legal-card">
          <h2>10. Cookies y almacenamiento local</h2>

          <p>
            PadelRent utiliza almacenamiento
            local del navegador para mantener
            la sesión autenticada.
          </p>

          <p>
            Puedes encontrar más información
            en la Política de cookies.
          </p>

          <Link
            to="/cookies"
            className="legal-link"
          >
            Consultar la Política de cookies
          </Link>
        </section>

        <section className="legal-card">
          <h2>11. Actualizaciones</h2>

          <p>
            Esta política podrá actualizarse
            si se incorporan nuevas funcionalidades,
            proveedores o tratamientos de datos.
          </p>
        </section>
      </main>
    </div>
  );
}