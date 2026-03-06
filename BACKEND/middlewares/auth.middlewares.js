import jwt from "jsonwebtoken";

// ─────────────────────────────────────────────────────────────
// 1. verifyToken
//    Verifica que el request traiga un JWT válido en el header.
//    Uso: proteger cualquier ruta que requiera login.
//
//    Header esperado:
//      Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Token no proporcionado.",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded tiene: { id, rol, iat, exp }
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expirado. Por favor inicia sesión nuevamente.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Token inválido.",
        });
    }
};

// ─────────────────────────────────────────────────────────────
// 2. verifyAdmin
//    Verifica que el usuario autenticado tenga rol "admin".
//    Siempre debe usarse DESPUÉS de verifyToken.
//
//    Ejemplo:
//      router.get("/admin/usuarios", verifyToken, verifyAdmin, handler)
// ─────────────────────────────────────────────────────────────
export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "No autenticado.",
        });
    }

    if (req.user.rol !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado. Se requiere rol de administrador.",
        });
    }

    next();
};

// ─────────────────────────────────────────────────────────────
// 3. verifyOwnerOrAdmin
//    Verifica que el usuario sea el dueño del recurso (mismo id)
//    O que sea admin. Útil para rutas de perfil y pedidos.
//
//    El id del recurso puede venir de:
//      - req.params.id  (rutas GET /perfil/:id)
//      - req.body.id    (rutas PUT/DELETE con id en el body)
//
//    Ejemplo:
//      router.put("/perfil/actualizar", verifyToken, verifyOwnerOrAdmin, handler)
// ─────────────────────────────────────────────────────────────
export const verifyOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "No autenticado.",
        });
    }

    // El admin siempre pasa
    if (req.user.rol === "admin") {
        return next();
    }

    // Para usuario normal, comparar su id con el id del recurso
    const resourceId = req.params.id || req.body.id;

    if (!resourceId) {
        return res.status(400).json({
            success: false,
            message: "ID de recurso no proporcionado.",
        });
    }

    if (req.user.id !== resourceId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado. No tienes permiso para este recurso.",
        });
    }

    next();
};

// ─────────────────────────────────────────────────────────────
// 4. verifyTokenOptional
//    Como verifyToken pero NO falla si no hay token.
//    Útil para rutas públicas que cambian comportamiento
//    si el usuario está logueado.
// ─────────────────────────────────────────────────────────────
export const verifyTokenOptional = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(" ")[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        req.user = null;
        next();
    }
};