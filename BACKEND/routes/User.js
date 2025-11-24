import express from 'express';
import { registrarUser } from '../controllers/User.js';  // ✅ Cambiar a registrarUser

const router = express.Router();

router.post('/register', registrarUser);  // ✅ Usar registrarUser

export default router;