import express from 'express';
import { login, logout } from '../controller/loginController/login.controller.js';
import { optionalAuth } from '../middleware/login.middleware.js';

const loginRouter = express.Router();

loginRouter.post('/login', login);
loginRouter.post('/logout', optionalAuth, logout);

export default loginRouter;