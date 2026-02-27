// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (stored && token) {
      const u = JSON.parse(stored);
      setUsuario({ ...u, token });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}