import React from 'react';

const AboutUs = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card bg-dark text-white border-secondary">
            <div className="card-body text-center">
              <h1 className="text-cyan mb-4">Sobre ZhenNova</h1>
              <p className="lead">
                Somos una tienda especializada en hardware de PC y periféricos, nacida en 2025 con la misión de acercar la tecnología de vanguardia a entusiastas y profesionales.
              </p>
              <hr className="border-secondary" />
              <h4 className="text-cyan mt-4">🎯 Misión</h4>
              <p>
                Proveer componentes de alta calidad con asesoramiento experto, garantizando precios competitivos y entregas rápidas.
              </p>
              <h4 className="text-cyan mt-4">🌟 Visión</h4>
              <p>
                Ser el e-commerce de referencia en hardware para gamers y creadores, impulsando la innovación tecnológica en la región.
              </p>
              <h4 className="text-cyan mt-4">💎 Valores</h4>
              <ul className="list-unstyled">
                <li>🔹 Calidad y confianza</li>
                <li>🔹 Atención personalizada</li>
                <li>🔹 Compromiso con el medio ambiente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;