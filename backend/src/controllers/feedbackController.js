const db = require('../config/database');

exports.submitFeedback = async (req, res, next) => {
    const { eventoId } = req.params; 
    const usuarioId = req.user.userId;
    const { avaliacao, comentario } = req.body;

    if (avaliacao === undefined || avaliacao === null) {
        return res.status(400).json({ message: 'Avaliação é obrigatória.' });
    }
    if (avaliacao < 1 || avaliacao > 5) {
        return res.status(400).json({ message: 'Avaliação deve ser entre 1 e 5.' });
    }

    try {
        const participacao = await db.query(
            'SELECT id FROM RegistrosPresenca WHERE evento_id = $1 AND usuario_id = $2',
            [eventoId, usuarioId]
        );
        if (participacao.rows.length === 0) {
            return res.status(403).json({ message: 'Você precisa ter participado do evento para deixar um feedback.' });
        }

        const result = await db.query(
            'INSERT INTO FeedbackEventos (evento_id, usuario_id, avaliacao, comentario) VALUES ($1, $2, $3, $4) ON CONFLICT (evento_id, usuario_id) DO UPDATE SET avaliacao = EXCLUDED.avaliacao, comentario = EXCLUDED.comentario, updated_at = CURRENT_TIMESTAMP RETURNING *',
            [eventoId, usuarioId, avaliacao, comentario]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Feedback já enviado para este evento por este usuário (conflito).' });
        }
        next(error);
    }
};

exports.getFeedbackByEvento = async (req, res, next) => {
    const { eventoId } = req.params;
    const solicitanteId = req.user.userId;
    try {
        const eventoOrg = await db.query('SELECT organizador_id FROM Eventos WHERE id = $1', [eventoId]);
        if (eventoOrg.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        if (eventoOrg.rows[0].organizador_id !== solicitanteId) {
            return res.status(403).json({ message: 'Apenas o organizador do evento pode ver os feedbacks.' });
        }

        const result = await db.query(
            `SELECT f.*, u.nome as usuario_nome, u.email as usuario_email 
             FROM FeedbackEventos f
             JOIN Usuarios u ON f.usuario_id = u.id
             WHERE f.evento_id = $1 
             ORDER BY f.data_hora_feedback DESC`,
            [eventoId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};