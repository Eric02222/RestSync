import bcrypt from 'bcrypt';
import { db } from '../../config/db.js';
import { getClientIp, obterEmailUsuario, registrarAuditoria } from '../../services/auditoria.service.js';

async function registrarAcaoUsuario(req, tipo, descricao) {
    const email = await obterEmailUsuario(req.user?.id);
    await registrarAuditoria({
        usuarioId: req.user?.id,
        usuarioEmail: email,
        tipo,
        descricao,
        ip: getClientIp(req),
    });
}

export const createUser = async (req, res) => {
    
    try {
        const { nome, email, senha, cpf, tipo_usuario, crm } = req.body;

        if (!nome || nome.length < 5 || !senha) {
            return res.status(400).json({ message: 'Campos inválidos. Nome deve conter ao menos 5 caracteres.' });
        }
        if (!email || email.length < 5 || !email.includes('@')) {
            return res.status(400).json({ message: "E-mail inválido." });
        }

        if (!tipo_usuario) {
            return res.status(400).json({ message: "O tipo de usuário é obrigatório." });
        }
        const tipoFormatado = tipo_usuario.toLowerCase();
        const tiposValidos = ["medico", "admin", "familiar"];
        
        if (!tiposValidos.includes(tipoFormatado)) {
            return res.status(400).json({ message: "Tipo de usuário inválido." });
        }

        if (req.user.tipo_usuario === 'medico' && tipoFormatado === 'admin') {
            return res.status(403).json({ message: "Apenas administradores podem criar contas admin." });
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(senha, saltRounds);


        const [result] = await db.query( 
            "INSERT INTO usuario (nome, email, senha, cpf, tipo_usuario, crm) VALUES (?, ?, ?, ?, ?, ?)", 
            [nome, email, hashPassword, cpf, tipoFormatado, crm || null] 
        );
        
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível criar o usuário." });
        }

        await registrarAcaoUsuario(req, 'cadastro_usuario', `Usuário "${email}" cadastrado`);

        return res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "CPF ou E-mail já cadastrado." });
        }
        return res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const [result] = await db.query("SELECT id, nome, email, cpf, tipo_usuario, crm FROM usuario");

        if (result.length === 0) {
            return res.status(200).json({ message: "Nenhum usuário encontrado.", data: [] });
        }

        return res.status(200).json({ message: "Usuários encontrados", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const targetId = parseInt(id, 10);
        const requesterId = req.user.id;
        const role = req.user.tipo_usuario;

        if (role !== 'admin' && role !== 'medico' && requesterId !== targetId) {
            return res.status(403).json({ message: "Acesso negado." });
        }

        const [result] = await db.query(
            "SELECT id, nome, email, cpf, tipo_usuario, crm FROM usuario WHERE id = ?",
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.status(200).json({ message: "Usuário encontrado", data: result[0] });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
};

export const editUser = async (req, res) => {
    try {
        // Accept id from params (route /:id) or from body (legacy)
        const id = req.params.id || req.body.id;
        const { nome, email, tipo_usuario, senha } = req.body;

        if (!id || !nome || !email) {
            return res.status(400).json({ message: "Campos obrigatórios: id, nome e email." });
        }

        const targetId = parseInt(id, 10);
        const isAdmin = req.user.tipo_usuario === 'admin';
        const isSelf = req.user.id === targetId;

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: "Você só pode editar seu próprio perfil." });
        }

        let tipoFormatado = null;
        if (tipo_usuario) {
            const tipo = tipo_usuario.toLowerCase();
            const tiposValidos = ['medico', 'admin', 'familiar'];
            if (!tiposValidos.includes(tipo)) {
                return res.status(400).json({ message: "Tipo de usuário inválido." });
            }
            if (!isAdmin) {
                return res.status(403).json({ message: "Apenas administradores podem alterar o tipo de usuário." });
            }
            tipoFormatado = tipo;
        }

        if (senha) {
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(senha, saltRounds);

            const [result] = await db.query(
                `UPDATE usuario SET nome = ?, email = ?, senha = ?${tipoFormatado ? ', tipo_usuario = ?' : ''} WHERE id = ?`,
                tipoFormatado
                    ? [nome, email, hashPassword, tipoFormatado, id]
                    : [nome, email, hashPassword, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
        } else {
            const [result] = await db.query(
                `UPDATE usuario SET nome = ?, email = ?${tipoFormatado ? ', tipo_usuario = ?' : ''} WHERE id = ?`,
                tipoFormatado
                    ? [nome, email, tipoFormatado, id]
                    : [nome, email, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
        }

        await registrarAcaoUsuario(req, 'edicao_usuario', `Perfil de "${email}" atualizado`);
        
        return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "E-mail já cadastrado para outro usuário." });
        }
        return res.status(500).json({ message: "Erro ao editar usuário.", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do usuário é obrigatório." });
        }

        // Prevent deleting the requester's own account
        if (parseInt(id) === req.user?.id) {
            return res.status(400).json({ message: "Você não pode excluir sua própria conta." });
        }

        const [alvo] = await db.query('SELECT email FROM usuario WHERE id = ? LIMIT 1', [id]);
        if (alvo.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const [result] = await db.query("DELETE FROM usuario WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        await registrarAcaoUsuario(req, 'exclusao_usuario', `Usuário "${alvo[0].email}" removido do sistema`);

        return res.status(200).json({ message: "Usuário excluído com sucesso.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir usuário.", error: error.message });
    }
};
