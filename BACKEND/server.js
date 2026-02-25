console.log("🔥 ESTE ES MI SERVER CORRECTO");

import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';

import loginRoutes from './routes/login.js';
import perfilRoutes from './routes/perfil.js';
import productosRoutes from './routes/productos.js';
import usersRoutes from './routes/User.js';
import pedidosRoutes from './routes/pedidos.js';
import recuperarRoutes from './routes/recuperar.js';

const app = express();
const PORT = process.env.PORT || 8081;

// ✅ CORS - una sola vez, antes de todo
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
  res.send('¡Bienvenido!');
});

app.get('/api', (req, res) => {
  res.json({ message: '✅ API funcionando' });
});

// ✅ Rutas - montadas en /api, cada route define su propio subnombre
app.use('/api/login',    loginRoutes);
app.use('/api/users',    usersRoutes);
app.use('/api/perfil',   perfilRoutes);
app.use('/api/productos',productosRoutes);
app.use('/api/pedidos',  pedidosRoutes);
app.use('/api/recuperar',recuperarRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});