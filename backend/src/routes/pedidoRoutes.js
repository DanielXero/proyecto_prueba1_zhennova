
const express = require('express');
const router = express.Router();
const { realizarPedido, misPedidos } = require('../controllers/pedidoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Ruta protegida por JWT para confirmar la compra
router.post('/checkout', verificarToken, realizarPedido);
router.get('/mis-pedidos', verificarToken, misPedidos);

module.exports = router;