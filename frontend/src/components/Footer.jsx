import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-primary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-cyan fw-bold mb-3">ZhenNova</h5>
            <p className="text-light">
              Tu tienda de confianza para componentes de PC y periféricos.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white hover-cyan"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-white hover-cyan"><i className="bi bi-twitter fs-5"></i></a>
              <a href="#" className="text-white hover-cyan"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-white hover-cyan"><i className="bi bi-whatsapp fs-5"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-cyan">Enlaces</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none hover-cyan">Inicio</a></li>
              <li><a href="/productos" className="text-light text-decoration-none hover-cyan">Productos</a></li>
              <li><a href="/login" className="text-light text-decoration-none hover-cyan">Ingresar</a></li>
              <li><a href="/register" className="text-light text-decoration-none hover-cyan">Registrarse</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-cyan">Enlaces</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none hover-cyan">Inicio</a></li>
              <li><a href="/productos" className="text-light text-decoration-none hover-cyan">Productos</a></li>
              <li><a href="/login" className="text-light text-decoration-none hover-cyan">Ingresar</a></li>
              <li><a href="/register" className="text-light text-decoration-none hover-cyan">Registrarse</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-cyan">Contacto</h6>
            <ul className="list-unstyled text-light">
              <li><i className="bi bi-geo-alt me-2"></i> Av. Tecnología 123</li>
              <li><i className="bi bi-telephone me-2"></i> +1 234 567 890</li>
              <li><i className="bi bi-envelope me-2"></i> info@zhennova.com</li>
            </ul>
          </div>
        </div>
        <hr className="my-4 border-secondary" />
        <p className="text-center text-light mb-0">&copy; 2025 ZhenNova - Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}