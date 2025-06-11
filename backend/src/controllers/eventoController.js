const db = require('../config/database');
const crypto = require('crypto');

exports.createEvento = async (req, res, next) => {
    const { titulo, descricao, data_hora_inicio, data_hora_fim, localizacao, categoria_id, empresa_id, capacidade } = req.body;
    const organizador_id = req.user.userId; 

    if (!titulo || !data_hora_inicio) { 
        return res.status(400).json({ message: 'Título e data de início são obrigatórios.' });
    }

    try {
        const result = await db.query(
            `INSERT INTO Eventos (titulo, descricao, data_hora_inicio, data_hora_fim, localizacao, categoria_id, empresa_id, organizador_id, capacidade)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [titulo, descricao, data_hora_inicio, data_hora_fim, localizacao, categoria_id, empresa_id, organizador_id, capacidade]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.getAllEventos = async (req, res, next) => {
    try {
        const query = `
            SELECT e.*, c.nome as categoria_nome, u.nome as organizador_nome, emp.nome as empresa_nome
            FROM Eventos e
            LEFT JOIN CategoriasEventos c ON e.categoria_id = c.id
            LEFT JOIN Usuarios u ON e.organizador_id = u.id
            LEFT JOIN Empresas emp ON e.empresa_id = emp.id
            ORDER BY e.data_hora_inicio DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getEventoById = async (req, res, next) => {
    const { eventoId } = req.params; 
    try {
         const query = `
            SELECT e.*, c.nome as categoria_nome, u.nome as organizador_nome, u.email as organizador_email, emp.nome as empresa_nome
            FROM Eventos e
            LEFT JOIN CategoriasEventos c ON e.categoria_id = c.id
            LEFT JOIN Usuarios u ON e.organizador_id = u.id
            LEFT JOIN Empresas emp ON e.empresa_id = emp.id
            WHERE e.id = $1
        `;
        const result = await db.query(query, [eventoId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.updateEvento = async (req, res, next) => {
    const { eventoId } = req.params;
    const organizador_id_jwt = req.user.userId;
    const { titulo, descricao, data_hora_inicio, data_hora_fim, localizacao, categoria_id, empresa_id, capacidade } = req.body;

    if (!titulo || !data_hora_inicio) {
        return res.status(400).json({ message: 'Título e data de início são obrigatórios.' });
    }

    try {
        const eventoExistente = await db.query('SELECT organizador_id FROM Eventos WHERE id = $1', [eventoId]);
        if (eventoExistente.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        if (eventoExistente.rows[0].organizador_id !== organizador_id_jwt) {
            return res.status(403).json({ message: 'Apenas o organizador do evento pode atualizá-lo.' });
        }

        const result = await db.query(
            `UPDATE Eventos 
             SET titulo = $1, descricao = $2, data_hora_inicio = $3, data_hora_fim = $4, 
                 localizacao = $5, categoria_id = $6, empresa_id = $7, capacidade = $8, updated_at = CURRENT_TIMESTAMP
             WHERE id = $9
             RETURNING *`,
            [titulo, descricao, data_hora_inicio, data_hora_fim, localizacao, categoria_id, empresa_id, capacidade, eventoId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.deleteEvento = async (req, res, next) => {
    const { eventoId } = req.params;
    const organizador_id_jwt = req.user.userId;

    try {
        const eventoExistente = await db.query('SELECT organizador_id FROM Eventos WHERE id = $1', [eventoId]);
        if (eventoExistente.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        if (eventoExistente.rows[0].organizador_id !== organizador_id_jwt) {
            return res.status(403).json({ message: 'Apenas o organizador do evento pode deletá-lo.' });
        }

        const result = await db.query('DELETE FROM Eventos WHERE id = $1 RETURNING id', [eventoId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Evento não encontrado para deletar.' });
        }
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

exports.generateOrUpdateQRCodeToken = async (req, res, next) => {
    const { eventoId } = req.params;
    const organizador_id_jwt = req.user.userId;

    try {
        const eventoResult = await db.query('SELECT id, organizador_id FROM Eventos WHERE id = $1', [eventoId]);
        if (eventoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        if (eventoResult.rows[0].organizador_id !== organizador_id_jwt) {
             return res.status(403).json({ message: 'Apenas o organizador do evento pode gerar o QR code.' });
        }

        const qrToken = crypto.randomBytes(16).toString('hex');

        await db.query(
            'UPDATE Eventos SET qr_code_token = $1 WHERE id = $2',
            [qrToken, eventoId]
        );


        res.json({
            message: 'Token do QR Code gerado/atualizado.',
            qrCodeValue: qrToken,
            eventoId: eventoId, 
        });
    } catch (error) {
        next(error);
    }
};