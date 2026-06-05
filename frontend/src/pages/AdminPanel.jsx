import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setCurrentProduct,
  clearCurrentProduct,
  clearError,
} from '../store/adminProductsSlice';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { products, loading, error, errorDetails, currentProduct } = useSelector((state) => state.adminProducts);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para manejar las categorías y la imagen
  const [categorias, setCategorias] = useState([]);
  const [imagenFile, setImagenFile] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
  });

  useEffect(() => {
    dispatch(fetchAdminProducts());
    
    
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categorias');
        if (res.data && res.data.success) {
          setCategorias(res.data.data); 
        }
      } catch (error) {
        console.error("Error al cargar las categorías desde el servidor:", error);
        setCategorias([]); 
      }
    };
    fetchCategorias();
  }, [dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        nombre: currentProduct.nombre,
        descripcion: currentProduct.descripcion || '',
        precio: currentProduct.precio,
        stock: currentProduct.stock,
        id_categoria: currentProduct.id_categoria,
      });
      setIsEditing(true);
      setShowModal(true);
    } else {
      setIsEditing(false);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: '',
      });
      setImagenFile(null);
    }
  }, [currentProduct]);

  const handleOpenCreate = () => {
    dispatch(clearCurrentProduct());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImagenFile(null); // Limpiar archivo seleccionado
    dispatch(clearCurrentProduct());
    dispatch(clearError());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagenFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Construir FormData para poder enviar archivos e información de texto juntos
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('precio', formData.precio);
    data.append('stock', formData.stock);
    data.append('id_categoria', formData.id_categoria);
    
    // Solo agregamos la imagen si el usuario seleccionó un archivo
    if (imagenFile) {
      data.append('imagen', imagenFile); 
    }

    if (isEditing) {
      await dispatch(updateProduct({ id: currentProduct.id_producto, productData: data }));
    } else {
      await dispatch(createProduct(data));
    }
    
    handleCloseModal();
    dispatch(fetchAdminProducts()); 
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      dispatch(deleteProduct(id)).then(() => {
        dispatch(fetchAdminProducts());
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Panel de Administración - Productos</h2>
        <Button variant="primary" onClick={handleOpenCreate}>
          <FaPlus className="me-2" /> Nuevo Producto
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
          <strong>{error}</strong>
          {errorDetails && errorDetails.length > 0 && (
            <ul className="mb-0 mt-2">
              {errorDetails.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          )}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-secondary">Cargando productos...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id_producto}>
                  <td>{prod.id_producto}</td>
                  <td>
                    {prod.imagen_url ? (
                      <img 
                        src={`http://localhost:3000${prod.imagen_url}`} 
                        alt={prod.nombre} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    ) : (
                      <span className="text-muted small">Sin imagen</span>
                    )}
                  </td>
                  <td>{prod.nombre}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.stock}</td>
                  <td>{prod.Categorium?.nombre || prod.id_categoria}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => dispatch(setCurrentProduct(prod))}>
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(prod.id_producto)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} className="bg-dark text-white">
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Previsualización de la imagen al editar */}
            {isEditing && currentProduct?.imagen_url && (
              <div className="mb-3 p-3 bg-secondary bg-opacity-25 rounded text-center border border-secondary">
                <Form.Label className="d-block text-white mb-2">Imagen Actual:</Form.Label>
                <img 
                  src={`http://localhost:3000${currentProduct.imagen_url}`} 
                  alt="Actual" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #555' }} 
                />
                <small className="d-block text-muted mt-2">
                  (Si no subís una nueva foto, se mantendrá esta)
                </small>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>{isEditing ? 'Reemplazar Imagen (Opcional)' : 'Imagen del Producto'}</Form.Label>
              <Form.Control
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;