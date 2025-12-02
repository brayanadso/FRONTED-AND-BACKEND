// routes/User.js
import express from 'express';
import { registrarUser, obtenerUsuarios } from '../controllers/User.js';

const router = express.Router();

router.post('/registro', registrarUser);
router.get('/', obtenerUsuarios);

export default router;