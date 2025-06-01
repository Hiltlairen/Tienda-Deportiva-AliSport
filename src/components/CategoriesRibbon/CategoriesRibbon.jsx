import { useState } from 'react';
import './CategoriesRibbon.css';

const CategoriesRibbon = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Datos de categorías
  const categories = [
    {
      id: 1,
      name: 'Poleras',
      previewImage: '/iconos/polera.png'
    },
    {
      id: 2,
      name: 'Conjunto deportivo (polera y short)',
      previewImage: '/iconos/conjunto_1.png'
    },
    {
      id: 3,
      name: 'Conjunto deportivo (polera, short, chamarra y buzo)',
      previewImage: '/iconos/conjunto_2.png'
    },
    {
      id: 4,
      name: 'Gorras',
      previewImage: '/iconos/gorra.png'
    },
    {
      id: 5,
      name: 'Parkas',
      previewImage: '/iconos/parka.png'
    }
  ];

  return (
    <section className="categories-section"> {/* Cambiado a semántico section */}
      <h2 className="section-title">CATEGORÍAS</h2> {/* Clase estandarizada */}
      
      <div className="categories-ribbon">
        {categories.map((category) => (
          <button 
            key={category.id}
            className="category-item"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
            aria-label={`Ver ${category.name}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {hoveredCategory && (
        <div className="category-preview">
          <img 
            src={hoveredCategory.previewImage} 
            alt={`Previsualización de ${hoveredCategory.name}`}
            loading="lazy" // Mejora performance
          />
        </div>
      )}
    </section>
  );
};

export default CategoriesRibbon;