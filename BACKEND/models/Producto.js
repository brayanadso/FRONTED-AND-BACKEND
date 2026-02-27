import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  productId:   { type: String, required: true, unique: true },
  Nombre:      { type: String, required: true },
  Descripcion: { type: String, required: true }, // ✅ corregido de DescripCion a Descripcion
  Precio:      { type: Number, required: true },
  Image:       { type: String, required: true }, // ✅ Base64 o URL de imagen
});

const Producto = mongoose.model("Productos", productoSchema, "Productos");

export default Producto;