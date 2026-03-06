// routes/admin.js
import express from "express";
import {
    getDashboard, getAllUsuarios, eliminarUsuario, cambiarRol,
    getAllPedidos, actualizarEstadoAdmin, eliminarProducto,
    notificarPedidoConfirmado
} from "../controllers/admin.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/dashboard",              getDashboard);
router.get("/usuarios",               getAllUsuarios);
router.delete("/usuarios/:id",        eliminarUsuario);
router.patch("/usuarios/:id/rol",     cambiarRol);
router.get("/pedidos",                getAllPedidos);
router.patch("/pedidos/:id/estado",   actualizarEstadoAdmin);
router.post("/pedidos/:id/notificar", notificarPedidoConfirmado);
router.delete("/productos/:id",       eliminarProducto);

export default router;