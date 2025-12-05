import express from 'express';
import { crearPedido, } from '../controllers/pedidos.js';

const router = express.Router();

//crear un  nuevo pedido
router.post('/', crearPedido);



export default router;