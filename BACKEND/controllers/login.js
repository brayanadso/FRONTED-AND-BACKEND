// controllers/login.js
import bcrypt from "bcrypt";
import User from "../models/user.js";

export const loginUsuario = async (req, res) => {
  try {
    const { Correo, Password } = req.body;

    // Validar que los campos existan
    if (!Correo || !Password) {
      return res.status(400).json({ message: "Correo y contraseña obligatorios" });
    }

    // Buscar usuario por Correo (coincide con tu modelo)
    const usuario = await User.findOne({ Correo });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña (campo Password en base de datos)
    const passwordValida = await bcrypt.compare(Password, usuario.Password);
    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Respuesta correcta
    res.status(200).json({
      message: "Inicio de sesión correcto",
      usuario: {
        id: usuario._id,
        Correo: usuario.Correo,
        Telefono: usuario.Telefono || null
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};
