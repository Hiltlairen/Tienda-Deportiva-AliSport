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

  // Estado modal para mensajes
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
    if (/^\d*$/.test(value)) {
      const intVal = value === '' ? 0 : parseInt(value);
      setSizeQuantities(prev => ({
        ...prev,
        [size]: intVal >= 0 ? intVal : 0
      }));
    }
  };

  const totalUnits = () => Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0);

  const calculateTotal = () => {
    return Object.entries(sizeQuantities).reduce(
      (sum, [size, qty]) => sum + (qty * product.precio), 0
    );
  };

  // Validar sesión y cantidades SOLO cuando se quiere ir al resumen
  const handleProceedToSummary = () => {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    if (!userLoggedIn) {
      setModalMessage('Debe estar registrado para continuar con el pedido.');
      setShowModal(true);
      return;
    }

    if (totalUnits() < product.cantidad_minima) {
      setModalMessage(`Debe seleccionar al menos ${product.cantidad_minima} unidades en total.`);
      setShowModal(true);
      return;
    }

    navigate('/resumen-pedido', {
      state: {
        product,
        sizeQuantities,
        total: calculateTotal()
      }
    });
  };

  if (loading) return <div className="loading">Cargando producto...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Producto no encontrado</div>;

  const imageUrls = Array.isArray(product.imagen_url) ? product.imagen_url : [product.imagen_url];

  return (
    <div className="view-product-container">
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
        aria-label="Volver al inicio"
      >
        ← Volver
      </button>

      {/* Modal overlay que bloquea toda la pantalla */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="modal-close-btn">Cerrar</button>
          </div>
        </div>
      )}

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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={sizeQuantities[trimmedSize] || ''}
                        onChange={(e) => handleQuantityChange(trimmedSize, e.target.value)}
                        className="quantity-input"
                        placeholder="0"
                      />
                    </div>
                  );
                })}
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
