// routes/pedidos.js
import express from 'express';
import {
    crearPedido,
    obtenerpedidousuarioId,
    obtenerpedido,
    actualizarEstadopedido
} from '../controllers/pedidos.js';

const router = express.Router();

// Crear un nuevo pedido
router.post('/', crearPedido);

// Obtener pedidos por usuario
router.get('/usuario/:userId', obtenerpedidousuarioId);

// Obtener un pedido por id
router.get('/:id', obtenerpedido);

// Actualizar estado del pedido
router.put('/:id/estado', actualizarEstadopedido);

export default router;