const express = require('express');

const eventoRoutes = require('./eventoRoutes');
const empresaRoutes = require('./empresaRoutes');
const categoriaEventoRoutes = require('./categoriaEventoRoutes');
const usuarioRoutes = require('./usuarioRoutes');

const router = express.Router();

const authRoutes = require('./authRoutes');
console.log('[routes/index.js] authRoutes importado:', typeof authRoutes);

router.use('/auth', (req, res, next) => {
    console.log(`[routes/index.js] Requisição para /auth: ${req.method} ${req.originalUrl}`);
    next();
}, authRoutes);

router.use('/auth', authRoutes);
router.use('/eventos', eventoRoutes); 
router.use('/empresas', empresaRoutes);
router.use('/categorias', categoriaEventoRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;