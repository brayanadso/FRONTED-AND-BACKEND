import express from "express";
import { obtenerPerfil, actualizarPerfil, eliminarCuenta } from "../controllers/perfil.js";

const router = express.Router();

router.post("/obtener", obtenerPerfil);
router.put("/actualizar", actualizarPerfil);
router.delete("/eliminar", eliminarCuenta);

export default router;