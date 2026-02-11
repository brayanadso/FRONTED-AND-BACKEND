import express from 'express';
import { crearProducto, obtenerProductos } from '../controllers/producto.js';

const router = express.Router();

//Rutas para registrar productos

router.post("/", crearProducto);

//Rutas para traer los productos

router.get("/", obtenerProductos);

export default router ;




