const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');

// Middlewares
app.use(express.json());
app.use(cors());  

app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/carrito', carritoRoutes);


module.exports = app;