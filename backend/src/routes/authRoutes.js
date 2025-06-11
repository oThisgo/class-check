const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

console.log('[authRoutes.js] Configurando rota POST /register');
router.post('/register', (req, res, next) => {
    console.log('[authRoutes.js] Rota POST /register ACESSADA!');
    next(); 
}, authController.register);