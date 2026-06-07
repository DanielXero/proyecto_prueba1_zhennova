const { Pedido, DetallePedido, Producto, UsuarioProducto, FormaPago } = require('../models/associations');
const { sequelize } = require('../config/database');
const { PagoEfectivo, PagoTarjeta, PagoTransferencia } = require('../strategies/pagoStrategy');

const realizarPedido = async (req, res) => {
    // Iniciamos la transacción (Asegura que si algo falla, no se guarde nada a medias)
    const t = await sequelize.transaction();

    try {
        const { id_forma_pago } = req.body;
        const id_usuario = req.usuario.id_usuario;
        

        // 1. Obtener los productos del carrito del usuario
        const carrito = await UsuarioProducto.findAll({
            where: { id_usuario },
            include: [{ model: Producto }],
            transaction: t
        });

        if (carrito.length === 0) {
            throw new Error("El carrito está vacío");
        }

        // 2. Verificar stock y calcular subtotal base
        let subtotal = 0;
        for (let item of carrito) {
            if (item.Producto.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${item.Producto.nombre}`);
            }
            subtotal += item.cantidad * item.Producto.precio;
        }

        // 3. Aplicar Patrón Strategy según la forma de pago seleccionada
        let estrategia;
        if (id_forma_pago === 1) estrategia = new PagoEfectivo();
        else if (id_forma_pago === 2) estrategia = new PagoTarjeta();
        else estrategia = new PagoTransferencia();

        const monto_total = estrategia.calcularTotal(subtotal);

        // 4. Registrar el Pedido
        const pedido = await Pedido.create({
            total: monto_total,
            estado: 'pendiente',
            id_usuario,
            id_forma_pago
        }, { transaction: t });

        // 5. Registrar Detalles y Descontar Stock
        for (let item of carrito) {
            await DetallePedido.create({
                cantidad: item.cantidad,
                precio_unitario: item.Producto.precio,
                id_pedido: pedido.id_pedido,
                id_producto: item.id_producto
            }, { transaction: t });

            // Descontar stock del catálogo
            await Producto.update(
                { stock: item.Producto.stock - item.cantidad },
                { where: { id_producto: item.id_producto }, transaction: t }
            );
        }

        // 6. Vaciar el carrito
        await UsuarioProducto.destroy({
            where: { id_usuario },
            transaction: t
        });

        // Confirmar transacción
        await t.commit();
        res.status(201).json({ mensaje: "Pedido realizado con éxito", id_pedido: pedido.id_pedido });

    } catch (error) {
        // Revertir cambios si algo falló
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

const misPedidos = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const pedidos = await Pedido.findAll({
      where: { id_usuario },
      include: [
        {
          model: DetallePedido,
          include: [{ model: Producto, attributes: ['nombre', 'imagen_url'] }]
        },
        { model: FormaPago, attributes: ['nombre'] }
      ],
      order: [['fecha_creacion', 'DESC']]
    });
    res.json({ success: true, data: pedidos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al obtener pedidos' });
  }
};

module.exports = {
    realizarPedido,
    misPedidos
};