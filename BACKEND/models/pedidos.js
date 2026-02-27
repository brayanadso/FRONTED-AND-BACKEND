


import mongoose from "mongoose";

const pedidosSchema = new mongoose.Schema({
    // ✅ CORREGIDO: campo userId faltaba en el schema pero el controlador lo usa
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productos: [{
        productID: { type: String, required: true },
        cantidad: { type: Number, required: true, default: 1 },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true }
    }],
    nombreCliente: { type: String, required: true },
    telefono: { type: String, required: true },
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
    estado: {
        type: String,
        enum: ["pendiente", "completado", "cancelado"],
        default: "pendiente"
    }
});

export default mongoose.model("pedidos", pedidosSchema);