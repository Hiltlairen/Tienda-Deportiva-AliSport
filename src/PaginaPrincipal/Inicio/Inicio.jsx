import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts } from '../../services/productService';
import './Inicio.css';
import Carousel from '../../components/Carousel/Carousel';

import CategoriesRibbon from '../../components/CategoriesRibbon/CategoriesRibbon';

import OfertaPersonalizada from '../../components/OfertaPersonalizada/OfertaPersonalizada';
function Inicio() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="inicio">
      <Carousel />
      <OfertaPersonalizada />
     
      

      <section className="featured-products">
        <h2 className="section-title">PRODUCTOS DESTACADOS</h2>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Inicio;