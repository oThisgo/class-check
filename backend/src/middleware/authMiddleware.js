const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token malformado.' });
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
            console.error('Erro na verificação do JWT:', err.message);
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }
        req.user = { userId: decoded.userId }; 
        return next();
    });
};