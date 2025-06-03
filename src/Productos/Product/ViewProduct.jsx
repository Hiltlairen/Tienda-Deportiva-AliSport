import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewProduct.css';

function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost/back-ropa/producto/obtenerProductoPorId.php?id=${id}`);
        const data = await response.json();
        
        if (data.success === false) {
          setError(data.message);
        } else {
          setProduct(data);
          const initialQuantities = {};
          data.talla.split(',').forEach(size => {
            initialQuantities[size.trim()] = 0;
          });
          setSizeQuantities(initialQuantities);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (size, value) => {
    const intVal = parseInt(value) || 0;
    setSizeQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, intVal)
    }));
  };

  const totalUnits = () => Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);

  const handleProceedToSummary = () => {
    if (totalUnits() < product.cantidad_minima) {
      alert(`Debe seleccionar al menos ${product.cantidad_minima} unidades en total`);
      return;
    }

    navigate('/resumen-pedido', {
      state: {
        product,
        sizeQuantities,
        paymentMethod,
        total: calculateTotal()
      }
    });
  };

  const calculateTotal = () => {
  return Object.entries(sizeQuantities).reduce(
    (sum, [size, qty]) => sum + (qty * product.precio), 0
  );
};


  if (loading) return <div className="loading">Cargando producto...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Producto no encontrado</div>;

  const imageUrls = Array.isArray(product.imagen_url) ? product.imagen_url : [product.imagen_url];

  return (
    <div className="view-product-container">
      <div className="breadcrumb">
        <span>{product.id_tienda.toUpperCase()}</span> &gt; 
        <span>{product.categoria}</span> &gt; 
        <span>{product.nombre_producto}</span>
      </div>

      <div className="product-main">
        <div className="product-gallery">
          <div className="thumbnail-container">
            {imageUrls.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Vista ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={imageUrls[selectedImage]} alt={product.nombre_producto} />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.nombre_producto}</h1>
          <div className="product-brand">Tienda: {product.id_tienda}</div>
          
          <div className="price-container">
            <span className="current-price">S/ {parseFloat(product.precio).toFixed(2)}</span>
          </div>

          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.descripcion}</p>
          </div>

          <div className="product-options">
            <div className="option-group">
              <label>Seleccione tallas y cantidades:</label>
              <div className="size-quantity-grid">
                {product.talla.split(',').map(size => {
                  const trimmedSize = size.trim();
                  return (
                    <div key={trimmedSize} className="size-quantity-item">
                      <label>Talla {trimmedSize}</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={sizeQuantities[trimmedSize] || 0}
                        onChange={(e) => handleQuantityChange(trimmedSize, e.target.value)}
                        className="quantity-input"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="option-group">
              <label>Método de pago preferido:</label>
              <div className="payment-methods">
                <button
                  className={`payment-method ${paymentMethod === 'qr' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('qr')}
                >
                  <span className="payment-icon">📱</span> Pago QR
                </button>
                <button
                  className={`payment-method ${paymentMethod === 'efectivo' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('efectivo')}
                >
                  <span className="payment-icon">💵</span> Efectivo en tienda
                </button>
              </div>
            </div>
          </div>

          <div className="preliminary-total">
            <h3>Total preliminar: S/ {calculateTotal().toFixed(2)}</h3>
            {totalUnits() < product.cantidad_minima && (
              <div className="min-warning">
                Debe seleccionar al menos {product.cantidad_minima} unidades en total.
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button 
              className="summary-btn"
              onClick={handleProceedToSummary}
              disabled={totalUnits() < product.cantidad_minima}
            >
              Ver Resumen del Pedido
            </button>
          </div>
        </div>
      </div>

      <div className="product-details">
        <h2>Detalles del producto</h2>
        <table>
          <tbody>
            <tr>
              <td>Tienda</td>
              <td>{product.id_tienda}</td>
            </tr>
            <tr>
              <td>Categoría</td>
              <td>{product.categoria}</td>
            </tr>
            <tr>
              <td>Tiempo de producción</td>
              <td>{product.tiempo_produccion}</td>
            </tr>
            <tr>
              <td>Tallas disponibles</td>
              <td>{product.talla}</td>
            </tr>
            <tr>
              <td>Edades</td>
              <td>{product.edades}</td>
            </tr>
            {product.url_3d && (
              <tr>
                <td>Vista 3D</td>
                <td>
                  <a href={product.url_3d} target="_blank" rel="noopener noreferrer">
                    Ver modelo 3D
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewProduct;
