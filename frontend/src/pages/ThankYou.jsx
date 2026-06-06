import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ThankYou = () => {
  const { pedidoId } = useParams();
  const { ultimoPedido } = useSelector(state => state.cart);
  const [pedido, setPedido] = useState(ultimoPedido || pedidoId);

  useEffect(() => {
    if (!pedido && !ultimoPedido) {
      window.location.href = '/';
    }
  }, [pedido, ultimoPedido]);

  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-white border-success mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <i className="bi bi-check-circle-fill text-success fs-1"></i>
          <h2 className="mt-3 fw-bold">¡Gracias por tu compra!</h2>
          <p className="lead">Tu pedido ha sido registrado exitosamente.</p>
          <p className="text-cyan">Número de pedido: <strong>{pedido}</strong></p>
          <p className="text-secondary">Recibirás un correo con los detalles de envío.</p>
          <Link to="/productos" className="btn btn-primary mt-3">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;