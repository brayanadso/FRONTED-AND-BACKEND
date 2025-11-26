import express from "express";
import cors from "cors";
import "./db/db.js";

import productosRouter from "./routes/productos.js";
import userRoutes from "./routes/User.js";
import { loginUsuario } from "./controllers/login.js";
import PerfilRouter from "./routes/perfil.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor funcionando con CORS y conectado a MongoDB 🚀");
});

// Rutas
app.use("/api/productos", productosRouter);
app.use("/api/users", userRoutes);
app.post("/api/login", loginUsuario);
app.use("/api/perfil", PerfilRouter); // ✅ CORREGIDO: Ahora usa el router completo

app.listen(8081, () => {
  console.log("🔥 Servidor corriendo en http://localhost:8081");
});