import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMisPedidos } from '../store/ordersSlice';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { pedidos, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchMisPedidos());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-cyan"></div>
        <p>Cargando tus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container py-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-white">📋 Mis Pedidos</h2>
      {pedidos.length === 0 ? (
        <div className="alert alert-info">
          No realizaste ninguna compra aún. <Link to="/productos">Ir a la tienda</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Método de pago</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id_pedido}>
                  <td><code>{pedido.id_pedido.slice(0,8)}...</code></td>
                  <td>{new Date(pedido.fecha_creacion).toLocaleDateString()}</td>
                  <td>${Number(pedido.total).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${pedido.estado === 'pendiente' ? 'bg-warning' : 'bg-success'}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>{pedido.FormaPago?.nombre || 'N/D'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#detalle-${pedido.id_pedido}`}
                    >
                      Ver productos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Detalle colapsable de cada pedido */}
          {pedidos.map(pedido => (
            <div key={`detalle-${pedido.id_pedido}`} className="collapse mb-3" id={`detalle-${pedido.id_pedido}`}>
              <div className="card card-body bg-dark border-secondary">
                <h6>Productos del pedido #{pedido.id_pedido.slice(0,8)}</h6>
                <ul className="list-group list-group-flush bg-dark">
                  {pedido.DetallePedidos.map(det => (
                    <li key={det.id_detalle} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                      <span>{det.cantidad}x {det.Producto.nombre}</span>
                      <span>${Number(det.precio_unitario).toLocaleString()} c/u</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;