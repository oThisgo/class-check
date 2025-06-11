const db = require('../config/database');

exports.createCategoria = async (req, res, next) => {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });
    try {
        const result = await db.query(
            'INSERT INTO CategoriasEventos (nome, descricao) VALUES ($1, $2) RETURNING *',
            [nome, descricao]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ message: 'Nome da categoria já existe.' });
        next(error);
    }
};

exports.getAllCategorias = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM CategoriasEventos ORDER BY nome ASC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getCategoriaById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM CategoriasEventos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.updateCategoria = async (req, res, next) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });
    try {
        const result = await db.query(
            'UPDATE CategoriasEventos SET nome = $1, descricao = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [nome, descricao, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Categoria não encontrada.' });
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ message: 'Nome da categoria já existe.' });
        next(error);
    }
};

exports.deleteCategoria = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM CategoriasEventos WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Categoria não encontrada.' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};