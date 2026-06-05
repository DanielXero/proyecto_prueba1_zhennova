const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Rol = sequelize.define('Rol', {
  id_rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: { isIn: [['cliente', 'admin']] } 
  }
}, { tableName: 'roles', timestamps: false });

module.exports = Rol;