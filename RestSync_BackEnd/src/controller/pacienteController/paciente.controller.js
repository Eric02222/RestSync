import { db } from "../../config/db.js";

export const createPaciente = async (req, res) => {
    try {
        const { nome, cpf, endereco, telefone, dados_vitais } = req.body;

        if (!nome || !cpf || !endereco || !telefone) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const [cpfExists] = await db.query("SELECT id FROM paciente WHERE cpf = ?", [cpf]);
        if (cpfExists.length > 0) {
            return res.status(400).json({ message: "CPF já cadastrado." });
        }

        const [result] = await db.query(
            "INSERT INTO paciente (nome, cpf, endereco, telefone, dados_vitais) VALUES (?, ?, ?, ?, ?)",
            [nome, cpf, endereco, telefone, JSON.stringify(dados_vitais || {})]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível criar o paciente.", error: error.message });
        }
        return res.status(201).json({ message: "Paciente criado com sucesso." });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar paciente.", error: error.message });
    }
};

export const getPacientes = async (req, res) => {
    try {
        const { tipo_usuario, id: usuarioId } = req.user;

        let query;
        let params = [];

        if (tipo_usuario === 'familiar') {
            // familiar sees only linked patients
            query = `
                SELECT p.id, p.nome, p.cpf, p.endereco, p.telefone, p.dados_vitais
                FROM paciente p
                INNER JOIN vinculo_usuario_paciente v ON v.paciente_id = p.id
                WHERE v.usuario_id = ?
            `;
            params = [usuarioId];
        } else {
            // admin and medico see all
            query = "SELECT id, nome, cpf, endereco, telefone, dados_vitais FROM paciente";
        }

        const [result] = await db.query(query, params);

        if (result.length === 0) {
            // Return empty array instead of 404 to avoid frontend errors
            return res.status(200).json({ message: "Nenhum paciente encontrado.", data: [] });
        }
        return res.status(200).json({ message: "Pacientes encontrados", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar pacientes.", error: error.message });
    }
};

export const editPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, endereco, telefone, dados_vitais } = req.body;
        if (!nome || !cpf || !endereco || !telefone) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }
        const [cpfExists] = await db.query("SELECT id FROM paciente WHERE cpf = ? AND id != ?", [cpf, id]);
        if (cpfExists.length > 0) {
            return res.status(400).json({ message: "CPF já cadastrado para outro paciente." });
        }
        const [result] = await db.query(
            `UPDATE paciente 
                SET nome = ?, cpf = ?, endereco = ?, telefone = ?, dados_vitais = ?
                WHERE id = ?`,
            [nome, cpf, endereco, telefone, JSON.stringify(dados_vitais || {}), id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }
        return res.status(200).json({ message: "Paciente atualizado com sucesso." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "CPF já cadastrado para outro paciente." });
        }
        return res.status(500).json({ message: "Erro ao editar paciente.", error: error.message });
    }
};

export const deletPacient = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do paciente é obrigatório.", success: false });
        }

        const [result] = await db.query("DELETE FROM paciente WHERE id = ?", [id])

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possivel deletar o paciente", success: false })
        }

        return res.status(200).json({ message: "Paciente deletado com sucesso", success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Não foi possivel deletar o paciente", error: error })
    }

}

