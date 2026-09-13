import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("padelrent_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("padelrent_user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, [token]);

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