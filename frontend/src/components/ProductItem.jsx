import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { agregarAlCarrito } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const { user } = useSelector((state) => state.users);
  const [isAdding, setIsAdding] = useState(false);

  const handleAgregar = async () => {
    if (!user) {
      toast.info("Inicia sesión para comprar");
      navigate('/login');
      return;
    }
    if (cantidad > product.stock) {
      toast.error(`Stock insuficiente (máx ${product.stock})`);
      return;
    }
    setIsAdding(true);
    try {
      await dispatch(agregarAlCarrito({ id_producto: product.id_producto, cantidad })).unwrap();
      toast.success(`✅ ${product.nombre} agregado (${cantidad})`);
      setCantidad(1);
    } catch (err) {
      toast.error(err || "Error al agregar");
    } finally {
      setIsAdding(false);
    }
  };

  const imagenUrl = product.imagen_url ? `http://localhost:3000${product.imagen_url}` : '/placeholder-image.png';

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 bg-dark text-white border-0 shadow-sm product-card-hover">
        {/* Badge de oferta simulado */}
        {product.precio > 500000 && <span className="badge bg-danger position-absolute top-0 end-0 m-2">🔥 Oferta</span>}
        <img 
          src={imagenUrl} 
          className="card-img-top" 
          alt={product.nombre}
          style={{ height: '200px', objectFit: 'contain', backgroundColor: '#2a2a2a', padding: '1rem' }}
          onError={(e) => { e.target.src = '/placeholder-image.png' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-cyan fw-semibold">{product.nombre}</h5>
          <p className="card-text small text-secondary flex-grow-1">{product.descripcion?.slice(0, 80)}...</p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-5 fw-bold text-success">${Number(product.precio).toLocaleString()}</span>
              <span className="badge bg-secondary">stock: {product.stock}</span>
            </div>
            <div className="d-flex gap-2 mb-3 align-items-center">
              <label className="small text-secondary">Cant:</label>
              <input 
                type="number" 
                min="1" 
                max={product.stock} 
                value={cantidad}
                onChange={(e) => setCantidad(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                className="form-control form-control-sm bg-dark text-white border-secondary"
                style={{ width: '70px' }}
                disabled={product.stock === 0 || isAdding}
              />
            </div>
            <button 
              className="btn btn-primary w-100 fw-semibold" 
              disabled={product.stock === 0 || isAdding}
              onClick={handleAgregar}
            >
              {isAdding ? 'Agregando...' : (product.stock > 0 ? '🛒 Agregar al carrito' : '❌ Sin stock')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};