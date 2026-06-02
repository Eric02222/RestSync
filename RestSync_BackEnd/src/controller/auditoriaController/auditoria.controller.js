import { db } from '../../config/db.js';

export const listarAuditoria = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                usuario_email AS usuario,
                tipo,
                descricao,
                ip,
                DATE_FORMAT(criado_em, '%Y-%m-%d %H:%i:%s') AS timestamp
            FROM auditoria
            ORDER BY criado_em DESC
            LIMIT 200
        `);

        return res.status(200).json({ data: rows });
    } catch (error) {
        console.error('Erro ao listar auditoria:', error);
        return res.status(500).json({ message: 'Erro ao buscar registros de auditoria.', data: [] });
    }
};
