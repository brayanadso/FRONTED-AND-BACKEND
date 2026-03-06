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

// routes/perfil.js
import { verifyToken, verifyOwnerOrAdmin } from "../middlewares/auth_middlewares.js";

router.get("/:id",        verifyToken, verifyOwnerOrAdmin, obtenerPerfil);
router.put("/actualizar", verifyToken, verifyOwnerOrAdmin, actualizarPerfil);
router.delete("/eliminar",verifyToken, verifyOwnerOrAdmin, eliminarCuenta);