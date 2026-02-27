import Producto from "../models/Producto.js";

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const { productId, Nombre, Descripcion, Precio, Image } = req.body;
    const newProducto = new Producto({ productId, Nombre, Descripcion, Precio, Image });
    await newProducto.save();
    res.status(201).json({ message: "Producto ingresado" });
  } catch (error) {
    console.error("❌ Error al ingresar el producto", error.message);
    res.status(400).json({ message: "Error al ingresar el producto" });
  }
};

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const listarproductos = await Producto.find();
    res.json(listarproductos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// ✅ Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Precio, Image } = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { Nombre, Descripcion, Precio, Image },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado", producto: productoActualizado });
  } catch (error) {
    console.error("❌ Error al actualizar producto", error.message);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// ✅ Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Producto.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto", error.message);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

export default Producto;