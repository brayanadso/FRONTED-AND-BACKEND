

// routes/User.js
import express from 'express';
import { registrarUser, obtenerUsuarios } from '../controllers/User.js';

const router = express.Router();

router.post('/registro', registrarUser);  // ← Esto crea: POST /api/users/registro
router.get('/', obtenerUsuarios);

export default router;