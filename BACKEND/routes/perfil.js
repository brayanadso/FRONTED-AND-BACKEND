// routes/perfil.js
import express from 'express';
import {
    obtenerPerfil,
    actualizarPerfil,
    eliminarCuenta
} from '../controllers/perfil.js';

const router = express.Router();

// 📍 GET - Obtener perfil por ID
router.get('/:id', obtenerPerfil);

// 📍 PUT - Actualizar perfil
router.put('/actualizar', actualizarPerfil);

// 📍 DELETE - Eliminar cuenta
router.delete('/eliminar', eliminarCuenta);

export default router;