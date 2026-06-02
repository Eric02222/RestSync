import express from 'express';
import { authMiddleware } from '../middleware/login.middleware.js';
import { buscarHistoricoPaciente, enviarDadosVitais } from '../controller/dadosVitaisController/dadosVitais.controller.js';

const dadosVitaisRouter = express.Router();

const permitirApenas = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !tiposPermitidos.includes(req.user.tipo_usuario)) {
            return res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
        }
        next();
    };
};


dadosVitaisRouter.post('/dispositivo', authMiddleware, permitirApenas('admin', 'medico'), enviarDadosVitais);

dadosVitaisRouter.get('/historico/:paciente_id', authMiddleware, permitirApenas('admin', 'medico', 'familiar'), buscarHistoricoPaciente);

export default dadosVitaisRouter;