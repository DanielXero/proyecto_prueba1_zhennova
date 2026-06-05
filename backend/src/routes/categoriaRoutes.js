const express = require('express');
const { listarCategorias } = require('../controllers/categoriaController');

const router = express.Router();

// Ruta pública para obtener todas las categorías
router.get('/', listarCategorias);

module.exports = router;