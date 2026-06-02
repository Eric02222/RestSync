import express from 'express';
import { authMiddleware } from '../middleware/login.middleware.js';
import {
    getVinculosByPaciente,
    criarVinculo,
    removerVinculo,
    getPacientesByFamiliar
} from '../controller/vinculoController/vinculo.controller.js';

const vinculoRouter = express.Router();

const permitirApenas = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !tiposPermitidos.includes(req.user.tipo_usuario)) {
            return res.status(403).json({ message: "Acesso negado." });
        }
        next();
    };
};

// Get all linkages of a specific patient (admin/medico)
vinculoRouter.get('/paciente/:paciente_id', authMiddleware, permitirApenas('admin', 'medico'), getVinculosByPaciente);

// Get all patients linked to the logged-in familiar
vinculoRouter.get('/meus-pacientes', authMiddleware, permitirApenas('familiar'), getPacientesByFamiliar);

// Create a new link (admin/medico)
vinculoRouter.post('/', authMiddleware, permitirApenas('admin', 'medico'), criarVinculo);

// Remove a link (admin/medico)
vinculoRouter.delete('/:paciente_id/:usuario_id', authMiddleware, permitirApenas('admin', 'medico'), removerVinculo);

export default vinculoRouter;
