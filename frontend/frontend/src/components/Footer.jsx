import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__links">
        <div>
          <Link to="/terms">Términos</Link>
          <span>·</span>
          <Link to="/privacy">Privacidad</Link>
        </div>

        <div>
          <Link to="/terms">Aviso legal</Link>
          <span>·</span>
          <Link to="/privacy">Cookies</Link>
        </div>
      </div>

      <p className="site-footer__copy">
        © 2026 PadelRent. Todos los derechos reservados.
      </p>

      <div className="site-footer__contact">
        <span>Calle Falsa, 138</span>
        <span>987654321</span>
      </div>
    </footer>
  );
}