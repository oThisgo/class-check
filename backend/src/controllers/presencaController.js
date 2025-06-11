const db = require('../config/database');

exports.registerPresencaByQR = async (req, res, next) => {
    const { eventoId } = req.params; 
    const { qrToken } = req.body; 
    const usuarioId = req.user.userId; 

    if (!qrToken) {
        return res.status(400).json({ message: 'Token do QR code não fornecido no corpo da requisição (qrToken).' });
    }

    try {
        const eventoResult = await db.query(
            'SELECT qr_code_token, organizador_id FROM Eventos WHERE id = $1', // Pegar organizador_id também
            [eventoId]
        );

        if (eventoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }

        const evento = eventoResult.rows[0];

        if (!evento.qr_code_token || evento.qr_code_token !== qrToken) {
            return res.status(400).json({ message: 'Token do QR code inválido ou já utilizado/atualizado.' });
        }

        const insertResult = await db.query(
            'INSERT INTO RegistrosPresenca (evento_id, usuario_id, metodo) VALUES ($1, $2, $3) ON CONFLICT (evento_id, usuario_id) DO NOTHING RETURNING id',
            [eventoId, usuarioId, 'qr_code']
        );

        if (insertResult.rowCount === 0) {
            return res.status(200).json({ message: 'Presença já registrada anteriormente para este evento.' });
        }

        res.status(201).json({ message: 'Presença registrada com sucesso!' });
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ message: 'Usuário já registrado neste evento (conflito direto).' });
        }
        next(error);
    }
};

exports.getPresencasByEvento = async (req, res, next) => {
    const { eventoId } = req.params;
    const solicitanteId = req.user.userId;

    try {
        const eventoOrg = await db.query('SELECT organizador_id FROM Eventos WHERE id = $1', [eventoId]);
        if (eventoOrg.rows.length === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        if (eventoOrg.rows[0].organizador_id !== solicitanteId) {
            return res.status(403).json({ message: 'Apenas o organizador do evento pode ver a lista de participantes.' });
        }

        const result = await db.query(
            `SELECT u.id, u.nome, u.email, rp.data_hora_checkin, rp.metodo
             FROM RegistrosPresenca rp
             JOIN Usuarios u ON rp.usuario_id = u.id
             WHERE rp.evento_id = $1
             ORDER BY rp.data_hora_checkin ASC`,
            [eventoId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};