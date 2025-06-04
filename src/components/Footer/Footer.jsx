import React from 'react';
import './Footer.css';

function FooterPremium() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="premium-footer" role="contentinfo">
      <div className="premium-footer-container">
        <div className="premium-footer-main">
          <div className="premium-footer-brand">
            <h3 className="premium-footer-logo">ALISPORT</h3>
            <p className="premium-footer-copyright">© {currentYear} Todos los derechos reservados</p>
          </div>
          
          <div className="premium-footer-sections">
            
            
            <div className="premium-footer-section">
              <h4 className="premium-footer-heading">LEGAL</h4>
              <ul className="premium-footer-links">
                <li><a href="/terminos" className="premium-footer-link">Términos y Condiciones</a></li>
                <li><a href="/privacidad" className="premium-footer-link">Política de Privacidad</a></li>
                <li><a href="/cookies" className="premium-footer-link">Política de Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

export default FooterPremium;