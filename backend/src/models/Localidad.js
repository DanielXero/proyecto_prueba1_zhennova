const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Localidad = sequelize.define('Localidad', {
  id_localidad: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    allowNull: false 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  id_provincia: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
}, {
  tableName: 'localidades',
  timestamps: false
});

module.exports = Localidad;