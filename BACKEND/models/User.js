
// backend/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Apellido: { type: String, required: true },
  Telefono: { type: Number, required: true, minlength: 12 },
  Correo: { type: String, required: true, unique: true },
  Password: { type: String, required: true, minlength: 10 }
});

// 👇 usa un nombre de modelo y colección correctos
const User = mongoose.model("User", userSchema, "Usuarios");

export default User;
