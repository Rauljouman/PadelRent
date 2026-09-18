import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleDot } from "lucide-react";
import "./Header.css";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 90) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={hidden ? "site-header site-header--hidden" : "site-header"}>
      <Link to="/" className="site-header__logo">
        <div className="site-header__logo-icon">
          <CircleDot size={18} />
        </div>

        <span>
          Padel<span>Rent</span>
        </span>
      </Link>

      <div className="site-header__actions">
        <Link to="/login" className="site-header__login">
          Iniciar sesión
        </Link>

        <Link to="/register" className="site-header__register">
          Registrarse
        </Link>
      </div>
    </header>
  );
}