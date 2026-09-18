import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  History,
  Ban,
  CalendarDays,
  MapPinned,
  CreditCard,
  FileText,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import heroImage from "../assets/fothero.png";
import courtImage from "../assets/campopadel.jpg";

import "../styles/Home.css";

const features = [
  {
    icon: <Zap size={21} strokeWidth={1.8} />,
    title: "Reserva rápida",
    description: "Elige pista y horario en menos de un minuto.",
  },
  {
    icon: <ShieldCheck size={21} strokeWidth={1.8} />,
    title: "Pago seguro",
    description: "Completa el pago de forma cómoda y segura.",
  },
  {
    icon: <History size={21} strokeWidth={1.8} />,
    title: "Historial de reservas",
    description: "Consulta tus reservas y comprobantes.",
  },
  {
    icon: <Ban size={21} strokeWidth={1.8} />,
    title: "Cancelación sencilla",
    description: "Cancela tus reservas pendientes cuando lo necesites.",
  },
];

const steps = [
  {
    icon: <CalendarDays size={20} strokeWidth={1.8} />,
    title: "Elige día y duración",
    description: "Selecciona la fecha y el horario que prefieras.",
  },
  {
    icon: <MapPinned size={20} strokeWidth={1.8} />,
    title: "Selecciona pista",
    description: "Consulta las pistas disponibles.",
  },
  {
    icon: <CreditCard size={20} strokeWidth={1.8} />,
    title: "Confirma tu reserva",
    description: "Completa el pago de forma segura.",
  },
  {
    icon: <FileText size={20} strokeWidth={1.8} />,
    title: "Consulta tu historial",
    description: "Accede a tus reservas y comprobantes.",
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <Header />

      <main>
        <section
          className="home-hero"
          style={{ "--hero-image": `url(${heroImage})` }}
        >
          <div className="home-hero__content">
            <span className="home-hero__eyebrow">Reservas online de pádel</span>

            <h1>
              Reserva tu pista de
              <br />
              pádel <span>en segundos</span>
            </h1>

            <p>
              Consulta disponibilidad, elige la pista que prefieras y gestiona
              tus reservas desde un solo lugar.
            </p>

            <div className="home-hero__actions">
              <Link to="/login" className="home-button home-button--primary">
                Ver disponibilidad
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="home-button home-button--secondary"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </section>

        <section className="home-features-section reveal-up">
          <div className="home-features-layout">
            <div className="home-features-left">
              <div className="home-section-heading home-section-heading--features">
                <h2>Todo lo que necesitas para jugar</h2>
                <p>
                  Una experiencia sencilla para consultar horarios, reservar y
                  gestionar tus partidos.
                </p>
              </div>

              <div className="home-feature-grid">
                {features.map((feature) => (
                  <article className="home-feature-card" key={feature.title}>
                    <div className="home-card-heading">
                      <div className="home-card-icon">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                    </div>

                    <p>{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="home-features-right">
              <img
                src={courtImage}
                alt="Pista de pádel"
                className="home-features-image"
              />
            </div>
          </div>
        </section>

        <section className="home-steps-section reveal-up">
          <div className="home-steps-container">
            <div className="home-section-heading">
              <h2>Cómo funciona</h2>
              <p>Cuatro pasos y a jugar.</p>
            </div>

            <div className="home-steps-grid">
              {steps.map((step, index) => (
                <article className="home-step-card" key={step.title}>
                  <div className="home-card-heading">
                    <div className="home-step-number">{index + 1}</div>

                    <div>
                      <div className="home-step-icon">{step.icon}</div>
                      <h3>{step.title}</h3>
                    </div>
                  </div>

                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-cta reveal-up">
          <h2>¿Listo para reservar tu pista?</h2>
          <p>Crea tu cuenta y empieza a reservar en menos de un minuto.</p>

          <div className="home-cta__actions">
            <Link to="/register">Crear cuenta</Link>
            <Link to="/login">Ver disponibilidad</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}