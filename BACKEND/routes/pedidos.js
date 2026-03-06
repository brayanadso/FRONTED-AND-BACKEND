
import express from 'express';
import {
    crearPedido,
    obtenerpedidousuarioId,  // ✅ CORREGIDO: rutas faltantes añadidas
    obtenerpedido,
    actualizarEstadopedido
} from '../controllers/pedidos.js';

const router = express.Router();

// Crear un nuevo pedido
router.post('/', crearPedido);

// ✅ CORREGIDO: obtener pedidos por usuario (faltaba esta ruta)
router.get('/usuario/:userId', obtenerpedidousuarioId);

// ✅ CORREGIDO: obtener un pedido por id (faltaba esta ruta)
router.get('/:id', obtenerpedido);

// ✅ CORREGIDO: actualizar estado del pedido (faltaba esta ruta)
router.put('/:id/estado', actualizarEstadopedido);

export default router;

// routes/pedidos.js
import { verifyToken, verifyAdmin } from "../middlewares/auth_middlewares.js";

router.post("/",          verifyToken, crearPedido);
router.get("/admin/todos",verifyToken, verifyAdmin, obtenerTodosPedidos); // ruta futura de admin