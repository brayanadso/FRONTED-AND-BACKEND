import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';

// ── Rutas ────────────────────────────────────────────────────────────────────
import ProductosRoute       from './routes/productos.js';
import UsersRoutes          from './routes/User.js';
import loginUsuarioRouter   from './routes/login.js';
import adminRoutes          from './routes/admin.js';
import obtenerPerfil        from './routes/perfil.js';
import pedidosRoutes        from './routes/pedidos.js';
import RecuperarPassword    from './routes/recuperar.js';

// ── Conectar BD ───────────────────────────────────────────────────────────────
connectDB();

const app = express();

// ═══════════════════════════════════════════════════════════════════
// VERIFICACIÓN DE VARIABLES DE ENTORNO
// ═══════════════════════════════════════════════════════════════════
console.log('\n✅ Variables de entorno:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado');

if (!process.env.JWT_SECRET) {
    console.error('\n❌ ERROR CRÍTICO: JWT_SECRET no está definido en .env');
    console.error('Agrega esta línea a tu archivo .env:');
    console.error('JWT_SECRET=adsotarde2025\n');
    process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════
// MIDDLEWARES — CORS siempre primero
// ═══════════════════════════════════════════════════════════════════
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ═══════════════════════════════════════════════════════════════════
// RUTAS
// ═══════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a TechStore Pro API',
        version: '2.0',
        endpoints: {
            public:    ['/api/login', '/api/Recuperar'],
            protected: ['/api/productos', '/api/users', '/api/perfil', '/api/pedidos', '/api/admin']
        }
    });
});

// Rutas públicas
app.use('/api/login',     loginUsuarioRouter);
app.use('/api/Recuperar', RecuperarPassword);

// Rutas protegidas
app.use('/api/productos', ProductosRoute);
app.use('/api/users',     UsersRoutes);
app.use('/api/perfil',    obtenerPerfil);
app.use('/api/pedidos',   pedidosRoutes);
app.use('/api/admin',     adminRoutes);

// ═══════════════════════════════════════════════════════════════════
// INICIO DEL SERVIDOR
// ═══════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log('\n' + '═'.repeat(50));
    console.log('🚀 Servidor corriendo exitosamente');
    console.log('═'.repeat(50));
    console.log(`🌐 URL:  http://localhost:${PORT}`);
    console.log('🔐 JWT:  Configurado correctamente');
    console.log('─'.repeat(50));
    console.log('📋 Rutas disponibles:');
    console.log('   • POST   /api/login               (pública)');
    console.log('   • POST   /api/Recuperar            (pública)');
    console.log('   • GET    /api/admin/dashboard      (solo admin con token)');
    console.log('   • GET    /api/productos            (protegida)');
    console.log('   • GET    /api/pedidos              (protegida)');
    console.log('═'.repeat(50) + '\n');
});