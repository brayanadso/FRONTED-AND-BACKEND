import bcrypt from "bcrypt";
import User from "../models/User.js";

export const loginUsuario = async (req, res) => {
  try {
    const { Correo, Password } = req.body;

    if (!Correo || !Password) {
      return res.status(400).json({ message: "Correo y contraseña obligatorios" });
    }

    const usuario = await User.findOne({ Correo });
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!usuario.Password) {
      return res.status(500).json({ message: "Error: contraseña no guardada" });
    }

    const valid = await bcrypt.compare(Password, usuario.Password);
    
    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ CORREGIDO: Devolver _id, Apellido y Telefono
    res.status(200).json({
      message: "Inicio de sesión correcto",
      usuario: {
        _id: usuario._id,           // ← Cambié "id" por "_id"
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido, // ← Agregado
        Correo: usuario.Correo,
        Telefono: usuario.Telefono  // ← Agregado
      }
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};