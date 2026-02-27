// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, rolRequerido }) {
  const { usuario } = useAuth();

  // Si no hay usuario, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
}