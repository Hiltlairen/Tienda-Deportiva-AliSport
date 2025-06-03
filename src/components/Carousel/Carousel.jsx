import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';

const products = [
  {
    id: 1,
    name: "POLERA NEGRA PERFORMANCE",
    image: {
      src: "/black.png",
      aspectRatio: "3/4" // Ancho/Alto
    },
    oldPrice: "$59.990",
    newPrice: "$39.990",
    discount: "30% OFF",
    tag: "EDICIÓN LIMITADA",
    description: "Tecnología Dry-Fit para máximo rendimiento",
    type: "vertical" // vertical, horizontal o square
  },
  {
    id: 2,
    name: "CHAQUETA URBANA AZUL",
    image: {
      src: "/fassion.png",
      aspectRatio: "3/4"
    },
    oldPrice: "$89.990",
    newPrice: "$59.990",
    discount: "33% OFF",
    tag: "NUEVO LANZAMIENTO",
    type: "vertical"
  },
  {
    id: 3,
    name: "PANTALÓN DEPORTIVO TECH",
    image: {
      src: "/red.png",
      aspectRatio: "4/3"
    },
    oldPrice: "$65.990",
    newPrice: "$45.990",
    discount: "29% OFF",
    tag: "MÁS VENDIDO",
    type: "horizontal"
  }

  // ...otros productos
];

function PremiumCarousel() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
    fade: true
  };

  return (
    <section className="premium-carousel-section">
      <h2 className="section-title">COLECCIÓN PREMIUM</h2>

      <Slider ref={sliderRef} {...settings} className="premium-slider">
        {products.map(product => (
          <div key={product.id} className="premium-slide">
            <div className="product-badge">{product.tag}</div>
            
            <div className="slide-content">
              <div className="product-image-container">
                <img 
                  src={product.image.src} 
                  alt={product.name}
                  className="product-image"
                  style={{
                    aspectRatio: product.image.aspectRatio
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.png';
                    e.target.className = 'product-image placeholder';
                  }}
                />
                <div className="discount-bubble">{product.discount}</div>
              </div>
              
              <div className="product-info">
                <p className="product-description">{product.description}</p>
                <h3 className="product-title">{product.name}</h3>
                
                <div className="price-container">
                  <span className="old-price">{product.oldPrice}</span>
                  <span className="new-price">{product.newPrice}</span>
                </div>
                
                <div className="action-buttons">
                  <button className="details-btn">VER DETALLES</button>
                  <button className="buy-btn">AÑADIR AL CARRITO</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default PremiumCarousel;