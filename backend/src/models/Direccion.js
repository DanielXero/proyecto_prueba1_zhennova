const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Direccion = sequelize.define(
  "Direccion",
  {
    id_direccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    calle: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    nro_calle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    piso: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    cod_postal: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    id_localidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "direcciones",
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
  },
);

module.exports = Direccion;
