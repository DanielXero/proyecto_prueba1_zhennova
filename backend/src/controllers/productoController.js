const { Producto, Categoria } = require('../models/associations');
const Joi = require('joi');
const { Op } = require('sequelize');


const listarProductos = async (req, res) => {
    try {
        const { search, categoria } = req.query;
        let whereClause = {};
        
        if (search) {
            whereClause.nombre = { [Op.iLike]: `%${search}%` };
        }
        if (categoria) {
            whereClause.id_categoria = categoria;
        }

        const productos = await Producto.findAll({
            where: whereClause,
            include: [
                {
                    model: Categoria,
                    attributes: ['nombre']
                }
            ],
            attributes: ['id_producto', 'nombre', 'descripcion', 'precio', 'stock', 'id_categoria', 'imagen_url'],
            order: [['nombre', 'ASC']]
        });

        if (!productos || productos.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay productos disponibles con esos filtros',
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
// Obtener un producto por ID (público)
const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [{ model: Categoria, attributes: ["nombre"] }],
    });
    if (!producto) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: producto });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

// Esquema para crear un producto
const crearProductoSchema = Joi.object({
  nombre: Joi.string().min(3).max(200).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 200 caracteres",
  }),
  descripcion: Joi.string().optional().allow(null, ""),
  precio: Joi.number().positive().precision(2).required().messages({
    "number.base": "El precio debe ser un número",
    "number.positive": "El precio debe ser mayor a 0",
    "any.required": "El precio es obligatorio",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "El stock debe ser un número entero",
    "number.min": "El stock no puede ser negativo",
    "any.required": "El stock es obligatorio",
  }),
  id_categoria: Joi.number().integer().positive().required().messages({
    "number.base": "La categoría debe ser un número",
    "number.positive": "La categoría debe ser un ID válido",
    "any.required": "La categoría es obligatoria",
  }),
});

// Crear producto (solo admin) – con validación Joi
const crearProducto = async (req, res) => {
  try {
    // 1. Validar los datos de entrada con Joi
    const { error, value } = crearProductoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errores = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos", errores });
    }

    const { nombre, descripcion, precio, stock, id_categoria } = value;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    // 2. Verificar que la categoría exista
    const categoria = await Categoria.findByPk(id_categoria);
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: "La categoría especificada no existe",
      });
    }

    // 3. Crear el producto
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion: descripcion || null,
      precio,
      stock,
      id_categoria,
      imagen_url
    });

    res.status(201).json({
      success: true,
      data: nuevoProducto,
      message: "Producto creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

const actualizarProductoSchema = Joi.object({
  nombre: Joi.string().min(3).max(200).optional(),
  descripcion: Joi.string().optional().allow(null, ''),
  precio: Joi.number().positive().precision(2).optional(),
  stock: Joi.number().integer().min(0).optional(),
  id_categoria: Joi.number().integer().positive().optional()
}).min(1).unknown(true);; // al menos un campo para actualizar

// Actualizar producto (solo admin) – con validación Joi
const actualizarProducto = async (req, res) => {
  try {
    // 1. Validar los datos de entrada (pueden venir parciales)
    const { error, value } = actualizarProductoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errores = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ success: false, message: "Datos inválidos", errores });
    }

    // 2. Buscar el producto
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }

    const { nombre, descripcion, precio, stock, id_categoria } = value;

    // 3. Validar categoría si se envía
    if (id_categoria !== undefined) {
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        return res.status(400).json({
          success: false,
          message: "La categoría especificada no existe",
        });
      }
      producto.id_categoria = id_categoria;
    }

    // 4. Actualizar campos
    if (nombre !== undefined) producto.nombre = nombre;
    if (descripcion !== undefined) producto.descripcion = descripcion;
    if (precio !== undefined) producto.precio = precio;
    if (stock !== undefined) producto.stock = stock;

    if (req.file) {
      producto.imagen_url = `/uploads/${req.file.filename}`;
    }

    await producto.save();

    res.status(200).json({
      success: true,
      data: producto,
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

// Eliminar producto (solo admin – baja lógica)
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }
    await producto.destroy(); // paranoid: true -> soft delete
    res
      .status(200)
      .json({ success: true, message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
