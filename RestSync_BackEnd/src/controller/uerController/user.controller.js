import bcrypt from 'bcrypt';
import { db } from '../../config/db.js';

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


        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(senha, saltRounds);


        const [result] = await db.query( 
            "INSERT INTO usuario (nome, email, senha, cpf, tipo_usuario, crm) VALUES (?, ?, ?, ?, ?, ?)", 
            [nome, email, hashPassword, cpf, tipoFormatado, crm || null] 
        );
        
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível criar o usuário." });
        }

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
            return res.status(404).json({ message: "Nenhum usuário encontrado." });
        }

        return res.status(200).json({ message: "Usuários encontrados", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
};

export const editUser = async (req, res) => {
    try {
        const { id, nome, email, tipo_usuario } = req.body;
        if (!id || !nome || !email || !tipo_usuario) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const tipoFormatado = tipo_usuario.toLowerCase();

        const [result] = await db.query(
            `UPDATE usuario
                SET nome = ?, email = ?, tipo_usuario = ? 
                WHERE id = ?`, 
            [nome, email, tipoFormatado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        
        return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao editar usuário.", error: error.message });
    }
};
