import express from 'express';
import { createPaciente, deletPacient, editPaciente, getPacientes } from '../controller/pacienteController/paciente.controller.js';
import { authMiddleware } from '../middleware/login.middleware.js';

const pacienteRouter = express.Router();

const permitirApenas = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !tiposPermitidos.includes(req.user.tipo_usuario)) {
            return res.status(403).json({ message: "Acesso negado. Esta ação é restrita a médicos e administradores." });
        }
        next();
    };
};

pacienteRouter.post('/', authMiddleware, permitirApenas('admin', 'medico'), createPaciente);
pacienteRouter.get('/', authMiddleware, permitirApenas('admin', 'medico', 'familiar'), getPacientes);
pacienteRouter.put('/:id', authMiddleware, permitirApenas('admin', 'medico'), editPaciente);
pacienteRouter.delete('/:id', authMiddleware, permitirApenas('admin', 'medico'), deletPacient);


export default pacienteRouter;