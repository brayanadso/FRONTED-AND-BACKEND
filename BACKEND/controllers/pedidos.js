import pedidos from "../models/pedidos.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// ✅ Enviar correo de confirmación de pedido
const enviarCorreoConfirmacion = async (correoCliente, nombreCliente, pedido) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const productosHTML = pedido.productos.map(p => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.nombre}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:center;">${p.cantidad}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align:right;">
                ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p.precio)}
            </td>
        </tr>
    `).join("");

    const totalFormateado = new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0
    }).format(pedido.total);

    const mailOptions = {
        from: `"TechStore Pro" <${process.env.EMAIL_USER}>`,
        to: correoCliente,
        subject: "✅ Confirmación de tu pedido - TechStore Pro",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">¡Pedido Confirmado! 🎉</h1>
                <p style="color: #bfdbfe; margin: 8px 0 0;">TechStore Pro</p>
            </div>

            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <p style="color: #374151; font-size: 16px;">Hola <strong>${nombreCliente}</strong>,</p>
                <p style="color: #6b7280;">Tu pedido ha sido recibido y está siendo procesado. Aquí tienes el resumen:</p>

                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #374151;"><strong>N° de pedido:</strong> ${pedido._id}</p>
                    <p style="margin: 8px 0 0; color: #374151;"><strong>Estado:</strong> 
                        <span style="color: #f59e0b; font-weight: bold;">Pendiente</span>
                    </p>
                </div>

                <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Productos</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f3f4f6;">
                            <th style="padding: 10px; text-align: left; color: #6b7280;">Producto</th>
                            <th style="padding: 10px; text-align: center; color: #6b7280;">Cant.</th>
                            <th style="padding: 10px; text-align: right; color: #6b7280;">Precio</th>
                        </tr>
                    </thead>
                    <tbody>${productosHTML}</tbody>
                </table>

                <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 2px solid #e5e7eb;">
                    <p style="font-size: 20px; font-weight: bold; color: #2563eb; margin: 0;">
                        Total: ${totalFormateado}
                    </p>
                </div>

                <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                        📦 Te notificaremos cuando tu pedido sea enviado.<br>
                        📞 ¿Dudas? Contáctanos respondiendo este correo.
                    </p>
                </div>

                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
                    © 2025 TechStore Pro. Todos los derechos reservados.
                </p>
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

// ✅ Crear nuevo pedido + enviar correo
export const crearPedido = async (req, res) => {
    try {
        const { userId, productos, nombreCliente, telefono, total } = req.body;

        if (!userId || !productos || productos.length === 0) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const nuevoPedido = new pedidos({
            userId,
            productos,
            nombreCliente,
            telefono,
            total,
            estado: "pendiente"
        });

        await nuevoPedido.save();

        // ✅ Buscar correo del usuario y enviar confirmación
        try {
            const usuario = await User.findById(userId);
            if (usuario?.Correo) {
                await enviarCorreoConfirmacion(usuario.Correo, nombreCliente, nuevoPedido);
                console.log(`✅ Correo de confirmación enviado a ${usuario.Correo}`);
            }
        } catch (mailError) {
            console.error("⚠️ Pedido creado pero error al enviar correo:", mailError.message);
        }

        res.status(201).json({
            message: "Pedido creado con éxito",
            pedido: nuevoPedido
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Error al crear el pedido" });
    }
};

// Obtener pedidos por usuario
export const obtenerpedidousuarioId = async (req, res) => {
    try {
        const { userId } = req.params;
        const pedidosUsuario = await pedidos.find({ userId });
        res.json(pedidosUsuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos del usuario" });
    }
};

// Obtener un pedido por id
export const obtenerpedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidos.findById(id);
        if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
};

// Actualizar estado
export const actualizarEstadopedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const pedidoActualizado = await pedidos.findByIdAndUpdate(id, { estado }, { new: true });
        if (!pedidoActualizado) return res.status(404).json({ message: "Pedido no encontrado" });
        res.json({ message: "Estado actualizado", pedido: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado" });
    }
};