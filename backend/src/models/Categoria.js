const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Categoria = sequelize.define('Categoria', {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  descripcion: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'categorias', timestamps: false });

module.exports = Categoria;