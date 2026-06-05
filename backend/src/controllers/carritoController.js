
const { UsuarioProducto, Producto } = require('../models/associations');

// 1. Obtener todos los productos del carrito del usuario logueado
const obtenerCarrito = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;
        const carrito = await UsuarioProducto.findAll({
            where: { id_usuario },
            include: [{ model: Producto }]
        });
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

// 2. Agregar un producto al carrito (+create / +update)
const agregarAlCarrito = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;
        const { id_producto, cantidad } = req.body;

        // Verificamos si el producto ya está en el carrito
        let itemCarrito = await UsuarioProducto.findOne({
            where: { id_usuario, id_producto }
        });

        if (itemCarrito) {
            // Si ya existe, le sumamos la cantidad nueva (+update)
            itemCarrito.cantidad += (cantidad || 1);
            await itemCarrito.save();
        } else {
            // Si no existe, lo creamos (+create)
            itemCarrito = await UsuarioProducto.create({
                id_usuario,
                id_producto,
                cantidad: cantidad || 1
            });
        }
        res.status(201).json({ mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar al carrito' });
    }
};

// 3. Modificar la cantidad directamente (+update)
const actualizarCantidad = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;
        const { id_producto } = req.params;
        const { cantidad } = req.body;

        if (cantidad <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        const producto = await Producto.findByPk(id_producto);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (cantidad > producto.stock) {
            return res.status(400).json({ error: `Stock insuficiente. Solo hay ${producto.stock} unidades.` });
        }

        await UsuarioProducto.update(
            { cantidad },
            { where: { id_usuario, id_producto } }
        );
        res.json({ mensaje: 'Cantidad actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad' });
    }
};

// 4. Eliminar producto del carrito (+destroy)
const eliminarDelCarrito = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;
        const { id_producto } = req.params;

        await UsuarioProducto.destroy({
            where: { id_usuario, id_producto }
        });
        res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
};

module.exports = {
    obtenerCarrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito
};