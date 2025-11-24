import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },      // ✅ Mayúscula
  Apellido: { type: String, required: true },    // ✅ Mayúscula
  Telefono: { type: String, required: true },    // ✅ Mayúscula
  Correo: { type: String, required: true, unique: true },  // ✅ Mayúscula
  Password: { type: String, required: true },    // ✅ Mayúscula
});

const User = mongoose.models.User || mongoose.model("User", userSchema, "Usuarios");

export default User;