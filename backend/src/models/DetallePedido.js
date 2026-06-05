const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DetallePedido = sequelize.define("DetallePedido", {
    id_detalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_pedido: { type: DataTypes.UUID, allowNull: false },
    id_producto: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
  }, {
    tableName: "detalles_pedido",
    timestamps: false,
  }
);

module.exports = DetallePedido;