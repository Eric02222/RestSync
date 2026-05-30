import express from 'express';
import cors from 'cors';
import userRouter from './router/user.route.js';
import loginRouter from './router/login.route.js';
import pacienteRouter from './router/paciente.route.js';
import dadosVitaisRouter from './router/dadosVitais.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', userRouter);
app.use('/auth', loginRouter);
app.use('/pacientes', pacienteRouter);
app.use('/', dadosVitaisRouter);


export {app};