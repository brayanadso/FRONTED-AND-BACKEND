import express from 'express';
import { crearProducto, obtenerProductos, eliminarProducto } from '../controllers/producto.js';

const router = express.Router();

// GET - Obtener todos los productos
router.get("/", obtenerProductos);

// POST - Crear nuevo producto
router.post("/", crearProducto);

// DELETE - Eliminar producto por ID de MongoDB
router.delete("/:id", eliminarProducto);

export default router;