const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Usuario = sequelize.define('Usuario', {
  id_usuario: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    allowNull: false 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  apellido: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  nro_telefono: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  nombre_usuario: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  id_rol: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1 
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  deletedAt: 'fecha_eliminacion',
  paranoid: true  
});

module.exports = Usuario;