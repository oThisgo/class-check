const db = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res, next) => {
    const usuarioId = req.user.userId;
    try {
        const result = await db.query(
            'SELECT id, nome, email, telefone, empresa_id, created_at, updated_at FROM Usuarios WHERE id = $1',
            [usuarioId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.updateMe = async (req, res, next) => {
    const usuarioId = req.user.userId;
    const { nome, email, telefone, empresa_id } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }

    try {
        const result = await db.query(
            `UPDATE Usuarios 
             SET nome = $1, email = $2, telefone = $3, empresa_id = $4, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $5 
             RETURNING id, nome, email, telefone, empresa_id`,
            [nome, email, telefone, empresa_id, usuarioId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'usuarios_email_key') {
            return res.status(409).json({ message: 'Este email já está em uso por outro usuário.' });
        }
        next(error);
    }
};

exports.deleteMe = async (req, res, next) => {
    const usuarioId = req.user.userId;
    try {
        const result = await db.query('DELETE FROM Usuarios WHERE id = $1 RETURNING id', [usuarioId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

exports.getEventosCriados = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Eventos WHERE organizador_id = $1 ORDER BY data_hora_inicio DESC', [id]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getEventosParticipados = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT e.*
             FROM Eventos e
             JOIN RegistrosPresenca rp ON e.id = rp.evento_id
             WHERE rp.usuario_id = $1
             ORDER BY e.data_hora_inicio DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};