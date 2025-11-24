import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const registrarUser = async (req, res) => {
  try {
    console.log("Datos recibidos del frontend:", req.body);

    const { Nombre, Apellido, Telefono, Correo, Password } = req.body; // ✅ Mayúsculas

    if (!Nombre || !Apellido || !Telefono || !Correo || !Password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existe = await User.findOne({ Correo }); // ✅ Mayúscula
    if (existe) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(Password, 10);

    const nuevo = new User({
      Nombre,      // ✅ Mayúscula
      Apellido,    // ✅ Mayúscula
      Telefono,    // ✅ Mayúscula
      Correo,      // ✅ Mayúscula
      Password: hashed
    });

    await nuevo.save();

    res.status(201).json({ 
      message: "Usuario registrado correctamente",
      usuario: {
        id: nuevo._id,
        Nombre: nuevo.Nombre,
        Correo: nuevo.Correo
      }
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).json({ message: "Error en registro", error: error.message });
  }
};