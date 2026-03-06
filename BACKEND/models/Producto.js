import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    productId:   { type: String, required: true, unique: true },
    Nombre:      { type: String, required: true },
    Descripcion: { type: String, required: true },
    Precio:      { type: Number, required: true },
    Image:       { type: String, required: true }
}, {
    collection: "Productos"
});

const Producto = mongoose.model("Productos", productoSchema);

export default Producto;