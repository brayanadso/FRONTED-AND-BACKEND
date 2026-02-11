import mongoose from "mongoose";
const productoSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true },
    DescripCion: { type: String, required: true },
    Precio: { type: Number, required: true },
    Imagen : { type: String, required: true }
});

//forzamos que se ingrese a la coleccion que esta creada

const Producto = mongoose.model("Productos", productoSchema, "Productos");

export default Producto;