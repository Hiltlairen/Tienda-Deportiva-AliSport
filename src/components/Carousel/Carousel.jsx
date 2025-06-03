import React from 'react';
import './EpicStyleCarousel.css';

const featuredProducts = [
  {
    id: 1,
    name: "POLERA NEGRA PREMIUM",
    image: "/black.png",
    oldPrice: "$59.990",
    newPrice: "$39.990",
    discount: "30% OFF",
    tag: "DESTACADO",
    description: "Polera de algodón premium para entrenamiento y uso diario."
  },
  {
    id: 2,
    name: "CHAQUETA DEPORTIVA",
    image: "/jacket.png",
    oldPrice: "$89.990",
    newPrice: "$59.990",
    discount: "33% OFF",
    tag: "NUEVO"
  },
  {
    id: 3,
    name: "POLERÓN AZUL",
    image: "/hoodie.png",
    oldPrice: "$65.990",
    newPrice: "$45.990",
    discount: "29% OFF",
    tag: "OFERTA"
  },
  {
    id: 4,
    name: "SHORT DEPORTIVO",
    image: "/shorts.png",
    oldPrice: "$45.990",
    newPrice: "$29.990",
    discount: "34% OFF",
    tag: "POPULAR"
  }
];

function EpicStyleCarousel() {
  const mainProduct = featuredProducts[0];
  const sideProducts = featuredProducts.slice(1);

  return (
    <div className="epic-carousel-container">
      <div className="main-featured">
        <div className="product-badge">{mainProduct.tag}</div>
        <div className="discount-badge">{mainProduct.discount}</div>
        
        <div className="product-image-container">
          <img 
            src={mainProduct.image} 
            alt={mainProduct.name}
            className="main-product-image"
          />
        </div>
        
        <div className="product-info">
          <h2 className="product-title">{mainProduct.name}</h2>
          <p className="product-description">{mainProduct.description}</p>
          
          <div className="price-container">
            <span className="old-price">{mainProduct.oldPrice}</span>
            <span className="new-price">{mainProduct.newPrice}</span>
          </div>
          
          <div className="button-group">
            <button className="details-btn">Ver detalles</button>
            <button className="buy-btn">Comprar ahora</button>
          </div>
        </div>
      </div>
      
      <div className="side-products">
        {sideProducts.map(product => (
          <div key={product.id} className="side-product-card">
            <div className="side-product-badge">{product.tag}</div>
            
            <div className="side-product-content">
              <img 
                src={product.image} 
                alt={product.name}
                className="side-product-image"
              />
              
              <div className="side-product-info">
                <h3 className="side-product-title">{product.name}</h3>
                
                <div className="side-price-container">
                  <span className="side-old-price">{product.oldPrice}</span>
                  <span className="side-new-price">{product.newPrice}</span>
                </div>
                
                <div className="side-discount-badge">{product.discount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpicStyleCarousel;