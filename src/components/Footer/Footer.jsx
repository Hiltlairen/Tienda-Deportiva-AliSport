import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content container"> {/* Añadida clase container */}
        <div className="footer-section">
          <h3 className="footer-logo">ALISPORT</h3> {/* Clase específica para logo */}
          <p>© {currentYear} Todos los derechos reservados</p>
        </div>
        <nav className="footer-links" aria-label="Enlaces secundarios">
          <a href="#" className="footer-link">Términos y condiciones</a>
          <a href="#" className="footer-link">Política de privacidad</a>
          <a href="#" className="footer-link">Contacto</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;