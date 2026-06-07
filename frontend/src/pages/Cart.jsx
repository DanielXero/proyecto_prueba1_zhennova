import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarrito, actualizarCantidad, eliminarDelCarrito, procesarCheckout, limpiarEstadoPedido } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const [formaPago, setFormaPago] = useState(1);
  const [loadingItems, setLoadingItems] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Cargar carrito al montar
  useEffect(() => {
    dispatch(fetchCarrito());
  }, [dispatch]);

  // Eliminar items con cantidad <= 0 (seguridad extra)
  useEffect(() => {
    if (items.length > 0) {
      items.forEach(item => {
        if (item.cantidad <= 0) {
          dispatch(eliminarDelCarrito(item.id_producto));
        }
      });
    }
  }, [items, dispatch]);

  // Polling: actualizar stock cada 30 segundos mientras haya items
  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length > 0) {
        dispatch(fetchCarrito());
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch, items.length]);

  const handleQuantityChange = async (item, newCantidad) => {
    if (newCantidad < 1) return;
    if (newCantidad > item.Producto.stock) {
      toast.error(`Stock máximo: ${item.Producto.stock}`);
      return;
    }
    setLoadingItems(prev => ({ ...prev, [item.id_producto]: true }));
    try {
      await dispatch(actualizarCantidad({ id_producto: item.id_producto, cantidad: newCantidad })).unwrap();
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id_producto]: false }));
    }
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar producto del carrito?')) {
      dispatch(eliminarDelCarrito(id));
    }
  };

  const handleConfirmarCompra = async () => {
    try {
      // Validaciones previas (stock, cantidad)
      for (const item of items) {
        if (item.cantidad <= 0) {
          toast.error(`Cantidad inválida para ${item.Producto.nombre}. Elimina el producto.`);
          return;
        }
        if (item.cantidad > item.Producto.stock) {
          toast.error(`Stock insuficiente para ${item.Producto.nombre}. Solo hay ${item.Producto.stock}.`);
          return;
        }
      }

      const result = await dispatch(procesarCheckout(formaPago)).unwrap();
      toast.success(`Pedido #${result.id_pedido} creado con éxito`);
      dispatch(limpiarEstadoPedido());
      setShowConfirmModal(false);
      navigate(`/gracias/${result.id_pedido}`);
    } catch (err) {
      console.error("Error detallado:", err);
      if (err && typeof err === 'string') {
        if (err.includes('Stock insuficiente')) {
          toast.error(`❌ ${err}`);
        } else {
          toast.error(err || 'Error al procesar compra');
        }
      } else {
        toast.error('Error inesperado. Intenta de nuevo.');
      }
    }
  };

  // Cálculos
  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * (item.Producto?.precio || 0)), 0);
  let total = subtotal;
  let descuentoRecargo = 0;
  if (formaPago === 1) { total = subtotal * 0.9; descuentoRecargo = subtotal * 0.1; }
  if (formaPago === 2) { total = subtotal * 1.15; descuentoRecargo = subtotal * 0.15; }
  if (formaPago === 3) { total = subtotal; descuentoRecargo = 0; }

  const isCheckoutDisabled = loading || items.length === 0 || items.some(item => item.cantidad > item.Producto?.stock);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-cyan"></div>
        <p>Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-white">🛒 Tu Carrito</h2>
      {items.length === 0 ? (
        <div className="alert alert-info text-center">
          El carrito está vacío. <a href="/productos">Seguir comprando</a>
        </div>
      ) : (
        <div className="row g-4">
          {/* Lista de productos */}
          <div className="col-lg-8">
            <div className="card bg-dark border-secondary">
              <div className="card-body p-0">
                {items.map((item) => (
                  <div key={item.id_producto} className="d-flex flex-wrap align-items-center p-3 border-bottom border-secondary gap-3">
                    <img
                      src={item.Producto?.imagen_url ? `http://localhost:3000${item.Producto.imagen_url}` : '/placeholder.png'}
                      alt={item.Producto?.nombre}
                      style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                      className="rounded bg-dark"
                    />
                    <div className="flex-grow-1" style={{ minWidth: '150px' }}>
                      <h6 className="mb-1 text-white">{item.Producto?.nombre}</h6>
                      <small className="text-secondary">Precio unit: ${Number(item.Producto?.precio).toLocaleString()}</small>
                      <div className="text-warning small ">Stock disponible: {item.Producto?.stock}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary "
                        onClick={() => handleQuantityChange(item, item.cantidad - 1)}
                        disabled={item.cantidad <= 1 || loadingItems[item.id_producto]}
                      >
                        -
                      </button>
                      <span className="fw-bold text-white" style={{ width: '40px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQuantityChange(item, item.cantidad + 1)}
                        disabled={item.cantidad >= item.Producto?.stock || loadingItems[item.id_producto]}
                      >
                        +
                      </button>
                    </div>
                    <div className="fw-bold text-success" style={{ width: '100px' }}>
                      ${(item.cantidad * item.Producto?.precio).toLocaleString()}
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(item.id_producto)}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen lateral */}
          <div className="col-lg-4">
            <div className="card bg-dark border-secondary sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="card-title fw-bold text-white">Resumen de pago</h5>
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between mb-2 text-white">
                  <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
                </div>
                {descuentoRecargo > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-info small text-white">
                    <span>{formaPago === 1 ? 'Descuento efectivo (-10%)' : 'Recargo tarjeta (+15%)'}</span>
                    <span>{formaPago === 1 ? `-$${descuentoRecargo.toLocaleString()}` : `+$${descuentoRecargo.toLocaleString()}`}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-3 fw-bold fs-5 text-white">
                  <span>Total</span><span className="text-cyan">${total.toLocaleString()}</span>
                </div>
                <label className="form-label">Método de pago</label>
                <select
                  className="form-select mb-3 bg-dark text-white border-secondary"
                  value={formaPago}
                  onChange={(e) => setFormaPago(Number(e.target.value))}
                >
                  <option value={1}>💵 Efectivo (10% descuento)</option>
                  <option value={2}>💳 Tarjeta (15% recargo)</option>
                  <option value={3}>🏦 Transferencia (sin cargo)</option>
                </select>
                <button
                  className="btn btn-primary w-100 fw-bold py-2"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isCheckoutDisabled}
                >
                  {loading ? 'Procesando...' : 'Confirmar compra'}
                </button>
                {error && <div className="alert alert-danger mt-3 small">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Confirmar pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <h6>Resumen de tu compra</h6>
          <ul className="list-group mb-3 bg-dark">
            {items.map(item => (
              <li key={item.id_producto} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                <span>{item.cantidad}x {item.Producto.nombre}</span>
                <span>${(item.cantidad * item.Producto.precio).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between mb-2">
            <strong>Subtotal:</strong> <span>${subtotal.toLocaleString()}</span>
          </div>
          {descuentoRecargo > 0 && (
            <div className="d-flex justify-content-between mb-2 text-info">
              <span>{formaPago === 1 ? 'Descuento efectivo (-10%)' : 'Recargo tarjeta (+15%)'}</span>
              <span>{formaPago === 1 ? `-$${descuentoRecargo.toLocaleString()}` : `+$${descuentoRecargo.toLocaleString()}`}</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
            <span>Total a pagar:</span>
            <span className="text-cyan">${total.toLocaleString()}</span>
          </div>
          <p className="small text-secondary">¿Confirmas la compra?</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmarCompra} disabled={isCheckoutDisabled}>
            Sí, confirmar pedido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;