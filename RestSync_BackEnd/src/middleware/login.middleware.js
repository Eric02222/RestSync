import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: "Token não fornecido." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'milionario_rico');
        
        req.user = {
            id: decoded.sub, 
            tipo_usuario: decoded.tipo_usuario,
        };
        
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Sessão inválida ou expirada. Faça login novamente." });
    }
};

/** Token opcional — usado no logout para não bloquear encerramento de sessão */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'milionario_rico');
        req.user = {
            id: decoded.sub,
            tipo_usuario: decoded.tipo_usuario,
        };
    } catch {
        // segue sem usuário
    }
    next();
};