import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Availability from "./pages/Availability";
import BookingConfirm from "./pages/BookingConfirm";
import MyBookings from "./pages/MyBookings";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Receipt from "./pages/Receipt";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/disponibilidad" replace />;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>PadelRent</h1>
      <p>Reserva pistas de pádel online.</p>

      <Link to="/login">Iniciar sesión</Link>
      <br />
      <Link to="/register">Registrarse</Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/disponibilidad"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Availability />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BookingConfirm />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-reservas"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyBookings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pago/exito"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentSuccess />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pago/cancel"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentCancel />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/comprobante/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Receipt />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}