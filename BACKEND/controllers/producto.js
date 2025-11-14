import Producto from "../models/Producto.js"; 

export const crearProducto = async (requestAnimationFrame, res) => {
    try {
        const { productId, Nombre, DescripCion, Precio, Imagen } = req.body;
        const newProducto = new Producto ({ 
            productId, 
            Nombre, 
            DescripCion, 
            Precio, 
            Imagen 
        });
        await newProducto.save();
        res.status(201).json({message:"Producto ingresado"});
    } catch (error) {
        console.error(" ❌ Error al ingresar el producto ", error.message);
        res.status(400).json({
            message: "Error al ingresar el producto",
    });
    } 
};
//Traer los datos de la base de datos
export const obtenerProductos = async (req, res) =>{
    try {
        const listarproductos = await Producto.find();
        res.json(listarproductos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
}

export default Producto;

