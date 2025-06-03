// src/pages/PublishPage.jsx
import React, { useState, useEffect } from 'react';

const PublishPage = () => {
  const [publishedDesigns, setPublishedDesigns] = useState([]);

  useEffect(() => {
    // Recuperamos el estado de la navegación (el diseño publicado)
    const { state } = window.history;
    if (state?.design) {
      const newDesign = state.design;
      setPublishedDesigns([...publishedDesigns, newDesign]);
    }
  }, []);  // Se ejecuta una vez al cargar la página

  return (
    <div>
      <h1>Diseños Publicados</h1>
      <div>
        {publishedDesigns.length === 0 ? (
          <p>No se han publicado diseños aún.</p>
        ) : (
          <ul>
            {publishedDesigns.map((design, index) => (
              <li key={index}>
                <h3>{design.name}</h3>
                <p>Color de prenda: {design.color}</p>
                <div>
                  {design.stickers.map((sticker, i) => (
                    <img 
                      key={i}
                      src={sticker.url} 
                      alt={`Sticker ${i}`}
                      style={{ width: '100px', height: '100px', margin: '10px' }} 
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PublishPage;
