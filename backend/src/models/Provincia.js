const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Provincia = sequelize.define('Provincia', {
  id_provincia: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    allowNull: false 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'provincias',
  timestamps: false
});

module.exports = Provincia;