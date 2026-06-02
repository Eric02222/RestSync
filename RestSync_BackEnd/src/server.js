import { app } from "./app.js";
import dotenv from 'dotenv';
import { ensureAuditoriaTable } from './services/auditoria.service.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

ensureAuditoriaTable()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao preparar banco (auditoria):', err);
        process.exit(1);
    });