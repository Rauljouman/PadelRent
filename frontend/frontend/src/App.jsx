import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Availability from "./pages/Availability";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
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

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>PadelRent</h1>
      <p>Bienvenido, {user?.nombre}</p>

      <nav style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link to="/disponibilidad">Disponibilidad</Link>
        <Link to="/mis-reservas">Mis reservas</Link>
        <Link to="/perfil">Perfil</Link>
      </nav>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/disponibilidad"
        element={
          <ProtectedRoute>
            <Availability />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-reservas"
        element={
          <ProtectedRoute>
            <MyBookings />
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