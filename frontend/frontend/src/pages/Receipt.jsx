import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { reservasApi } from "../api/reservasApi";

export default function Receipt() {
  const { id } = useParams();

  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const data = await reservasApi.getFacturaPorReserva(id);
        setFactura(data);
      } catch (error) {
        setError(error.message || "No se pudo cargar el comprobante");
      } finally {
        setLoading(false);
      }
    };

    cargarFactura();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <p>Cargando comprobante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Comprobante</h1>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/mis-reservas">Volver a mis reservas</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1>Comprobante</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <p>
          <strong>Número:</strong> {factura.numero}
        </p>

        <p>
          <strong>Fecha emisión:</strong> {factura.fechaEmision}
        </p>

        <p>
          <strong>Cliente:</strong> {factura.clienteNombre}
        </p>

        <p>
          <strong>Email:</strong> {factura.clienteEmail}
        </p>

        <p>
          <strong>Subtotal:</strong> {factura.subtotal} €
        </p>

        <p>
          <strong>IVA:</strong> {factura.iva} €
        </p>

        <p>
          <strong>Total:</strong> {factura.total} €
        </p>

        <p>
          <strong>Estado:</strong> {factura.estado}
        </p>
      </div>

      <Link to="/mis-reservas">Volver a mis reservas</Link>
    </div>
  );
}