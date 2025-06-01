import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';

// Datos de ejemplo
const ofertas = [
  {
    id: 1,
    name: "POLERA NEGRA",
    image: "/black.png",
    oldPrice: "$59.990",
    newPrice: "$39.990"
  },
  {
    id: 2,
    name: "POLERA ROJA",
    image: "/red.png",
    oldPrice: "$45.990",
    newPrice: "$29.990"
  },
  {
    id: 3,
    name: "FASSION",
    image: "/fassion.png",
    oldPrice: "$79.990",
    newPrice: "$49.990"
  }
];

function Carousel() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false // Desactivamos las flechas nativas para usar las personalizadas
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">OFERTAS DESTACADAS</h2>
      
      <div className="carousel-wrapper">
        {/* Botón de navegación izquierdo */}
        <button 
          className="custom-arrow prev-arrow"
          onClick={() => sliderRef.current.slickPrev()}
        >
          &#10094;
        </button>
        
        {/* Carrusel principal */}
        <Slider ref={sliderRef} {...settings} className="custom-slick">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="slick-slide-item">
              <div className="oferta-card">
                <div className="oferta-imagen">
                  <img
                    src={oferta.image}
                    alt={oferta.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                    }}
                  />
                </div>
                
                <div className="oferta-contenido">
                  <h3 className="oferta-producto">{oferta.name}</h3>
                  
                  <div className="oferta-precios">
                    <span className="precio-antiguo">{oferta.oldPrice}</span>
                    <span className="precio-nuevo">{oferta.newPrice}</span>
                  </div>
                  
                  <div className="oferta-botones">
                    <button className="boton-outlined">VER DETALLES</button>
                    <button className="boton-filled">COMPRAR AHORA</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        
        {/* Botón de navegación derecho */}
        <button 
          className="custom-arrow next-arrow"
          onClick={() => sliderRef.current.slickNext()}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Carousel;