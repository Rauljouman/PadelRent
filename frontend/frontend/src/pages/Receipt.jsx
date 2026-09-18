import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Mail,
  ReceiptText,
  User,
} from "lucide-react";
import { reservasApi } from "../api/reservasApi";
import "../styles/Receipt.css";

function formatFecha(fecha) {
  if (!fecha) return "No disponible";

  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrecio(valor) {
  if (valor === null || valor === undefined) return "0,00 €";

  return Number(valor).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

export default function Receipt() {
  const { id } = useParams();

  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarFactura = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await reservasApi.getFacturaPorReserva(id);
        setFactura(data);
      } catch (error) {
        setError(error.message || "No se pudo cargar el comprobante.");
      } finally {
        setLoading(false);
      }
    };

    cargarFactura();
  }, [id]);

  if (loading) {
    return (
      <section className="receipt-page">
        <div className="receipt-container">
          <div className="receipt-status-card">
            <div className="receipt-loader" />
            <p>Cargando comprobante...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="receipt-page">
        <div className="receipt-container">
          <div className="receipt-error-card">
            <h1>Comprobante</h1>
            <p>{error}</p>

            <Link to="/mis-reservas">
              <ArrowLeft size={17} />
              Volver a mis reservas
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="receipt-page">
      <div className="receipt-container">
        <Link to="/mis-reservas" className="receipt-back">
          <ArrowLeft size={17} />
          Volver a mis reservas
        </Link>

        <div className="receipt-card">
          <div className="receipt-header">
            <div>
              <span>Comprobante</span>
              <h1>{factura.numero}</h1>
            </div>

            <div className="receipt-header-icon">
              <ReceiptText size={30} />
            </div>
          </div>

          <div className="receipt-state">
            <CheckCircle2 size={18} />
            <span>{factura.estado}</span>
          </div>

          <div className="receipt-section">
            <h2>Datos del cliente</h2>

            <div className="receipt-info-grid">
              <div className="receipt-info-item">
                <User size={17} />
                <div>
                  <span>Cliente</span>
                  <strong>{factura.clienteNombre}</strong>
                </div>
              </div>

              <div className="receipt-info-item">
                <Mail size={17} />
                <div>
                  <span>Email</span>
                  <strong>{factura.clienteEmail}</strong>
                </div>
              </div>

              <div className="receipt-info-item">
                <CalendarDays size={17} />
                <div>
                  <span>Fecha de emisión</span>
                  <strong>{formatFecha(factura.fechaEmision)}</strong>
                </div>
              </div>

              <div className="receipt-info-item">
                <FileText size={17} />
                <div>
                  <span>Número</span>
                  <strong>{factura.numero}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="receipt-section">
            <h2>Resumen económico</h2>

            <div className="receipt-totals">
              <div>
                <span>Subtotal</span>
                <strong>{factura.subtotal}€</strong>
              </div>

              <div>
                <span>IVA</span>
                <strong>{factura.iva}€</strong>
              </div>

              <div className="receipt-total">
                <span>Total</span>
                <strong>{factura.total}.00€</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}