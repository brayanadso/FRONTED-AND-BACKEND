import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";
import { User, Mail, Phone, Save, Edit3, X, CheckCircle, AlertCircle } from "lucide-react";

export default function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        Nombre: "",
        Apellido: "",
        Correo: "",
        Telefono: ""
    });

    // ✅ Cargar usuario del localStorage
    useEffect(() => {
        const stored = localStorage.getItem("usuario");
        if (!stored) {
            navigate("/login");
            return;
        }
        const u = JSON.parse(stored);
        setUsuario(u);
        setFormData({
            Nombre: u.Nombre || "",
            Apellido: u.Apellido || "",
            Correo: u.Correo || "",
            Telefono: u.Telefono || ""
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.put(
                "http://localhost:8081/api/perfil/actualizar",
                { id: usuario._id, ...formData }
            );

            // ✅ Actualizar localStorage con los nuevos datos
            const actualizado = response.data.data;
            localStorage.setItem("usuario", JSON.stringify(actualizado));
            setUsuario(actualizado);
            setEditando(false);
            setMessage({ type: "success", text: "✅ Perfil actualizado correctamente" });

        } catch (error) {
            console.error("Error:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "❌ Error al actualizar perfil"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setEditando(false);
        setMessage({ type: "", text: "" });
        setFormData({
            Nombre: usuario.Nombre || "",
            Apellido: usuario.Apellido || "",
            Correo: usuario.Correo || "",
            Telefono: usuario.Telefono || ""
        });
    };

    if (!usuario) return null;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* Header tarjeta */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-6 shadow-xl">
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
                            {usuario.Nombre?.charAt(0).toUpperCase()}{usuario.Apellido?.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-2xl font-bold">{usuario.Nombre} {usuario.Apellido}</h1>
                        <p className="text-blue-100 text-sm mt-1">{usuario.Correo}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.rol === "admin"
                            ? "bg-yellow-400 text-yellow-900"
                            : "bg-white bg-opacity-20 text-white"
                        }`}>
                            {usuario.rol === "admin" ? "⚡ Administrador" : "👤 Usuario"}
                        </span>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Datos personales</h2>
                            {!editando && (
                                <button
                                    onClick={() => setEditando(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Editar
                                </button>
                            )}
                        </div>

                        {/* Mensaje */}
                        {message.text && (
                            <div className={`flex items-center gap-2 p-4 rounded-lg mb-6 text-sm ${
                                message.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                {message.type === "success"
                                    ? <CheckCircle className="w-4 h-4" />
                                    : <AlertCircle className="w-4 h-4" />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleGuardar} className="space-y-5">

                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1 text-gray-400" />
                                        Nombre
                                    </label>
                                    <input
                                        name="Nombre"
                                        value={formData.Nombre}
                                        onChange={handleChange}
                                        disabled={!editando}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg transition ${
                                            editando
                                            ? "border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1 text-gray-400" />
                                        Apellido
                                    </label>
                                    <input
                                        name="Apellido"
                                        value={formData.Apellido}
                                        onChange={handleChange}
                                        disabled={!editando}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg transition ${
                                            editando
                                            ? "border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Correo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1 text-gray-400" />
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    name="Correo"
                                    value={formData.Correo}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg transition ${
                                        editando
                                        ? "border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white"
                                        : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="Telefono"
                                    value={formData.Telefono}
                                    onChange={handleChange}
                                    disabled={!editando}
                                    placeholder="Número de teléfono"
                                    className={`w-full px-4 py-3 border rounded-lg transition ${
                                        editando
                                        ? "border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white"
                                        : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                />
                            </div>

                            {/* Botones edición */}
                            {editando && (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{loading ? "Guardando..." : "Guardar cambios"}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelar}
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}