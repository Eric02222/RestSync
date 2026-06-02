import { db } from '../../config/db.js';

// Listar vínculos de um paciente
export const getVinculosByPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;

        const [result] = await db.query(
            `SELECT u.id, u.nome, u.email, u.tipo_usuario
             FROM vinculo_usuario_paciente v
             INNER JOIN usuario u ON u.id = v.usuario_id
             WHERE v.paciente_id = ?`,
            [paciente_id]
        );

        return res.status(200).json({ message: "Vínculos encontrados.", data: result });
    } catch (error) {
        console.error("Erro ao buscar vínculos:", error);
        return res.status(500).json({ message: "Erro ao buscar vínculos.", error: error.message });
    }
};

// Vincular um usuário a um paciente
export const criarVinculo = async (req, res) => {
    try {
        const { paciente_id, usuario_id } = req.body;

        if (!paciente_id || !usuario_id) {
            return res.status(400).json({ message: "paciente_id e usuario_id são obrigatórios." });
        }

        // Check if vinculo already exists
        const [existing] = await db.query(
            "SELECT * FROM vinculo_usuario_paciente WHERE paciente_id = ? AND usuario_id = ?",
            [paciente_id, usuario_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Vínculo já existe." });
        }

        await db.query(
            "INSERT INTO vinculo_usuario_paciente (paciente_id, usuario_id) VALUES (?, ?)",
            [paciente_id, usuario_id]
        );

        return res.status(201).json({ message: "Vínculo criado com sucesso." });
    } catch (error) {
        console.error("Erro ao criar vínculo:", error);
        return res.status(500).json({ message: "Erro ao criar vínculo.", error: error.message });
    }
};

// Remover vínculo
export const removerVinculo = async (req, res) => {
    try {
        const { paciente_id, usuario_id } = req.params;

        const [result] = await db.query(
            "DELETE FROM vinculo_usuario_paciente WHERE paciente_id = ? AND usuario_id = ?",
            [paciente_id, usuario_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vínculo não encontrado." });
        }

        return res.status(200).json({ message: "Vínculo removido com sucesso." });
    } catch (error) {
        console.error("Erro ao remover vínculo:", error);
        return res.status(500).json({ message: "Erro ao remover vínculo.", error: error.message });
    }
};

// Listar pacientes de um familiar (filtro por usuário logado)
export const getPacientesByFamiliar = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const [result] = await db.query(
            `SELECT p.id, p.nome, p.cpf, p.endereco, p.telefone, p.dados_vitais
             FROM vinculo_usuario_paciente v
             INNER JOIN paciente p ON p.id = v.paciente_id
             WHERE v.usuario_id = ?`,
            [usuarioId]
        );

        return res.status(200).json({ message: "Pacientes vinculados encontrados.", data: result });
    } catch (error) {
        console.error("Erro ao buscar pacientes vinculados:", error);
        return res.status(500).json({ message: "Erro ao buscar pacientes vinculados.", error: error.message });
    }
};
