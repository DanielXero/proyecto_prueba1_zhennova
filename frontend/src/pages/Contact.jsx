import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      toast.error('Completá todos los campos');
      return;
    }
    toast.success('📨 Mensaje enviado (simulado). Te responderemos a la brevedad.');
    setForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-dark text-white border-secondary">
            <div className="card-body">
              <h2 className="text-cyan text-center mb-4">Contactanos</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea
                    name="mensaje"
                    rows="4"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar mensaje</button>
              </form>
              <hr className="border-secondary my-4" />
              <div className="text-center">
                <p><i className="bi bi-envelope-fill me-2"></i> contacto@zhennova.com</p>
                <p><i className="bi bi-telephone-fill me-2"></i> +54 11 1234 5678</p>
                <p><i className="bi bi-geo-alt-fill me-2"></i> Av. Tecnología 123, CABA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;