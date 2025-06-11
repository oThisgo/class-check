const express = require('express');
const categoriaController = require('../controllers/categoriaEventoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, categoriaController.createCategoria);
router.put('/:id', authMiddleware, categoriaController.updateCategoria);
router.delete('/:id', authMiddleware, categoriaController.deleteCategoria);

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);

module.exports = router;