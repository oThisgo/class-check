const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); 
const jwtConfig = require('../config/jwt');

exports.register = async (req, res, next) => {
    const { nome, email, senha, empresa_id, telefone } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    try {
        // Verifica se já existe usuário com esse email
        const existingUser = await db.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            // Se for um usuário incompleto (valores genéricos), faz o upgrade
            const user = existingUser.rows[0];
            const isIncomplete = (!user.telefone || user.telefone === 'N/A') && (!user.empresa_id || user.empresa_id === null);
            if (isIncomplete) {
                const hashedPassword = await bcrypt.hash(senha, 10);
                const updatedUser = await db.query(
                    'UPDATE Usuarios SET nome = $1, senha_hash = $2, empresa_id = $3, telefone = $4, updated_at = CURRENT_TIMESTAMP WHERE email = $5 RETURNING id, nome, email, empresa_id, telefone',
                    [nome, hashedPassword, empresa_id, telefone, email]
                );
                return res.status(200).json(updatedUser.rows[0]);
            } else {
                return res.status(409).json({ message: 'Email já cadastrado.' });
            }
        }
        // Se não existe, cria novo usuário normalmente
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await db.query(
            'INSERT INTO Usuarios (nome, email, senha_hash, empresa_id, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, empresa_id, telefone',
            [nome, email, hashedPassword, empresa_id, telefone]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        next(error); 
    }
};

exports.login = async (req, res, next) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    try {
        const result = await db.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas (usuário não encontrado).' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas (senha incorreta).' });
        }

        const token = jwt.sign(
            { userId: user.id }, 
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        const { senha_hash, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        next(error); 
    }
};