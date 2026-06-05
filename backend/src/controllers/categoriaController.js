const Categoria = require('../models/Categoria');

const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json({ success: true, data: categorias });
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al obtener categorías' });
    }
};

module.exports = { listarCategorias };