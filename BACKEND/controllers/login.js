import bcrypt from "bcrypt";
import User from "../models/user.js";

export const loginUsuario = async (req, res) => {
  try {
    const { Correo, Password } = req.body; // ✅ Mayúsculas

    if (!Correo || !Password) {
      return res.status(400).json({ message: "Correo y contraseña obligatorios" });
    }

    const usuario = await User.findOne({ Correo }); // ✅ Mayúscula
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!usuario.Password) {
      return res.status(500).json({ message: "Error: contraseña no guardada" });
    }

    const valid = await bcrypt.compare(Password, usuario.Password); // ✅ Mayúsculas
    
    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Inicio de sesión correcto",
      usuario: {
        id: usuario._id,
        Nombre: usuario.Nombre,
        Correo: usuario.Correo
      }
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};