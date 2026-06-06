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
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { products, loading, error, errorDetails, currentProduct } = useSelector((state) => state.adminProducts);

  // Estados locales para UI
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [imagenFile, setImagenFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Estados para búsqueda, filtro y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Estados para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
  });

  // Cargar productos y categorías al montar
  useEffect(() => {
    dispatch(fetchAdminProducts());
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categorias');
        if (res.data && res.data.success) {
          setCategorias(res.data.data);
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, [dispatch]);

  // Manejar edición (cuando se selecciona un producto)
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        nombre: currentProduct.nombre,
        descripcion: currentProduct.descripcion || '',
        precio: currentProduct.precio,
        stock: currentProduct.stock,
        id_categoria: currentProduct.id_categoria,
      });
      setPreviewImage(currentProduct.imagen_url ? `http://localhost:3000${currentProduct.imagen_url}` : null);
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
      setPreviewImage(null);
    }
  }, [currentProduct]);

  // Filtrar productos localmente
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria =
      filterCategoria === '' || prod.id_categoria === parseInt(filterCategoria);
    return matchesSearch && matchesCategoria;
  });

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoria]);

  const handleOpenCreate = () => {
    dispatch(clearCurrentProduct());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImagenFile(null);
    setPreviewImage(null);
    dispatch(clearCurrentProduct());
    dispatch(clearError());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('precio', formData.precio);
    data.append('stock', formData.stock);
    data.append('id_categoria', formData.id_categoria);
    if (imagenFile) data.append('imagen', imagenFile);

    let result;
    if (isEditing) {
      result = await dispatch(
        updateProduct({ id: currentProduct.id_producto, productData: data })
      );
    } else {
      result = await dispatch(createProduct(data));
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(isEditing ? 'Producto actualizado' : 'Producto creado');
      handleCloseModal();
      dispatch(fetchAdminProducts());
    } else {
      // El error ya se maneja en el slice, pero mostramos toast adicional si querés
      toast.error('Error al guardar el producto');
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete.id_producto));
      dispatch(fetchAdminProducts());
      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.success('Producto eliminado correctamente');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-white">Panel de Administración - Productos</h2>
        <Button variant="primary" onClick={handleOpenCreate}>
          <FaPlus className="me-2" /> Nuevo Producto
        </Button>
      </div>

      {/* Barra de búsqueda y filtro */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white border-secondary">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <select
            className="form-select bg-dark text-white border-secondary"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Errores generales */}
      {error && (
        <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
          <strong>{error}</strong>
          {errorDetails && errorDetails.length > 0 && (
            <ul className="mb-0 mt-2">
              {errorDetails.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}

      {/* Tabla de productos */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-secondary">Cargando productos...</p>
        </div>
      ) : (
        <>
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
                {currentProducts.map((prod) => (
                  <tr key={prod.id_producto}>
                    <td>{prod.id_producto}</td>
                    <td>
                      {prod.imagen_url ? (
                        <img
                          src={`http://localhost:3000${prod.imagen_url}`}
                          alt={prod.nombre}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
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
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => dispatch(setCurrentProduct(prod))}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(prod)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark text-white border-secondary"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Anterior
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link bg-dark text-white border-secondary">
                      Página {currentPage} de {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark text-white border-secondary"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal para crear/editar producto */}
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

            {/* Vista previa de imagen */}
            {previewImage && (
              <div className="mb-3 text-center">
                <img
                  src={previewImage}
                  alt="Vista previa"
                  style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                />
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
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          ¿Estás seguro de eliminar <strong>{productToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;