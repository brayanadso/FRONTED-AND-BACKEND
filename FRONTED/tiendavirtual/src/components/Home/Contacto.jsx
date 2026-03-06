import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contacto() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: ""
    });
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
        setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
        setTimeout(() => setEnviado(false), 4000);
    };

    // ✅ Información de la empresa
    const infoCards = [
        {
            icon: <MapPin className="w-6 h-6 text-white" />,
            titulo: "Dirección",
            lineas: ["Calle 3 #3-06", "Bogotá, Colombia"]
        },
        {
            icon: <Phone className="w-6 h-6 text-white" />,
            titulo: "Teléfono",
            lineas: ["3232392457"]
        },
        {
            icon: <Mail className="w-6 h-6 text-white" />,
            titulo: "Correo electrónico",
            lineas: ["TechStorePro@gmail.com"]
        },
        {
            icon: <Clock className="w-6 h-6 text-white" />,
            titulo: "Horario de atención",
            lineas: ["24/7", "Siempre disponibles para ti"]
        },
    ];

    return (
        <section id="contacto" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">

                {/* Título */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h2>
                    <p className="text-gray-600 text-lg">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">

                    {/* Info cards de la empresa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                        {infoCards.map((card, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{card.titulo}</h3>
                                    {card.lineas.map((linea, j) => (
                                        <p key={j} className="text-sm text-gray-600">{linea}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Formulario */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h3>

                        {enviado && (
                            <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
                                ✅ ¡Mensaje enviado correctamente! Te responderemos pronto.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input type="text" name="nombre" value={formData.nombre}
                                    onChange={handleChange} placeholder="Tu nombre completo" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                                <input type="email" name="email" value={formData.email}
                                    onChange={handleChange} placeholder="tu@email.com" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                <input type="text" name="asunto" value={formData.asunto}
                                    onChange={handleChange} placeholder="¿En qué podemos ayudarte?" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                <textarea name="mensaje" value={formData.mensaje}
                                    onChange={handleChange} placeholder="Escribe tu mensaje aquí..."
                                    required rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none" />
                            </div>

                            <button type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all">
                                <Send className="w-5 h-5" />
                                Enviar mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}