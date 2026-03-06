// routes/perfil.js
import express from 'express';
import {
    obtenerPerfil,
    actualizarPerfil,
    eliminarCuenta
} from '../controllers/perfil.js';
import { verifyToken, verifyOwnerOrAdmin } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// 📍 GET - Obtener perfil por ID
router.get('/:id',         verifyToken, verifyOwnerOrAdmin, obtenerPerfil);

// 📍 PUT - Actualizar perfil
router.put('/actualizar',  verifyToken, verifyOwnerOrAdmin, actualizarPerfil);

// 📍 DELETE - Eliminar cuenta
router.delete('/eliminar', verifyToken, verifyOwnerOrAdmin, eliminarCuenta);

export default router;