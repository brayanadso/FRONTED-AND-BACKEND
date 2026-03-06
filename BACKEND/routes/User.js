// routes/User.js
import express from 'express';
import { registrarUser, obtenerUsuarios } from '../controllers/User.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth_middlewares.js';
import User from '../models/User.js';

const router = express.Router();

// Pública - registro
router.post('/registro', registrarUser);

// Solo admin - obtener todos los usuarios
router.get('/', verifyToken, verifyAdmin, obtenerUsuarios);

// Hacer admin con clave secreta
router.put('/hacer-admin', async (req, res) => {
    const { email, secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: "Clave incorrecta" });
    }

    const usuario = await User.findOneAndUpdate(
        { Correo: email },
        { rol: "admin" },
        { new: true }
    );

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ success: true, message: "Usuario actualizado a admin" });
});

export default router;

