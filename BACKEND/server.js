// server.js
import express from 'express';
import cors from 'cors';
import './db/db.js'; // conexión a la base de datos
import productosRouter from './routes/productos.js'; // 👈 importa las rutas de productos
import UserRoutes from './routes/User.js';
import { loginUsuario }  from './controllers/login.js';

const app = express();

// Middleware
app.use(express.json()); // permite recibir datos JSON
app.use(cors()); // habilita CORS para todas las rutas

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor con CORS activado y productos disponibles 🚀');
});

// Usar las rutas de productos
app.use('/api/productos', productosRouter); // 👈 activa las rutas CRUD

// Iniciar servidor
app.listen(8081, () => console.log('✅ Servidor corriendo en http://localhost:8081'));

//Api de producto
app.use('/api/User', UserRoutes);

//Api de login
app.use('/api/login', loginUsuario);