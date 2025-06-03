import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResumenPedido.css';

function ResumenPedido() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Datos simulados si no viene por navegación
  const mockData = {
    product: {
      id_producto: 1,
      id_tienda: 'Tienda Demo',
      nombre_producto: 'Polera Personalizada',
      precio: 45.00,
      imagen_url: ['/demo-producto.jpg'],
    },
    selectedSizes: {
      S: 2,
      M: 1,
      L: 3,
    }
  };

  const product = state?.product || mockData.product;
  const selectedSizes = state?.selectedSizes || mockData.selectedSizes;

  const total = Object.entries(selectedSizes).reduce(
    (sum, [size, qty]) => sum + qty * product.precio, 0
  );

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentProof(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setPaymentProof(file);
    } else {
      alert('El archivo debe ser menor a 2MB');
    }
  };

  const handleSubmitOrder = () => {
    if (!paymentMethod) {
      setError('Por favor seleccione un método de pago');
      return;
    }
    if (paymentMethod === 'transferencia' && !paymentProof) {
      setError('Por favor suba su comprobante de transferencia');
      return;
    }

    // Simula éxito
    alert('Pedido simulado enviado con éxito!');
  };

  return (
    <div className="resumen-pedido-container">
      <h1 className="resumen-title">Resumen de tu Pedido</h1>

      <div className="producto-resumen">
        <div className="producto-imagen">
          <img src={product.imagen_url[0]} alt={product.nombre_producto} />
        </div>
        <div className="producto-info">
          <h2>{product.nombre_producto}</h2>
          <p className="tienda-info">Tienda: {product.id_tienda}</p>
          
        </div>
      </div>

      <div className="detalles-tallas">
        <h3>Detalles por Talla</h3>
        <div className="tallas-list">
          {Object.entries(selectedSizes).map(([size, qty]) => (
            <div key={size} className="talla-item">
              <span className="talla-size">Talla {size}</span>
              <span className="talla-qty">{qty} und.</span>
              <span className="talla-subtotal">S/ {(qty * product.precio).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="metodo-pago-section">
        <h3>Método de Pago</h3>
        <div className="payment-options">
          {['qr', 'efectivo', 'transferencia'].map(method => (
            <div
              key={method}
              className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect(method)}
            >
              <div className="payment-icon">
                <img src={`/${method}-icon.png`} alt={method} />
              </div>
              <span>{{
                qr: 'Pago QR',
                efectivo: 'Efectivo en Tienda',
                transferencia: 'Transferencia Bancaria'
              }[method]}</span>
            </div>
          ))}
        </div>

        {paymentMethod === 'transferencia' && (
          <div className="payment-proof-upload">
            <label>Subir comprobante de transferencia:</label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} />
            {paymentProof && <div className="proof-preview">Archivo: {paymentProof.name}</div>}
          </div>
        )}

        {paymentMethod === 'qr' && (
          <div className="qr-instructions">
            <p>Escanea el siguiente código QR para realizar el pago:</p>
            <div className="qr-code-placeholder">
              <img src="/qr-placeholder.png" alt="QR de Pago" />
            </div>
          </div>
        )}
      </div>

      <div className="resumen-total">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
        <div className="total-line">
          <span>Envío:</span>
          <span>S/ 0.00</span>
        </div>
        <div className="total-line final">
          <span>Total a pagar:</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button className="back-btn" onClick={() => navigate(-1)} disabled={isSubmitting}>
          Volver
        </button>
        <button className="confirm-btn" onClick={handleSubmitOrder} disabled={isSubmitting || !paymentMethod}>
          {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  );
}

export default ResumenPedido;
