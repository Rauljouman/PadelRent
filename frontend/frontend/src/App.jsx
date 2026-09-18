import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Home from "./pages/Home";
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
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/terms" element={<Terms />} />

      <Route path="/privacy" element={<Privacy />} />

      <Route path="*" element={<NotFound />} />

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
        path="/perfil"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
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