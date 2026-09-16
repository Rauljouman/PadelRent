import { Link } from "react-router-dom";
import { Zap, ShieldCheck, History, CircleDot } from "lucide-react";
import "./AuthLayout.css";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__body">
        <section className="auth-layout__hero">
          <Link to="/disponibilidad" className="auth-layout__brand">
            <div className="auth-layout__brand-icon">
              <CircleDot size={18} />
            </div>

            <span>
              Padel<span>Rent</span>
            </span>
          </Link>

          <div className="auth-layout__hero-content">
            <h1>
              Reserva tu pista de pádel <span>en segundos</span>
            </h1>

            <p>
              Disponibilidad en tiempo real, pago online y gestión de reservas
              desde un solo lugar.
            </p>

            <div className="auth-layout__benefits">
              <div className="auth-layout__benefit">
                <div className="auth-layout__benefit-icon">
                  <Zap size={18} />
                </div>

                <div>
                  <strong>Reserva rápida</strong>
                  <span>Elige pista y horario en segundos.</span>
                </div>
              </div>

              <div className="auth-layout__benefit">
                <div className="auth-layout__benefit-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>Pago seguro</strong>
                  <span>Pago online gestionado con Stripe.</span>
                </div>
              </div>

              <div className="auth-layout__benefit">
                <div className="auth-layout__benefit-icon">
                  <History size={18} />
                </div>

                <div>
                  <strong>Historial de reservas</strong>
                  <span>Consulta y gestiona tus reservas.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-layout__content">
          <div className="auth-layout__content-inner">
            <div className="auth-layout__header">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            <div className="auth-layout__card">{children}</div>

            {footerText && footerLinkText && footerLinkTo && (
              <p className="auth-layout__footer-link">
                {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
              </p>
            )}
          </div>
        </section>
      </div>

      <footer className="auth-layout__footer">
        <nav className="auth-layout__footer-links" aria-label="Enlaces legales">
          <Link to="/terms">Términos</Link>
          <span>·</span>
          <Link to="/privacy">Privacidad</Link>

          <Link to="/terms">Aviso legal</Link>
          <span>·</span>
          <Link to="/privacy">Cookies</Link>
        </nav>

        <p className="auth-layout__footer-copy">
          © 2026 PadelRent. Todos los derechos reservados.
        </p>

        <div className="auth-layout__footer-contact">
          <span>Calle Falsa, 138</span>
          <span>987654321</span>
        </div>
      </footer>
    </div>
  );
}