import express from 'express';
import { registrarUser } from '../controllers/User.js';  


const router = express.Router();

//Rutas para registrar usuario

router.post('/register',registrarUser)

export default router;
    