const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, 
  }
);


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con Sequelize (Zhennova DB)');
    
    
    
    await sequelize.sync({ force: false }); 
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };