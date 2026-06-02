import { db } from '../../config/db.js';

export const enviarDadosVitais = async (req, res) => {
    try {
        const { paciente_id, frequencia_cardiaca, pressao_arterial, temperatura, data, hora } = req.body;

        if (!paciente_id) {
            return res.status(400).json({ message: "O ID do paciente é obrigatório." });
        }

        const dataAtual = data || new Date().toISOString().slice(0, 10); 
        const horaAtual = hora || new Date().toTimeString().slice(0, 8);  

        const [resultado] = await db.query(
            `INSERT INTO historico_dados_vitais (frequencia_cardiaca, pressao_arterial, temperatura, data, hora, paciente_id) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [frequencia_cardiaca || null, pressao_arterial || null, temperatura || null, dataAtual, horaAtual, paciente_id]
        );

        // 🚀 Nota para o Futuro: É exatamente aqui que dispararemos o Socket.io
        // io.to(`paciente_${paciente_id}`).emit('novoDadoVital', req.body);

        return res.status(201).json({ 
            message: "Dados vitais registrados com sucesso.", 
            id_historico: resultado.insertId 
        });

    } catch (error) {
        console.error("Erro ao registrar dados vitais:", error);
        return res.status(500).json({ message: "Erro interno ao processar dados do dispositivo." });
    }
};


export const buscarHistoricoPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;

        if (!paciente_id) {
            return res.status(400).json({ message: "ID do paciente não fornecido." });
        }

        if (req.user.tipo_usuario === 'familiar') {
            const [vinculo] = await db.query(
                `SELECT 1 FROM vinculo_usuario_paciente
                 WHERE paciente_id = ? AND usuario_id = ? LIMIT 1`,
                [paciente_id, req.user.id]
            );
            if (vinculo.length === 0) {
                return res.status(403).json({ message: "Acesso negado a este residente." });
            }
        }

        // Busca os últimos 50 
        const [historico] = await db.query(
            `SELECT id, frequencia_cardiaca, pressao_arterial, temperatura, data, hora 
             FROM historico_dados_vitais 
             WHERE paciente_id = ? 
             ORDER BY data DESC, hora DESC LIMIT 50`,
            [paciente_id]
        );

        return res.status(200).json({
            message: historico.length === 0
                ? "Nenhum histórico encontrado para este paciente."
                : "Histórico recuperado com sucesso.",
            dados: historico,
        });

    } catch (error) {
        console.error("Erro ao buscar histórico de dados vitais:", error);
        return res.status(500).json({ message: "Erro ao buscar histórico do paciente.", erro: error.message });
    }
};