import { createContext, useContext, useEffect, useState } from "react";

import { authApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("padelrent_token");
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("padelrent_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("padelrent_token");
    const storedUser = localStorage.getItem("padelrent_user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({
      email,
      password,
    });

    const userData = {
      id: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
    };

    localStorage.setItem("padelrent_token", data.token);
    localStorage.setItem("padelrent_user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);

    return data;
  };

  const register = async (formData) => {
    const data = await authApi.register(formData);

    const userData = {
      id: data.usuarioId,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
    };

    localStorage.setItem("padelrent_token", data.token);
    localStorage.setItem("padelrent_user", JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("padelrent_token");
    localStorage.removeItem("padelrent_user");

    setToken(null);
    setUser(null);
  };

  const updateUser = (newUserData) => {
    const updatedUser = {
      ...user,
      ...newUserData,
    };

    localStorage.setItem("padelrent_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}