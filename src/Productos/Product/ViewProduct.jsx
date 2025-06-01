import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewProduct.css';

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost/back-ropa/producto/obtenerProductoPorId.php?id=${id}`);
        const data = await response.json();
        
        if (data.success === false) {
          setError(data.message);
        } else {
          setProduct(data);
          setSelectedSize(data.talla.split(',')[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Cargando producto...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="error">Producto no encontrado</div>;

  // Asegúrate de que imagen_url sea un array antes de mapearlo
  const imageUrls = Array.isArray(product.imagen_url) ? product.imagen_url : [product.imagen_url];

  return (
    <div className="view-product-container">
      {/* Ruta de navegación */}
      <div className="breadcrumb">
        <span>{product.id_tienda.toUpperCase()}</span> &gt; 
        <span>{product.categoria}</span> &gt; 
        <span>{product.nombre_producto}</span>
      </div>

      <div className="product-main">
        {/* Galería de imágenes */}
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

        {/* Información del producto */}
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

          {/* Selectores */}
          <div className="product-options">
            <div className="option-group">
              <label>Talla:</label>
              <div className="size-options">
                {product.talla.split(',').map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size.trim())}
                  >
                    {size.trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label>Cantidad (mínimo {product.cantidad_minima}):</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="quantity-selector"
              >
                {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="action-buttons">
            <button className="add-to-cart">Añadir al carrito</button>
            <button className="buy-now">Comprar ahora</button>
          </div>
        </div>
      </div>

      {/* Sección de detalles adicionales */}
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
