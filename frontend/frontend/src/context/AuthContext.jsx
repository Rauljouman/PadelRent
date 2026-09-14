import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

function tokenExpirado(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const fechaExpiracion = payload.exp * 1000;

    return Date.now() >= fechaExpiracion;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("padelrent_token"));
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const storedToken = localStorage.getItem("padelrent_token");
  const storedUser = localStorage.getItem("padelrent_user");

  if (storedToken && tokenExpirado(storedToken)) {
    localStorage.removeItem("padelrent_token");
    localStorage.removeItem("padelrent_user");
    setToken(null);
    setUser(null);
    setLoading(false);
    return;
  }

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);
}, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });

    localStorage.setItem("padelrent_token", data.token);
    localStorage.setItem(
      "padelrent_user",
      JSON.stringify({
        id: data.usuarioId,
        nombre: data.nombre,
        email: data.email,
      })
    );

    setToken(data.token);
    setUser({
      id: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
    });

    return data;
  };

  const updateUser = (updatedUser) => {
    const newUser = {
      ...user,
      ...updatedUser,
    };

    localStorage.setItem("padelrent_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const register = async (formData) => {
    const data = await authApi.register(formData);

    localStorage.setItem("padelrent_token", data.token);
    localStorage.setItem(
      "padelrent_user",
      JSON.stringify({
        id: data.usuarioId,
        nombre: data.nombre,
        email: data.email,
      })
    );

    setToken(data.token);
    setUser({
      id: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
    });

    return data;
  };

  const logout = () => {
    localStorage.removeItem("padelrent_token");
    localStorage.removeItem("padelrent_user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}