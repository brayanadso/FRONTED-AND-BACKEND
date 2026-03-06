console.log("🔥 ESTE ES MI SERVER CORRECTO");

import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';

import loginRoutes    from './routes/login.js';
import perfilRoutes   from './routes/perfil.js';
import productosRoutes from './routes/productos.js';
import usersRoutes    from './routes/User.js';
import pedidosRoutes  from './routes/pedidos.js';
import recuperarRoutes from './routes/recuperar.js';

const app  = express();
const PORT = process.env.PORT || 8081;

// ✅ CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Rutas
app.get('/', (req, res) => res.send('¡Bienvenido!'));
app.get('/api', (req, res) => res.json({ message: '✅ API funcionando' }));

app.use('/api/login',     loginRoutes);
app.use('/api/users',     usersRoutes);
app.use('/api/perfil',    perfilRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos',   pedidosRoutes);
app.use('/api/recuperar', recuperarRoutes);

// ✅ Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// ✅ Primero conectar a MongoDB, LUEGO levantar el servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });