const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', authMiddleware, usuarioController.getMe);
router.put('/me', authMiddleware, usuarioController.updateMe);
router.delete('/me', authMiddleware, usuarioController.deleteMe);
router.get('/:id/eventos-criados', authMiddleware, usuarioController.getEventosCriados);
router.get('/:id/eventos-participados', authMiddleware, usuarioController.getEventosParticipados);
router.get('/email/:email', usuarioController.getByEmail);
router.put('/email/:email', usuarioController.updateByEmail);

module.exports = router;