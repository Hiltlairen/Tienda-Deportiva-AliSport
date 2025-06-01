import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import fallbackImage from '/tralalerotralala.jpg';

function ProductCard({ product }) {
  const navigate = useNavigate();

  // Función para formatear el precio
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    
    if (typeof price === 'string' && !isNaN(parseFloat(price))) {
      return `$${parseFloat(price).toFixed(2)}`;
    }
    
    return '$0.00';
  };

  // Función para manejar el clic en la tarjeta
  const handleCardClick = () => {
    navigate(`/producto/${product.id_producto}`); // Usa ID real
  };
  return (
    <div 
      className="product-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="product-image-container">
        <img 
          src={product.imagen_url} 
          alt={product.nombre_producto} 
          className="product-image"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = fallbackImage;
          }}
        />
      </div>
      <h3 className="product-brand">{product.nombre_tienda || 'Tienda'}</h3>
      <h2 className="product-title">{product.nombre_producto || 'Producto'}</h2>
      <p className="product-category">{product.categoria || 'Categoría'}</p>
      <p className="product-price">{formatPrice(product.precio)}</p>
      <div className="details-button">DETALLES</div>
    </div>
  );
}

export default ProductCard;