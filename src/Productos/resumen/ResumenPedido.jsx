import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResumenPedido.css';

function ResumenPedido() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar si hay datos del producto
  if (!state?.product) {
    navigate('/');
    return null;
  }

  // Función para formatear precios de manera segura
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return (numericPrice || 0).toFixed(2);
  };

  // Preparar el producto con precio asegurado
  const product = {
    ...state.product,
    precio: formatPrice(state.product.precio)
  };

  const { sizeQuantities } = state;

  // Calcular total de manera segura
  const total = Object.entries(sizeQuantities).reduce(
    (sum, [size, qty]) => sum + (qty * parseFloat(product.precio)), 0
  );

  // Filtrar solo las tallas con cantidad > 0
  const selectedSizes = Object.fromEntries(
    Object.entries(sizeQuantities).filter(([_, qty]) => qty > 0)
  );

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentProof(null);
    setError(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB max
      setPaymentProof(file);
    } else {
      alert('El archivo debe ser menor a 2MB');
    }
  };

  const handleConfirmOrder = async () => {
    if (!paymentMethod) {
      setError('Por favor seleccione un método de pago');
      return;
    }

    if (paymentMethod === 'transferencia' && !paymentProof) {
      setError('Por favor suba su comprobante de transferencia');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user?.id) throw new Error('Usuario no autenticado');

      // Preparar los datos para cada talla seleccionada
      const pedidosData = Object.entries(selectedSizes).map(([talla, cantidad]) => ({
        id_usuario: user.id,
        id_producto: product.id_producto,
        id_tienda: product.id_tienda,
        cantidad: cantidad,
        talla: talla,
        precio_unitario: product.precio,
        total: (cantidad * parseFloat(product.precio)).toFixed(2),
        metodo_pago: paymentMethod,
        estado: 'pendiente',
        fecha_pedido: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }));

      // Enviar cada pedido al backend
      const responses = await Promise.all(
        pedidosData.map(pedido => 
          fetch('http://localhost/back-ropa/pedido/crearPedido.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(pedido)
          })
        )
      );

      const results = await Promise.all(responses.map(res => res.json()));

      if (results.every(result => result.success)) {
        alert('Pedido(s) creado(s) con éxito');
        navigate('/mis-pedidos');
      } else {
        const errors = results.filter(result => !result.success)
                             .map(result => result.message)
                             .join(', ');
        throw new Error(`Algunos pedidos no se crearon: ${errors}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="resumen-pedido-container">
      <h1 className="resumen-title">Resumen de tu Pedido</h1>
      
      {/* Resumen del producto */}
      <div className="producto-resumen">
        <div className="producto-imagen">
          <img 
            src={Array.isArray(product.imagen_url) ? product.imagen_url[0] : product.imagen_url} 
            alt={product.nombre_producto} 
          />
        </div>
        <div className="producto-info">
          <h2>{product.nombre_producto}</h2>
          <p className="tienda-info">Tienda: {product.id_tienda}</p>
          <p className="precio-unitario">Precio unitario: S/ {product.precio}</p>
        </div>
      </div>
      
      {/* Detalles por talla */}
      <div className="detalles-tallas">
        <h3>Detalles por Talla</h3>
        <div className="tallas-list">
          {Object.entries(selectedSizes).map(([size, qty]) => (
            <div key={size} className="talla-item">
              <span className="talla-size">Talla {size}</span>
              <span className="talla-qty">{qty} und.</span>
              <span className="talla-subtotal">
                S/ {(qty * parseFloat(product.precio)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Método de pago */}
      <div className="metodo-pago-section">
        <h3>Método de Pago</h3>
        <div className="payment-options">
          <div 
            className={`payment-option ${paymentMethod === 'qr' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('qr')}
          >
            <div className="payment-icon">
              <span role="img" aria-label="QR">📱</span>
            </div>
            <span>Pago QR</span>
          </div>
          
          <div 
            className={`payment-option ${paymentMethod === 'efectivo' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('efectivo')}
          >
            <div className="payment-icon">
              <span role="img" aria-label="Efectivo">💵</span>
            </div>
            <span>Efectivo en Tienda</span>
          </div>
          
          <div 
            className={`payment-option ${paymentMethod === 'transferencia' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('transferencia')}
          >
            <div className="payment-icon">
              <span role="img" aria-label="Transferencia">🏦</span>
            </div>
            <span>Transferencia Bancaria</span>
          </div>
        </div>
        
        {/* Comprobante para transferencia */}
        {paymentMethod === 'transferencia' && (
          <div className="payment-proof-upload">
            <label>Subir comprobante de transferencia:</label>
            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={handleFileUpload}
            />
            {paymentProof && (
              <div className="proof-preview">
                Archivo seleccionado: {paymentProof.name}
              </div>
            )}
          </div>
        )}
        
        {/* Instrucciones para QR */}
        {paymentMethod === 'qr' && (
          <div className="qr-instructions">
            <p>Escanea el siguiente código QR para realizar el pago:</p>
            <div className="qr-code-placeholder">
              <span role="img" aria-label="QR Code">[QR Code Placeholder]</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Resumen total */}
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
      
      {/* Mensaje de error */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Botones de acción */}
      <div className="action-buttons">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Volver
        </button>
        <button 
          className="confirm-btn"
          onClick={handleConfirmOrder}
          disabled={isSubmitting || !paymentMethod || (paymentMethod === 'transferencia' && !paymentProof)}
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  );
}

export default ResumenPedido;