import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// Almacenamiento temporal de códigos (en producción usa Redis o la BD)
const codigosRecuperacion = new Map();

// 1. Enviar código de recuperación
export const enviarCodigo = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ ok: false, mensaje: "Email requerido" });
    }

    try {
        // Verificar que el email existe en la base de datos
        const usuario = await User.findOne({ Correo: email.toLowerCase() });
        
        if (!usuario) {
            return res.status(404).json({ 
                ok: false, 
                mensaje: "No existe una cuenta con este correo electrónico" 
            });
        }

        // Generar código de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Guardar código con expiración de 10 minutos
        codigosRecuperacion.set(email.toLowerCase(), {
            codigo,
            expira: Date.now() + 10 * 60 * 1000 // 10 minutos
        });

        // Configurar transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Opciones del correo con HTML mejorado
        const mailOptions = {
            from: `"Sistema de Recuperación" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Código de recuperación de contraseña",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
                        <p style="color: #666; font-size: 16px;">Hola <strong>${usuario.Nombre}</strong>,</p>
                        <p style="color: #666; font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña.</p>
                        
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
                            <p style="color: #666; margin-bottom: 10px;">Tu código de verificación es:</p>
                            <h1 style="color: #4CAF50; letter-spacing: 8px; margin: 10px 0; font-size: 36px;">${codigo}</h1>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">⏰ Este código expirará en <strong>10 minutos</strong>.</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            Si no solicitaste este código, puedes ignorar este correo de forma segura.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(`✅ Código enviado a ${email}: ${codigo}`);

        res.json({ 
            ok: true, 
            mensaje: "Código enviado correctamente. Revisa tu email."
        });

    } catch (error) {
        console.error("❌ Error al enviar correo:", error);
        res.status(500).json({ 
            ok: false, 
            mensaje: "Error al enviar el correo. Intenta nuevamente." 
        });
    }
};

// 2. Verificar código
export const verificarCodigo = async (req, res) => {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
        return res.status(400).json({ 
            ok: false, 
            mensaje: "Email y código requeridos" 
        });
    }

    try {
        const datosRecuperacion = codigosRecuperacion.get(email.toLowerCase());

        if (!datosRecuperacion) {
            return res.status(404).json({ 
                ok: false, 
                mensaje: "Código no encontrado o expirado" 
            });
        }

        // Verificar si el código expiró
        if (Date.now() > datosRecuperacion.expira) {
            codigosRecuperacion.delete(email.toLowerCase());
            return res.status(400).json({ 
                ok: false, 
                mensaje: "El código ha expirado. Solicita uno nuevo." 
            });
        }

        // Verificar si el código coincide
        if (datosRecuperacion.codigo !== codigo.toString()) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: "Código incorrecto" 
            });
        }

        res.json({ 
            ok: true, 
            mensaje: "Código verificado correctamente"
        });

    } catch (error) {
        console.error("❌ Error al verificar código:", error);
        res.status(500).json({ 
            ok: false, 
            mensaje: "Error al verificar el código" 
        });
    }
};

// 3. Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
    const { email, codigo, nuevaContrasena } = req.body;

    if (!email || !codigo || !nuevaContrasena) {
        return res.status(400).json({ 
            ok: false, 
            mensaje: "Todos los campos son requeridos" 
        });
    }

    if (nuevaContrasena.length < 6) {
        return res.status(400).json({ 
            ok: false, 
            mensaje: "La contraseña debe tener al menos 6 caracteres" 
        });
    }

    try {
        const datosRecuperacion = codigosRecuperacion.get(email.toLowerCase());

        if (!datosRecuperacion || datosRecuperacion.codigo !== codigo.toString()) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: "Código inválido o expirado" 
            });
        }

        // Verificar expiración
        if (Date.now() > datosRecuperacion.expira) {
            codigosRecuperacion.delete(email.toLowerCase());
            return res.status(400).json({ 
                ok: false, 
                mensaje: "El código ha expirado" 
            });
        }

        // Verificar que el usuario existe
        const usuario = await User.findOne({ Correo: email.toLowerCase() });
        
        if (!usuario) {
            return res.status(404).json({ 
                ok: false, 
                mensaje: "Usuario no encontrado" 
            });
        }

        // Encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // Actualizar contraseña en MongoDB
        await User.findOneAndUpdate(
            { Correo: email.toLowerCase() },
            { Password: contrasenaEncriptada },
            { new: true }
        );

        // Eliminar código usado
        codigosRecuperacion.delete(email.toLowerCase());

        console.log(`✅ Contraseña actualizada para ${email}`);

        res.json({ 
            ok: true, 
            mensaje: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." 
        });

    } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        res.status(500).json({ 
            ok: false, 
            mensaje: "Error al cambiar la contraseña" 
        });
    }
};