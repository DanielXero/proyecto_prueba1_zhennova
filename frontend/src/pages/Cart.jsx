import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarrito, actualizarCantidad, eliminarDelCarrito, procesarCheckout, limpiarEstadoPedido } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const [formaPago, setFormaPago] = useState(1);
  const [loadingItems, setLoadingItems] = useState({});

  useEffect(() => {
    dispatch(fetchCarrito());
  }, [dispatch]);

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
      const result = await dispatch(procesarCheckout(formaPago)).unwrap();
      toast.success(`Pedido #${result.id_pedido} creado con éxito`);
      dispatch(limpiarEstadoPedido());
      navigate('/');
    } catch (err) {
      toast.error(err || 'Error al procesar compra');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.Producto?.precio), 0);
  let total = subtotal;
  let descuentoRecargo = 0;
  if (formaPago === 1) { total = subtotal * 0.9; descuentoRecargo = subtotal * 0.1; }
  if (formaPago === 2) { total = subtotal * 1.15; descuentoRecargo = subtotal * 0.15; }
  if (formaPago === 3) { total = subtotal; descuentoRecargo = 0; }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-cyan"></div><p>Cargando carrito...</p></div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">🛒 Tu Carrito</h2>
      {items.length === 0 ? (
        <div className="alert alert-info text-center">El carrito está vacío. <a href="/productos">Seguir comprando</a></div>
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
                      <h6 className="mb-1">{item.Producto?.nombre}</h6>
                      <small className="text-secondary">Precio unit: ${Number(item.Producto?.precio).toLocaleString()}</small>
                      <div className="text-warning small">Stock disponible: {item.Producto?.stock}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item, item.cantidad - 1)} disabled={item.cantidad <= 1 || loadingItems[item.id_producto]}>-</button>
                      <span className="fw-bold" style={{ width: '40px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item, item.cantidad + 1)} disabled={item.cantidad >= item.Producto?.stock || loadingItems[item.id_producto]}>+</button>
                    </div>
                    <div className="fw-bold text-success" style={{ width: '100px' }}>${(item.cantidad * item.Producto?.precio).toLocaleString()}</div>
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
                <h5 className="card-title fw-bold">Resumen de pago</h5>
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
                </div>
                {descuentoRecargo > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-info small">
                    <span>{formaPago === 1 ? 'Descuento efectivo (-10%)' : 'Recargo tarjeta (+15%)'}</span>
                    <span>{formaPago === 1 ? `-$${descuentoRecargo.toLocaleString()}` : `+$${descuentoRecargo.toLocaleString()}`}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
                  <span>Total</span><span className="text-cyan">${total.toLocaleString()}</span>
                </div>
                <label className="form-label">Método de pago</label>
                <select className="form-select mb-3 bg-dark text-white border-secondary" value={formaPago} onChange={(e) => setFormaPago(Number(e.target.value))}>
                  <option value={1}>💵 Efectivo (10% descuento)</option>
                  <option value={2}>💳 Tarjeta (15% recargo)</option>
                  <option value={3}>🏦 Transferencia (sin cargo)</option>
                </select>
                <button className="btn btn-primary w-100 fw-bold py-2" onClick={handleConfirmarCompra} disabled={loading}>
                  {loading ? 'Procesando...' : 'Confirmar compra'}
                </button>
                {error && <div className="alert alert-danger mt-3 small">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;