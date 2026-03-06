import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ success: false, message: "No se proporcionó token." });
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        if (!token) return res.status(401).json({ success: false, message: "Token inválido." });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expirado." });
        return res.status(401).json({ success: false, message: "Token inválido." });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ success: false, message: "No autenticado." });
    if (req.usuario.rol !== "admin") return res.status(403).json({ success: false, message: "Se requieren permisos de administrador." });
    next();
};

export const verifyOwnerOrAdmin = (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ success: false, message: "No autenticado." });
    const idParam = req.params.id || req.body.id;
    if (req.usuario.rol === "admin" || req.usuario.id === idParam) return next();
    return res.status(403).json({ success: false, message: "No tienes permiso para este recurso." });
};
