import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña obligatorios" });
    }

    // ✅ Buscar por "Correo" que es el campo en el modelo
    const usuario = await User.findOne({ Correo: email });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!usuario.Password) {
      return res.status(500).json({ message: "Error: contraseña no guardada" });
    }

    const valid = await bcrypt.compare(password, usuario.Password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Devolver token + datos del usuario
    res.status(200).json({
      message: "Inicio de sesión correcto",
      token,
      usuario: {
        _id: usuario._id,
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido,
        Correo: usuario.Correo,
        Telefono: usuario.Telefono,
        rol: usuario.rol,
      }
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};