// controllers/User.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registrarUser = async (req, res) => {
    try {
        const { Nombre, Apellido, Correo, Password, Telefono } = req.body;

        // Validar campos obligatorios
        if (!Nombre || !Apellido || !Correo || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, Apellido, Correo y Contraseña son obligatorios'
            });
        }

        // Verificar si el correo ya existe
        const usuarioExistente = await User.findOne({ Correo });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está registrado'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Crear nuevo usuario
        const nuevoUsuario = new User({
            Nombre,
            Apellido,
            Correo,
            Password: hashedPassword,
            Telefono: Telefono || ''
        });

        await nuevoUsuario.save();

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: nuevoUsuario
        });

    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-Password');
        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};