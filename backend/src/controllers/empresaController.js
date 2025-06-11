const db = require('../config/database');

exports.createEmpresa = async (req, res, next) => {
    const { nome, cnpj, email } = req.body;
    if (!nome) return res.status(400).json({ message: 'Nome da empresa é obrigatório.' });
    try {
        const result = await db.query(
            'INSERT INTO Empresas (nome, cnpj, email) VALUES ($1, $2, $3) RETURNING *',
            [nome, cnpj, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { 
             return res.status(409).json({ message: 'CNPJ ou Email já cadastrado para outra empresa.' });
        }
        next(error);
    }
};

exports.getAllEmpresas = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM Empresas ORDER BY nome ASC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

exports.getEmpresaById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Empresas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.updateEmpresa = async (req, res, next) => {
    const { id } = req.params;
    const { nome, cnpj, email } = req.body;
    if (!nome) return res.status(400).json({ message: 'Nome da empresa é obrigatório.' });
    try {
        const result = await db.query(
            'UPDATE Empresas SET nome = $1, cnpj = $2, email = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [nome, cnpj, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
             return res.status(409).json({ message: 'CNPJ ou Email já está em uso por outra empresa.' });
        }
        next(error);
    }
};

exports.deleteEmpresa = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM Empresas WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};