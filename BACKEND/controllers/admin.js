// controllers/admin.js
import User from "../models/User.js";
import Producto from "../models/Producto.js";
import pedidos from "../models/pedidos.js";

// ✅ Dashboard - resumen general
export const getDashboard = async (req, res) => {
    try {
        const totalUsuarios  = await User.countDocuments();
        const totalProductos = await Producto.countDocuments();
        const totalPedidos   = await pedidos.countDocuments();
        const pedidosPendientes = await pedidos.countDocuments({ estado: "pendiente" });

        res.status(200).json({
            success: true,
            data: {
                totalUsuarios,
                totalProductos,
                totalPedidos,
                pedidosPendientes
            }
        });
    } catch (error) {
        console.error("❌ Error en dashboard:", error);
        res.status(500).json({ success: false, message: "Error al obtener datos del dashboard" });
    }
};

// ✅ Obtener todos los usuarios (sin contraseñas)
export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select("-Password");
        res.status(200).json({ success: true, data: usuarios });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener usuarios" });
    }
};

// ✅ Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await User.findByIdAndDelete(id);

        if (!eliminado) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar usuario" });
    }
};

// ✅ Cambiar rol de un usuario (user ↔ admin)
export const cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!["user", "admin"].includes(rol)) {
            return res.status(400).json({ success: false, message: "Rol inválido" });
        }

        const actualizado = await User.findByIdAndUpdate(
            id,
            { rol },
            { new: true }
        ).select("-Password");

        if (!actualizado) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        res.status(200).json({ success: true, message: "Rol actualizado", data: actualizado });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al cambiar rol" });
    }
};

// ✅ Obtener todos los pedidos (admin)
export const getAllPedidos = async (req, res) => {
    try {
        const todosPedidos = await pedidos.find().sort({ fecha: -1 });
        res.status(200).json({ success: true, data: todosPedidos });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener pedidos" });
    }
};

// ✅ Actualizar estado de un pedido (admin)
export const actualizarEstadoAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const validos = ["pendiente", "completado", "cancelado"];
        if (!validos.includes(estado)) {
            return res.status(400).json({ success: false, message: "Estado inválido" });
        }

        const pedidoActualizado = await pedidos.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ success: false, message: "Pedido no encontrado" });
        }

        res.status(200).json({ success: true, message: "Estado actualizado", data: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar estado" });
    }
};

// ✅ Eliminar un producto (admin)
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Producto.findByIdAndDelete(id);

        if (!eliminado) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        res.status(200).json({ success: true, message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar producto" });
    }
};

// ✅ Notificar al usuario que su pedido fue confirmado
export const notificarPedidoConfirmado = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidos.findById(id);
        if (!pedido) return res.status(404).json({ success: false, message: "Pedido no encontrado" });

        const usuario = await User.findById(pedido.userId);
        if (!usuario?.Correo) return res.status(404).json({ success: false, message: "Usuario sin correo" });

        const nodemailer = (await import("nodemailer")).default;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const fmt = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

        const productosHTML = pedido.productos.map(p => `
            <tr>
                <td style="padding:10px;border-bottom:1px solid #eee;">${p.nombre}</td>
                <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${p.cantidad}</td>
                <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${fmt(p.precio * p.cantidad)}</td>
            </tr>`).join("");

        await transporter.sendMail({
            from: `"TechStore Pro" <${process.env.EMAIL_USER}>`,
            to: usuario.Correo,
            subject: "🎉 ¡Tu pedido fue confirmado! - TechStore Pro",
            html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;">
                <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
                    <h1 style="color:white;margin:0;font-size:24px;">¡Pedido Confirmado! ✅</h1>
                    <p style="color:#bbf7d0;margin:8px 0 0;">TechStore Pro</p>
                </div>
                <div style="background:white;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <p style="color:#374151;font-size:16px;">Hola <strong>${usuario.Nombre}</strong>,</p>
                    <p style="color:#6b7280;">¡Buenas noticias! Tu pedido ha sido <strong style="color:#16a34a;">confirmado</strong> por nuestro equipo y está en proceso de envío.</p>

                    <div style="background:#f0fdf4;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #16a34a;">
                        <p style="margin:0;color:#166534;"><strong>N° de pedido:</strong> ${pedido._id}</p>
                        <p style="margin:8px 0 0;color:#166534;"><strong>Estado:</strong> ✅ Confirmado</p>
                    </div>

                    <h3 style="color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:10px;">Resumen del pedido</h3>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f3f4f6;">
                                <th style="padding:10px;text-align:left;color:#6b7280;">Producto</th>
                                <th style="padding:10px;text-align:center;color:#6b7280;">Cant.</th>
                                <th style="padding:10px;text-align:right;color:#6b7280;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>${productosHTML}</tbody>
                    </table>
                    <div style="text-align:right;margin-top:20px;padding-top:15px;border-top:2px solid #e5e7eb;">
                        <p style="font-size:20px;font-weight:bold;color:#16a34a;margin:0;">Total: ${fmt(pedido.total)}</p>
                    </div>

                    <div style="margin-top:30px;padding:15px;background:#eff6ff;border-radius:8px;border-left:4px solid #2563eb;">
                        <p style="margin:0;color:#1e40af;font-size:14px;">
                            📦 Pronto recibirás tu pedido.<br>
                            📞 ¿Dudas? Contáctanos respondiendo este correo.
                        </p>
                    </div>
                    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:30px;">© 2025 TechStore Pro. Todos los derechos reservados.</p>
                </div>
            </div>`
        });

        res.json({ success: true, message: "Correo de confirmación enviado" });
    } catch (error) {
        console.error("❌ Error al notificar:", error);
        res.status(500).json({ success: false, message: "Error al enviar notificación" });
    }
};