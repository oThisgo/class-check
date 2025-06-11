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
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await db.query(
            'INSERT INTO Usuarios (nome, email, senha_hash, empresa_id, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, empresa_id, telefone',
            [nome, email, hashedPassword, empresa_id, telefone]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        if (error.code === '23505') { 
             return res.status(409).json({ message: 'Email já cadastrado.' });
        }
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