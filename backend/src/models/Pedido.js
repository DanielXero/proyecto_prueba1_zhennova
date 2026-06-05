const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Pedido = sequelize.define("Pedido", {
    id_pedido: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    id_forma_pago: { type: DataTypes.INTEGER, allowNull: false },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: [["pendiente", "pagado", "enviado", "entregado", "cancelado"]], // Estados en español
      },
    },
  }, {
    tableName: "pedidos",
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
    deletedAt: "fecha_eliminacion",
    paranoid: true,
  }
);

module.exports = Pedido;