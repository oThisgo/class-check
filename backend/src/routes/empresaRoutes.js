const express = require('express');
const empresaController = require('../controllers/empresaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, empresaController.createEmpresa);
router.get('/', empresaController.getAllEmpresas);
router.get('/:id', empresaController.getEmpresaById); 
router.put('/:id', authMiddleware, empresaController.updateEmpresa);
router.delete('/:id', authMiddleware, empresaController.deleteEmpresa);

module.exports = router;