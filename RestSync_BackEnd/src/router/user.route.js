import express from 'express';
import { createUser, editUser, getUser, getUserById, deleteUser } from '../controller/uerController/user.controller.js';
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

// Get own profile or specific user (admin/medico only for others)
userRouter.get('/:id', authMiddleware, getUserById);

userRouter.put('/:id', authMiddleware, editUser);

// Admin-only: delete user
userRouter.delete('/:id', authMiddleware, permitirApenas('admin'), deleteUser);

export default userRouter;