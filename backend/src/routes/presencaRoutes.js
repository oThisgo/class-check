const express = require('express');
const presencaController = require('../controllers/presencaController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router({ mergeParams: true }); 

router.post('/checkin/qr', authMiddleware, presencaController.registerPresencaByQR);

router.get('/participantes', authMiddleware, presencaController.getPresencasByEvento);

module.exports = router;