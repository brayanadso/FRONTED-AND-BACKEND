// controllers/perfil.js
import User from '../models/User.js';

// 📌 Obtener perfil de usuario por ID
export const obtenerPerfil = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await User.findById(id).select('-Password');

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });

    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};

// 📌 Actualizar perfil de usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const { id, Nombre, Apellido, Correo, Telefono } = req.body;

        // Validar campos obligatorios
        if (!id || !Nombre || !Apellido || !Correo) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, Apellido y Correo son obligatorios'
            });
        }

        // Verificar si el correo ya existe (excepto el del mismo usuario)
        const correoExistente = await User.findOne({ 
            Correo: Correo,
            _id: { $ne: id }
        });

        if (correoExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está registrado por otro usuario'
            });
        }

        // Actualizar usuario
        const usuarioActualizado = await User.findByIdAndUpdate(
            id,
            {
                Nombre,
                Apellido,
                Correo,
                Telefono: Telefono || ''
            },
            { 
                new: true,
                runValidators: true
            }
        ).select('-Password');

        if (!usuarioActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: usuarioActualizado
        });

    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

// 📌 Eliminar cuenta de usuario
export const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario requerido'
            });
        }

        const usuarioEliminado = await User.findByIdAndDelete(id);

        if (!usuarioEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        console.log('✅ Cuenta eliminada:', usuarioEliminado.Correo);

        res.status(200).json({
            success: true,
            message: 'Cuenta eliminada correctamente'
        });

    } catch (error) {
        console.error('❌ Error al eliminar cuenta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cuenta',
            error: error.message
        });
    }
};