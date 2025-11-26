import express from 'express';
import { registrarUser } from '../controllers/User.js';  // ✅ Cambiar a registrarUser

const router = express.Router();

router.post('/register', registrarUser);  // ✅ Usar registrarUser

export default router;

// Importa la nueva función
import { obtenerPerfil, actualizarPerfil, eliminarCuenta } from "../controllers/perfil.js";

// Agrega esta nueva ruta
router.delete("/eliminar", eliminarCuenta);