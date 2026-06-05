const app = require('./app');
const { connectDB } = require('./config/database');
require('dotenv').config();

require('./models/associations');



const PORT = process.env.PORT || 3000;

const startServer = async () => {
    // Conectamos a la base de datos
    await connectDB();
    
    // Iniciamos el servidor
    app.listen(PORT, () => {
        console.log(`Servidor de Zhennova corriendo en http://localhost:${PORT}`);
    });
};

startServer();