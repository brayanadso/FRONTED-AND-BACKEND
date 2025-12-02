import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import user from '../models/User.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bo719914@gmail.com', // Reemplaza con tu correo electrónico
        pass: 'Brayan1282' // 
    }
});

// Función para enviar el correo de recuperación
const generarcodigo=() =>{
    return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos

}

export const solicitarcodigo = async (req, res) => {
     try  {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'El correo electrónico es obligatorio' 
        });
        }

        //buscar usuario
        const usuario = await user.findOne( { email } );
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generar código de recuperación
        const codigo = generarcodigo();

        // Guardar el código con expiracion de 15 minutos
        usuario.codigoRecuperacion = codigo;
        usuario.expiracionCodigo = Date.now() + 900000; // 15 minutos en milisegundos
        await usuario.save();
    
        const mailOptions = {
            from: 'osorioescobardavidfelipe@gmail.com',
            to: usuario.email,
            subject: 'Código de recuperación-TechStore',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;>
            <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #4F46E5; margin: 0;">TechStore Pro</h2>
            </div>

            <h3 style="color: #333;">Recuperacion de contraseña</h3>
            <p>Hola <strong> ${usuario.nombre}</strong>,</p>
            <p>Has solicitado recuperar tu contraseña. Utiliza el siguiente código para restablecerla:</p>
            <p> Tu código de recuperación es: </p>
            <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;">
            <h1 style="color: black;
            font-size: 36px;
            letter-spacing: 8px;
            margin: 0;
            font-family:monospace;">
            ${codigo}
            </h1>
            </div>
            <p style="color: #666; font-size: 14px;">
            Este codigo expirara en <strong>15 minutos</strong>.
            </p>
            
            <p style="color: #666; font-size: 14px;">
            Si no solicitaste este cambio, puedes ignorar este correo.
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

            <p style="color: #999; font-size: 12px; text-align: center;">
            &copy; 2025 TechStore Pro. Todos los derechos reservados.
            </p>
            </div>
            `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        console.log('Código de recuperación enviado a ${usuario.email}: ${codigo}');
        res.status(200).json({ message: 'Código de recuperación enviado al correo electrónico' 

        });
    } catch (error) {
        console.error('Error al solicitar el código de recuperación:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message 

        });
    }
};
//verificar codigo y cambiar contraseña
export const cambiarpassword  = async (req, res) => {
    try {
        const { email, codigo, nuevaPassword } = req.body;

        //validaciones
        if (!email || !codigo || !nuevaPassword) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres'
                
            });
        }
         //buscar usuario
        const usuario = await user.findOne( { email } );
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        





        //encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

        // actualizar contraseña y limpiar codigo
        usuario.password = hashedPassword;
        usuario.codigoRecuperacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();

        //email de confirmacion
        const mailOptions = {
            from: 'osorioescobardavidfelipe@gmail.com',
            to: usuario.email,
            subject: 'Contraseña cambiada - TechStore',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
            <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inlne-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;">
            <span style="color: white; font-size: 30px;">✓</span>
            </div>
            <h2 style="color: #4F46E5; margin: 0;">Contraseña Actualizada</h2>
            </div>

            <p>Hola <strong>${usuario.nombre}</strong>,</p>
            <p>Tu contraseña ha sido cambiada exitosamente.</p>
            <p> Ya puedes iniciar sesión con tu nueva contraseña.</p>

            <div style="text-align: center; margin: 30px 0;">
            <a href="https://127.0.0.1:5500/src/pages/login.html">
            style="background: linear-gradient(to right, #4F46E5, #7C3AED);
            color: white;
            padding: 12px 30px;
            border-radius: 8px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            Iniciar Sesión
            </a>
            </div>

            <p style="color: #dc2626; font-size: 14px;">
            Si no realizaste este cambio, por favor contacta a nuestro soporte inmediatamente.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; text-align: center;">
            &copy; 2025 TechStore Pro. Todos los derechos reservados.
            </p>
            </div>
            `
        };

        // enviar mensaje de contraseña actualizada
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Contraseña cambiada exitosamente'

         });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message 

        });
    }
};