import Producto from "../models/Producto.js";

export const crearProducto = async (req, res) => {
    try {
        const { productId, Nombre, DescripCion, Descripcion, Precio, Imagen, Image } = req.body;

        // Aceptar ambas variantes por compatibilidad
        const descripcionFinal = Descripcion || DescripCion;
        const imagenFinal      = Image       || Imagen;

        console.log("📦 Datos recibidos:", {
            Nombre, descripcionFinal, Precio,
            imagenTipo: imagenFinal?.startsWith("data:") ? "base64" : "url",
            imagenLongitud: imagenFinal?.length
        });

        if (!Nombre || !descripcionFinal || !Precio || !imagenFinal) {
            return res.status(400).json({
                message: `Faltan campos:${!Nombre ? " Nombre" : ""}${!descripcionFinal ? " Descripcion" : ""}${!Precio ? " Precio" : ""}${!imagenFinal ? " Image" : ""}`
            });
        }

        if (imagenFinal.startsWith("data:") && imagenFinal.length > 500_000) {
            return res.status(400).json({
                message: "Imagen demasiado grande. Usa una URL (https://...) en lugar de subir el archivo."
            });
        }

        const idFinal = (productId && productId.trim())
            ? productId.trim()
            : `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        const newProducto = new Producto({
            productId:   idFinal,
            Nombre:      Nombre.trim(),
            Descripcion: descripcionFinal.trim(),
            Precio:      parseFloat(Precio),
            Image:       imagenFinal.trim()
        });

        await newProducto.save();
        console.log("✅ Producto guardado:", newProducto.Nombre);

        res.status(201).json({
            message: "Producto ingresado correctamente",
            producto: newProducto
        });

    } catch (error) {
        console.error("❌ Error completo:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "ID duplicado, intenta de nuevo." });
        }
        if (error.name === "ValidationError") {
            const campos = Object.keys(error.errors).join(", ");
            return res.status(400).json({ message: `Error de validación en: ${campos}` });
        }

        res.status(500).json({
            message: "Error interno al guardar el producto",
            detalle: error.message
        });
    }
};

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().select("-__v");
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Producto.findByIdAndDelete(id);

        if (!eliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        console.log("🗑️ Producto eliminado:", eliminado.Nombre);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
};

export default Producto;