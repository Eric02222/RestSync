import { db } from '../config/db.js';

export async function ensureAuditoriaTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS auditoria (
            id INT NOT NULL AUTO_INCREMENT,
            usuario_id INT NULL,
            usuario_email VARCHAR(100) NULL,
            tipo VARCHAR(50) NOT NULL,
            descricao TEXT NOT NULL,
            ip VARCHAR(45) NULL,
            criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB
    `);
}

export function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return String(forwarded).split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || null;
}

export async function registrarAuditoria({ usuarioId, usuarioEmail, tipo, descricao, ip }) {
    try {
        await db.query(
            `INSERT INTO auditoria (usuario_id, usuario_email, tipo, descricao, ip)
             VALUES (?, ?, ?, ?, ?)`,
            [usuarioId ?? null, usuarioEmail ?? null, tipo, descricao, ip ?? null]
        );
    } catch (error) {
        console.error('Falha ao registrar auditoria:', error);
    }
}

export async function obterEmailUsuario(id) {
    if (!id) return null;
    const [rows] = await db.query('SELECT email FROM usuario WHERE id = ? LIMIT 1', [id]);
    return rows[0]?.email ?? null;
}
