import express from "express";
import { obtenerPerfil, actualizarPerfil } from "../controllers/perfil.js";

const router = express.Router();

router.post("/obtener", obtenerPerfil);
router.put("/actualizar", actualizarPerfil);

export default router;


