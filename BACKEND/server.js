// server.js
import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';

// Importar rutas
import loginRoutes from './routes/login.js';
import perfilRoutes from './routes/perfil.js';
import productosRoutes from './routes/productos.js';
import usersRoutes from './routes/User.js';

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/login', loginRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/users', usersRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ 
        message: '✅ API funcionando correctamente',
        endpoints: {
            login: '/api/login',
            perfil: '/api/perfil',
            productos: '/api/productos',
            users: '/api/users'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ API disponible en http://localhost:${PORT}/api`);
});