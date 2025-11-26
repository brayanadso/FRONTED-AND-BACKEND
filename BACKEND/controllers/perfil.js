// BACKEND/controllers/perfil.js
import User from "../models/User.js";

export const obtenerPerfil = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID de usuario obligatorio" });
        }

        const usuario = await User.findById(id).select("-Password");

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ usuario });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const { id, Correo, Telefono } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID de usuario obligatorio" });
        }

        const usuario = await User.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (Correo) usuario.Correo = Correo;
        if (Telefono) usuario.Telefono = Telefono;

        await usuario.save();

        res.status(200).json({
            message: "Perfil actualizado correctamente",
            usuario
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el perfil",
            error: error.message
        });
    }
};

// AGREGA ESTA FUNCIÓN AQUÍ ↓
export const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID de usuario obligatorio" });
        }

        const usuario = await User.findByIdAndDelete(id);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Cuenta eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la cuenta",
            error: error.message
        });
    }
};