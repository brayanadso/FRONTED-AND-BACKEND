import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Correo: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "Usuarios");

export default User;
