import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import fallbackImage from '/tralalerotralala.jpg';

import StoreLink from '../StoreLink/StoreLink';
function ProductCard({ product }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }
    
    if (typeof price === 'string' && !isNaN(parseFloat(price))) {
      return `$${parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }
    
    return '$0.00';
  };

  const handleCardClick = () => {
    navigate(`/producto/${product.id_producto}`);
  };

  return (
    <div 
      className="premium-product-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="premium-product-image-container">
        <img 
          src={product.imagen_url} 
          alt={product.nombre_producto} 
          className="premium-product-image"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = fallbackImage;
            e.target.className = 'premium-product-image premium-product-image-fallback';
          }}
        />
        {product.descuento && (
          <div className="premium-discount-badge">{product.descuento}% OFF</div>
        )}
      </div>
      
      <div className="premium-product-content">
        <span className="premium-product-brand">
  <StoreLink 
    storeId={product.id_tienda} 
    storeName={product.nombre_tienda} 
  />
</span>
        <span className="premium-product-brand">{product.nombre_tienda || 'ALISPORT'}</span>
        <h3 className="premium-product-title">{product.nombre_producto || 'Producto Premium'}</h3>
        
        <div className="premium-price-container">
          {product.precio_original && (
            <span className="premium-original-price">{formatPrice(product.precio_original)}</span>
          )}
          <span className="premium-current-price">{formatPrice(product.precio)}</span>
        </div>
        
        <button className="premium-details-button">
          VER DETALLES
        </button>
      </div>
    </div>
  );
}

export default ProductCard;