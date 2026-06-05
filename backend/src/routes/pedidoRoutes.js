
const express = require('express');
const router = express.Router();
const { realizarPedido } = require('../controllers/pedidoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Ruta protegida por JWT para confirmar la compra
router.post('/checkout', verificarToken, realizarPedido);

module.exports = router;