const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models/associations');

// Middleware para proteger rutas (requiere token válido)
const verificarToken = async (req, res, next) => {
  let token;
  // 1. Extraer el token del header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'No autorizado, token no proporcionado' });
  }
  try {
    // 2. Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. Buscar el usuario en la base de datos (incluyendo su rol)
    const usuario = await Usuario.findByPk(decoded.id, { include: Rol });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    req.usuario = usuario;
    next(); // pasar al siguiente
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar que el usuario tenga rol de administrador
const verificarAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.Rol && req.usuario.Rol.nombre === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado, se requieren permisos de administrador' });
  }
};

module.exports = { verificarToken, verificarAdmin };