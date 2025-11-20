// backend/controllers/User.js
import User from "../models/user.js"; 
import bcrypt from "bcrypt";

export const registrarUser = async (req, res) => {
  try {
    const { Nombre, Apellido, Telefono, Correo, Password } = req.body;

    // Validar campos obligatorios
    if (!Nombre || !Apellido || !Telefono || !Correo || !Password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existeUser = await User.findOne({ Correo });
    if (existeUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Crear usuario
    const nuevoUsuario = new User({
      Nombre,
      Apellido,
      Telefono,
      Correo,
      Password: hashedPassword,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el usuario",
      error: error.message
    });
  }
};
