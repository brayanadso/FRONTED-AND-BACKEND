import express from 'express';
import { loginUsuario } from '../controllers/login.js';    

const router = express.Router();

//Rutas para el login de usuario
router.post('/',loginUsuario)

export default router;