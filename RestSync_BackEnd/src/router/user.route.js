import express from 'express';
import { createUser, editUser, getUser } from '../controller/uerController/user.controller.js';
import { authMiddleware } from '../middleware/login.middleware.js';

const userRouter = express.Router();

const permitirApenas = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !tiposPermitidos.includes(req.user.tipo_usuario)) {
            return res.status(403).json({ message: "Acesso negado. Você não tem permissão para realizar esta ação." });
        }
        next();
    };
};

userRouter.post('/', authMiddleware, permitirApenas('admin', 'medico'), createUser);

userRouter.get('/', authMiddleware, permitirApenas('admin', 'medico'), getUser);

userRouter.put('/:id', authMiddleware, permitirApenas('admin', 'medico'), editUser);

export default userRouter;