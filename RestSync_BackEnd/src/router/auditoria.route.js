import express from 'express';
import { listarAuditoria } from '../controller/auditoriaController/auditoria.controller.js';
import { authMiddleware } from '../middleware/login.middleware.js';

const auditoriaRouter = express.Router();

const permitirApenas = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !tiposPermitidos.includes(req.user.tipo_usuario)) {
            return res.status(403).json({ message: 'Acesso negado.' });
        }
        next();
    };
};

auditoriaRouter.get('/', authMiddleware, permitirApenas('admin'), listarAuditoria);

export default auditoriaRouter;
