const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Pedido = require('./Pedido');
const Direccion = require('./Direccion');
const Localidad = require('./Localidad');
const Provincia = require('./Provincia');
const DetallePedido = require('./DetallePedido');
const UsuarioProducto = require('./UsuarioProducto');
const FormaPago = require('./FormaPago');


// RELACIÓN ROL - USUARIO (1:N)

Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });


// RELACIÓN CATEGORÍA - PRODUCTO (1:N)

Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });


// RELACIÓN USUARIO - USUARIO_PRODUCTO (1:N) 

Usuario.hasMany(UsuarioProducto, { foreignKey: 'id_usuario' });
UsuarioProducto.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// RELACIÓN PRODUCTO - USUARIO_PRODUCTO (1:N)

Producto.hasMany(UsuarioProducto, { foreignKey: 'id_producto' });
UsuarioProducto.belongsTo(Producto, { foreignKey: 'id_producto' });


// RELACIÓN USUARIO - PEDIDO (1:N)

Usuario.hasMany(Pedido, { foreignKey: 'id_usuario' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_usuario' });


// RELACIONES PEDIDO - DETALLE_PEDIDO - PRODUCTO

Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });

Producto.hasMany(DetallePedido, { foreignKey: 'id_producto' });
DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto' });

// RELACIÓN FORMA_PAGO - PEDIDO (1:N)
FormaPago.hasMany(Pedido, { foreignKey: 'id_forma_pago' });
Pedido.belongsTo(FormaPago, { foreignKey: 'id_forma_pago' });



// RELACIONES PROVINCIA - LOCALIDAD (1:N)
Provincia.hasMany(Localidad, { foreignKey: 'id_provincia' });
Localidad.belongsTo(Provincia, { foreignKey: 'id_provincia' });

// RELACIONES LOCALIDAD - DIRECCIÓN (1:N)
Localidad.hasMany(Direccion, { foreignKey: 'id_localidad' });
Direccion.belongsTo(Localidad, { foreignKey: 'id_localidad' });

// RELACIONES USUARIO - DIRECCIÓN (1:N)
Usuario.hasMany(Direccion, { foreignKey: 'id_usuario' });
Direccion.belongsTo(Usuario, { foreignKey: 'id_usuario' });



module.exports = {
  Rol,
  Usuario,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
  UsuarioProducto,
  Direccion,
  Localidad,
  Provincia,
  FormaPago
};