import User from "../models/user.js";
import bcrypt from "bcrypt";

export const registrarUser = async (req, res) => {
  try {
    const { Nombre, Correo, Password } = req.body;

    if (!Nombre || !Correo || !Password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existe = await User.findOne({ Correo });
    if (existe) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashed = await bcrypt.hash(Password, 10);

    const nuevo = new User({
      Nombre,
      Correo,
      Password: hashed
    });

    await nuevo.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error en registro", error: error.message });
  }
};
