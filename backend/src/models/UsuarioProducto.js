const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UsuarioProducto = sequelize.define("UsuarioProducto", {
    id_usuario_producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    id_producto: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 100 } },
    fecha_agregado: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: "usuario_producto",
    timestamps: false,
  }
);

module.exports = UsuarioProducto;