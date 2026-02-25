import express from "express";
import { loginUsuario } from "../controllers/login.js";

const router = express.Router();

// ✅ POST /api/login
router.post("/", loginUsuario);

export default router;