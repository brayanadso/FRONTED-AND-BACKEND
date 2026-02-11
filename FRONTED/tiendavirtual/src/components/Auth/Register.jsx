import { useState } from "react";
import { Eye, EyeOff, UserPlus, Shield, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  // ✅ handleChange dentro del componente
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ handleSubmit dentro del componente
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      return setMessage({ 
        type: "error", 
        text: "Por favor completa todos los campos obligatorios" 
      });
    }

    if (formData.password !== formData.confirmPassword) {
      return setMessage({ 
        type: "error", 
        text: "Las contraseñas no coinciden" 
      });
    }

    if (formData.password.length < 6) {
      return setMessage({ 
        type: "error", 
        text: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    if (!formData.terms) {
      return setMessage({ 
        type: "error", 
        text: "Debes aceptar los términos y condiciones" 
      });
    }

    try {
      setLoading(true);

      // ✅ URL corregida y campos que coinciden con el backend
      const response = await axios.post(
        "http://localhost:8081/api/users/registro",
        {
          Nombre: formData.nombre,
          Apellido: formData.apellido,
          Telefono: formData.telefono,
          Correo: formData.email,
          Password: formData.password
        }
      );

      setMessage({
        type: "success",
        text: "✅ Cuenta creada exitosamente"
      });

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "❌ Error al registrar usuario"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Únete a TechStore Pro!
            </h2>
            <p className="text-gray-600">
              Crea tu cuenta y disfruta de ofertas exclusivas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre / Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre *"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido *"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico *"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Teléfono */}
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono (opcional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña (mínimo 6 caracteres) *"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña *"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">
                Acepto los términos y condiciones
              </span>
            </label>

            {/* Message */}
            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === "error" 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {message.text}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>

            <p className="text-center text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Tu información está protegida
        </div>
      </div>
    </main>
  );
}