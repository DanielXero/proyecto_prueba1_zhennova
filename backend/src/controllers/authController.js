const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models/associations');
const Joi = require('joi');
// Esquema para validar el registro de usuario
const registerSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 3 caracteres'
  }),
  apellido: Joi.string().max(100).optional().allow(null, ''),
  nombre_usuario: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'El nombre de usuario es obligatorio',
    'string.min': 'El nombre de usuario debe tener al menos 3 caracteres'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'string.empty': 'El email es obligatorio'
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/)
    .required()
    .messages({
      'string.empty': 'La contraseña es obligatoria',
      'string.pattern.base': 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número'
    }),
  nro_telefono: Joi.string().optional().allow(null, ''),
  id_direccion: Joi.number().integer().optional().allow(null)
});




// Registrar un nuevo usuario (cliente)
const registerController = async (req, res) => {
  try {
    // 1. Validar los datos de entrada con Joi
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
    }

    const { nombre, apellido, nombre_usuario, email, password, nro_telefono, id_direccion } = value;

    // 2. Verificar unicidad de email y nombre_usuario
    const existeEmail = await Usuario.findOne({ where: { email } });
    if (existeEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const existeUsuario = await Usuario.findOne({ where: { nombre_usuario } });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    // 3. Obtener el rol "cliente"
    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
    if (!rolCliente) {
      return res.status(500).json({ error: 'Rol cliente no encontrado en la base de datos' });
    }

    // 4. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido: apellido || null,
      nombre_usuario,
      email,
      password_hash: hashedPassword,
      nro_telefono: nro_telefono || null,
      id_rol: rolCliente.id_rol,
      id_direccion: id_direccion || null
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: nuevoUsuario.id_usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Iniciar sesión
// Esquema para validar el login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const loginController = async (req, res) => {
  try {
    // Validar login
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    const { email, password } = value;

    // Buscar usuario por email, incluyendo su rol
    const usuario = await Usuario.findOne({ where: { email }, include: Rol });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.Rol.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.Rol.nombre
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registerController, loginController };