import express from 'express';
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto, // ✅ añadido
  eliminarProducto    // ✅ añadido
} from '../controllers/producto.js';

const router = express.Router();

router.get("/",     obtenerProductos);   // público
router.post("/",    crearProducto);      // solo admin
router.put("/:id",  actualizarProducto); // ✅ solo admin
router.delete("/:id", eliminarProducto); // ✅ solo admin

export default router;