// server.js
import express from "express";
import cors from "cors";
import "./db/db.js"; // Conexión a MongoDB

// Importar rutas
import productosRouter from "./routes/productos.js";
import userRoutes from "./routes/User.js";
import { loginUsuario } from "./controllers/login.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando con CORS y conectado a MongoDB 🚀");
});

// Rutas correctas
app.use("/api/productos", productosRouter);   // CRUD productos
app.use("/api/users", userRoutes);            // Registro de usuarios
app.post("/api/login", loginUsuario);         // Login

// Iniciar servidor SIEMPRE AL FINAL
app.listen(8081, () => {
  console.log("🔥 Servidor corriendo en http://localhost:8081");
});
