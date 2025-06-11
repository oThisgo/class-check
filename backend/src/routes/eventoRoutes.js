const express = require('express');
const eventoController = require('../controllers/eventoController');
const presencaRoutes = require('./presencaRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, eventoController.createEvento);

router.get('/', eventoController.getAllEventos);
router.get('/:eventoId', eventoController.getEventoById);

router.put('/:eventoId', authMiddleware, eventoController.updateEvento);

router.delete('/:eventoId', authMiddleware, eventoController.deleteEvento);

router.post('/:eventoId/qrcode', authMiddleware, eventoController.generateOrUpdateQRCodeToken);

router.use('/:eventoId/presenca', presencaRoutes);

router.use('/:eventoId/feedback', feedbackRoutes);

module.exports = router;