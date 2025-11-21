import bcrypt from "bcrypt";
import User from "../models/user.js";

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

    const valid = await bcrypt.compare(Password, usuario.Password);
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
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};
