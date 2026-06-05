const express = require('express');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');
const { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productoController');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();


// Rutas públicas
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
// Rutas protegidas (solo admin)
router.post('/', verificarToken, verificarAdmin, upload.single('imagen'), crearProducto);
router.put('/:id', verificarToken, verificarAdmin, upload.single('imagen'), actualizarProducto);
router.delete('/:id', verificarToken, verificarAdmin, eliminarProducto);




module.exports = router;