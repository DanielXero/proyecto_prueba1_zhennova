const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const FormaPago = sequelize.define("FormaPago", {
    id_forma_pago: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(50), allowNull: false }
}, {
    tableName: "formas_pago",
    timestamps: false
});

module.exports = FormaPago;