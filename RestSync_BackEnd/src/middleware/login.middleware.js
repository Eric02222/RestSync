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
        
        console.log("--> Token decodificado com sucesso:", decoded);
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Sessão inválida ou expirada. Faça login novamente." });
    }
};