import express from "express";
import { 
    enviarCodigo, 
    verificarCodigo, 
    cambiarContrasena 
} from "../controllers/recuperar.js";

const router = express.Router();

// POST /api/recuperar/enviar-codigo
router.post("/enviar-codigo", enviarCodigo);

// POST /api/recuperar/verificar-codigo
router.post("/verificar-codigo", verificarCodigo);

// POST /api/recuperar/cambiar-contrasena
router.post("/cambiar-contrasena", cambiarContrasena);

export default router;