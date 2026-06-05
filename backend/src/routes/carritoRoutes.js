const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { 
    obtenerCarrito, 
    agregarAlCarrito, 
    actualizarCantidad, 
    eliminarDelCarrito 
} = require('../controllers/carritoController');

// Todas las rutas requieren que el usuario esté logueado
router.use(verificarToken);

router.get('/', obtenerCarrito);
router.post('/agregar', agregarAlCarrito);
router.put('/actualizar/:id_producto', actualizarCantidad);
router.delete('/eliminar/:id_producto', eliminarDelCarrito);

module.exports = router;